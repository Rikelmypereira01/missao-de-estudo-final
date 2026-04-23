import { DollarSign } from "lucide-react";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { currencyBRL, formatDate } from "@/lib/utils";

export default async function AdminSalesPage() {
  const supabase = await createClient();
  const { data: sales } = await supabase
    .from("purchases")
    .select("*, profiles(full_name,email), products(name)")
    .order("created_at", { ascending: false });

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2 text-2xl font-black"><DollarSign className="text-softGold" /> Minhas Vendas</div>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Comprador</th>
              <th>Produto</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {sales?.map((sale) => (
              <tr key={sale.id}>
                <td>{formatDate(sale.created_at)}</td>
                <td>{(sale.profiles as { full_name: string | null; email: string }).full_name || (sale.profiles as { email: string }).email}</td>
                <td>{(sale.products as { name: string }).name}</td>
                <td>{sale.status}</td>
                <td>{currencyBRL(sale.amount_brl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
