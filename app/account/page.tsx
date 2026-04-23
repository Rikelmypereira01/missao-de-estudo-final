import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card, Container } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { WHATSAPP_GROUP_URL } from "@/lib/constants";

export default async function AccountPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*, products(id,name,slug,whatsapp_group_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <Container>
      <div className="py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black">Minha conta</h1>
            <p className="mt-2 text-zinc-400">Olá, {profile?.full_name || user.email}</p>
          </div>
          <Link
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white"
          >
            <MessageCircle size={18} /> Entrar no grupo de WhatsApp
          </Link>
        </div>

        <div className="mt-8 grid gap-4">
          {(purchases ?? []).map((purchase) => {
            const product = purchase.products as { id: string; name: string; slug: string; whatsapp_group_url: string | null };
            return (
              <Card key={purchase.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xl font-black text-softGold">{product.name}</div>
                    <div className="mt-1 text-sm text-zinc-400">Compra em {formatDate(purchase.created_at)} · Status: {purchase.status}</div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {purchase.status === "paid" ? (
                      <Link href={`/account/content/${product.slug}`} className="rounded-2xl bg-gold px-4 py-3 font-bold text-black">Abrir conteúdo</Link>
                    ) : (
                      <Link href={`/checkout/pix/${purchase.id}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white">Ver Pix</Link>
                    )}
                    <Link
                      href={product.whatsapp_group_url || WHATSAPP_GROUP_URL}
                      target="_blank"
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white"
                    >
                      Grupo WhatsApp
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}

          {(!purchases || purchases.length === 0) && (
            <Card>
              <div className="text-zinc-300">Você ainda não possui compras. Vá para a área de produtos para começar.</div>
              <Link href="/products" className="mt-4 inline-flex rounded-2xl bg-gold px-4 py-3 font-bold text-black">Ver produtos</Link>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
