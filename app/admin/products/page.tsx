import { createProductAction, toggleProductAction } from "@/app/server-actions";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { currencyBRL } from "@/lib/utils";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="text-2xl font-black">Novo produto</div>
        <form action={createProductAction} className="mt-5 space-y-4">
          <input name="name" placeholder="Nome do produto" required />
          <textarea name="description" rows={4} placeholder="Descrição" required />
          <input name="price" type="number" step="0.01" min="1" placeholder="Preço" defaultValue="29.90" required />
          <input name="whatsappGroupUrl" placeholder="Link do grupo de WhatsApp" />
          <button className="w-full rounded-2xl bg-gold px-4 py-3 font-bold text-black">Criar produto</button>
        </form>
      </Card>

      <Card>
        <div className="text-2xl font-black">Produtos</div>
        <div className="mt-4 overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{currencyBRL(product.price_brl)}</td>
                  <td>{product.is_active ? "Ativo" : "Inativo"}</td>
                  <td>
                    <form action={toggleProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="currentState" value={String(product.is_active)} />
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-bold">
                        {product.is_active ? "Desativar" : "Ativar"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
