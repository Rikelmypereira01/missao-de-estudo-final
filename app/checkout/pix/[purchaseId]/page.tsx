import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function PixResultPage({ params }: { params: Promise<{ purchaseId: string }> }) {
  const { user } = await requireUser();
  const { purchaseId } = await params;
  const supabase = await createClient();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("*, products(name)")
    .eq("id", purchaseId)
    .eq("user_id", user.id)
    .single();

  if (!purchase) notFound();

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-10">
        <Card>
          <h1 className="text-3xl font-black">Pix gerado</h1>
          <p className="mt-2 text-zinc-400">Assim que o pagamento for confirmado, o acesso será liberado automaticamente.</p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-black text-softGold">{(purchase.products as { name: string }).name}</div>
            <div className="mt-2 text-sm text-zinc-300">Status atual: {purchase.status}</div>
          </div>

          {purchase.pix_qr_code_base64 && (
            <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <Image
                src={`data:image/png;base64,${purchase.pix_qr_code_base64}`}
                alt="QR Code Pix"
                width={240}
                height={240}
                className="rounded-2xl bg-white p-3"
              />
              <textarea readOnly rows={6} value={purchase.pix_qr_code ?? ""} />
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}
