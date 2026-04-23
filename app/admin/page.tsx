import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { currencyBRL } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: salesCount }, { count: usersCount }, { count: productsCount }, { data: paidRows }] = await Promise.all([
    supabase.from("purchases").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("purchases").select("amount_brl").eq("status", "paid")
  ]);

  const revenue = (paidRows ?? []).reduce((sum, row) => sum + row.amount_brl, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black">Admin</h1>
        <p className="mt-2 text-zinc-400">Controle total da Missão de Estudo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><div className="text-sm text-zinc-400">Vendas pagas</div><div className="mt-2 text-3xl font-black">{salesCount ?? 0}</div></Card>
        <Card><div className="text-sm text-zinc-400">Receita</div><div className="mt-2 text-3xl font-black">{currencyBRL(revenue)}</div></Card>
        <Card><div className="text-sm text-zinc-400">Usuários</div><div className="mt-2 text-3xl font-black">{usersCount ?? 0}</div></Card>
        <Card><div className="text-sm text-zinc-400">Produtos</div><div className="mt-2 text-3xl font-black">{productsCount ?? 0}</div></Card>
      </div>
    </div>
  );
}
