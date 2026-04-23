import { notFound, redirect } from "next/navigation";
import { createPixCheckoutAction } from "@/app/server-actions";
import { Card, Container } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { currencyBRL } from "@/lib/utils";

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { user, profile } = await requireUser();
  if (profile?.is_blocked) redirect("/account?blocked=1");

  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();

  if (!product) notFound();

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-10">
        <Card>
          <h1 className="text-3xl font-black">Checkout Pix</h1>
          <p className="mt-2 text-zinc-400">Pagamento automático pelo Mercado Pago.</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-black text-softGold">{product.name}</div>
            <div className="mt-2 text-sm text-zinc-300">{product.description}</div>
            <div className="mt-4 text-3xl font-black">{currencyBRL(product.price_brl)}</div>
          </div>

          <form action={createPixCheckoutAction} className="mt-8 space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="email" value={user.email ?? profile?.email ?? ""} />
            <input type="hidden" name="name" value={profile?.full_name ?? user.email ?? "Aluno"} />
            <button className="w-full rounded-2xl bg-gold px-4 py-3 font-bold text-black">Gerar Pix</button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
