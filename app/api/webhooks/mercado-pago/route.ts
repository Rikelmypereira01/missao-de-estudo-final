import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPayment } from "@/lib/mercadopago";

function verifySignature(request: Request, body: string) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  const signature = request.headers.get("x-signature");
  if (!signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return signature.includes(expected);
}

export async function POST(request: Request) {
  const body = await request.text();

  if (!verifySignature(request, body)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  const payload = JSON.parse(body || "{}");
  const paymentId = payload?.data?.id || payload?.id;

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  const payment = await getPayment(String(paymentId));
  const externalReference = payment.external_reference;

  const admin = createAdminClient();
  const status = payment.status === "approved" ? "paid" : payment.status === "cancelled" ? "cancelled" : "pending";

  const { data: purchase } = await admin
    .from("purchases")
    .select("id")
    .eq("id", externalReference)
    .maybeSingle();

  if (purchase) {
    await admin
      .from("purchases")
      .update({
        status,
        provider_payment_id: String(payment.id),
        paid_at: status === "paid" ? new Date().toISOString() : null
      })
      .eq("id", purchase.id);

    await admin.from("sales_logs").insert({
      action: `payment_${status}`,
      purchase_id: purchase.id,
      metadata: payment
    });
  }

  return NextResponse.json({ ok: true });
}
