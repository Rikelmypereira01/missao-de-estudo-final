"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createPixPayment } from "@/lib/mercadopago";
import { slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, requireUser } from "@/lib/auth";

export async function registerAction(formData: FormData) {
  const schema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
  });

  const parsed = schema.parse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: { full_name: parsed.fullName }
    }
  });

  if (error) throw new Error(error.message);
  redirect("/auth/login");
}

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  redirect("/account");
}

export async function createPixCheckoutAction(formData: FormData) {
  const { user, profile } = await requireUser();
  const supabase = await createClient();

  const productId = String(formData.get("productId") || "");
  const { data: product } = await supabase.from("products").select("*").eq("id", productId).single();
  if (!product) throw new Error("Produto não encontrado.");

  const { data: existingPaid } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .eq("status", "paid")
    .maybeSingle();

  if (existingPaid) {
    redirect(`/account/content/${product.slug}`);
  }

  const purchaseId = crypto.randomUUID();

  await supabase.from("purchases").insert({
    id: purchaseId,
    user_id: user.id,
    product_id: product.id,
    status: "pending",
    amount_brl: product.price_brl,
    provider: "mercado_pago"
  });

  const fullName = profile?.full_name || user.email || "Aluno Missão";
  const [firstName, ...rest] = fullName.split(" ");
  const payment = await createPixPayment({
    amount: product.price_brl,
    description: product.name,
    email: user.email || String(formData.get("email") || ""),
    firstName,
    lastName: rest.join(" ") || ".",
    externalReference: purchaseId
  });

  await supabase
    .from("purchases")
    .update({
      provider_payment_id: String(payment.id),
      pix_qr_code: payment.point_of_interaction?.transaction_data?.qr_code ?? null,
      pix_qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64 ?? null
    })
    .eq("id", purchaseId);

  redirect(`/checkout/pix/${purchaseId}`);
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");
  const price = Number(formData.get("price") || 0);
  const whatsappGroupUrl = String(formData.get("whatsappGroupUrl") || "") || null;

  await admin.from("products").insert({
    name,
    slug: slugify(name),
    description,
    price_brl: price,
    whatsapp_group_url: whatsappGroupUrl
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const productId = String(formData.get("productId") || "");
  const currentState = String(formData.get("currentState") || "false") === "true";

  await admin.from("products").update({ is_active: !currentState }).eq("id", productId);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function createContentAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const title = String(formData.get("title") || "");
  await admin.from("contents").insert({
    product_id: String(formData.get("productId") || ""),
    title,
    slug: slugify(title),
    description: String(formData.get("description") || "") || null,
    content_type: String(formData.get("contentType") || "external_link"),
    local_path: String(formData.get("localPath") || "") || null,
    external_url: String(formData.get("externalUrl") || "") || null,
    position: Number(formData.get("position") || 1)
  });

  revalidatePath("/admin/contents");
}

export async function toggleContentAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const contentId = String(formData.get("contentId") || "");
  const currentState = String(formData.get("currentState") || "false") === "true";

  await admin.from("contents").update({ is_active: !currentState }).eq("id", contentId);
  revalidatePath("/admin/contents");
}

export async function blockUserAction(formData: FormData) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const userId = String(formData.get("userId") || "");

  await admin.from("profiles").update({ is_blocked: true }).eq("id", userId);
  await admin.from("purchases").update({ status: "blocked" }).eq("user_id", userId).eq("status", "paid");
  await admin.from("sales_logs").insert({ action: "user_blocked", actor_user_id: user.id, target_user_id: userId });

  revalidatePath("/admin/users");
}

export async function unblockUserAction(formData: FormData) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const userId = String(formData.get("userId") || "");

  await admin.from("profiles").update({ is_blocked: false }).eq("id", userId);
  await admin.from("purchases").update({ status: "paid" }).eq("user_id", userId).eq("status", "blocked");
  await admin.from("sales_logs").insert({ action: "user_unblocked", actor_user_id: user.id, target_user_id: userId });

  revalidatePath("/admin/users");
}
