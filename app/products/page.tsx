import Link from "next/link";
import { Card, Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { currencyBRL } from "@/lib/utils";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*").eq("is_active", true).order("created_at");

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-4xl font-black">Produtos</h1>
        <p className="mt-2 text-zinc-400">Venda seus conteúdos com acesso vitalício e proteção de login.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {products?.map((product) => (
            <Card key={product.id}>
              <div className="text-2xl font-black text-softGold">{product.name}</div>
              <p className="mt-2 min-h-24 text-sm leading-7 text-zinc-300">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-2xl font-black">{currencyBRL(product.price_brl)}</div>
                <Link href={`/products/${product.slug}`} className="rounded-2xl bg-gold px-4 py-3 font-bold text-black">Ver produto</Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
