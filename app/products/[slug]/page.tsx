import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Card, Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { currencyBRL } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();

  if (!product) notFound();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let alreadyOwned = false;

  if (user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id,status")
      .eq("product_id", product.id)
      .eq("user_id", user.id)
      .eq("status", "paid")
      .maybeSingle();
    alreadyOwned = Boolean(purchase);
  }

  return (
    <Container>
      <div className="grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="text-sm font-black tracking-[0.2em] text-softGold">MISSÃO DE ESTUDO</div>
          <h1 className="mt-3 text-4xl font-black">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">{product.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">Acesso vitalício após pagamento aprovado.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">Conteúdo protegido por compra e login.</div>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-zinc-400">Preço</div>
          <div className="mt-2 text-4xl font-black text-white">{currencyBRL(product.price_brl)}</div>
          <div className="mt-3 text-sm text-zinc-400">Pix com liberação automática.</div>
          <div className="mt-6 space-y-3">
            {alreadyOwned ? (
              <Link href="/account" className="block rounded-2xl bg-gold px-4 py-3 text-center font-bold text-black">Abrir minha compra</Link>
            ) : user ? (
              <Link href={`/checkout/${product.slug}`} className="block rounded-2xl bg-gold px-4 py-3 text-center font-bold text-black">Comprar por Pix</Link>
            ) : (
              <Link href="/auth/login" className="block rounded-2xl bg-gold px-4 py-3 text-center font-bold text-black">Entrar para comprar</Link>
            )}
            {product.whatsapp_group_url && (
              <Link
                href={product.whatsapp_group_url}
                target="_blank"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white"
              >
                <MessageCircle size={18} /> Entrar no grupo de WhatsApp
              </Link>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}
