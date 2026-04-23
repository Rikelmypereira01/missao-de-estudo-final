import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6 flex flex-wrap gap-3 text-sm font-bold text-zinc-300">
          <Link href="/admin" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Dashboard</Link>
          <Link href="/admin/sales" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Minhas Vendas</Link>
          <Link href="/admin/products" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Produtos</Link>
          <Link href="/admin/contents" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Conteúdos</Link>
          <Link href="/admin/users" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Usuários</Link>
        </div>
        {children}
      </div>
    </Container>
  );
}
