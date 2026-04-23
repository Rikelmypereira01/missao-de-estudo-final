import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import { Container } from "@/components/ui";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };

  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt={APP_NAME} width={64} height={64} className="rounded-2xl border border-gold/20" />
            <div>
              <div className="text-xs font-black tracking-[0.3em] text-softGold">MISSÃO DE ESTUDO</div>
              <div className="text-lg font-black text-white">Plataforma Premium</div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
            <Link href="/products" className="hover:text-softGold">Produtos</Link>
            {user ? (
              <>
                <Link href="/account" className="hover:text-softGold">Minha conta</Link>
                {profile?.role === "admin" && <Link href="/admin" className="hover:text-softGold">Admin</Link>}
              </>
            ) : (
              <Link href="/auth/login" className="hover:text-softGold">Entrar</Link>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
