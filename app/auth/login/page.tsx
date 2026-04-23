import Link from "next/link";
import { loginAction } from "@/app/server-actions";
import { Card, Container } from "@/components/ui";

export default function LoginPage() {
  return (
    <Container>
      <div className="mx-auto max-w-md py-10">
        <Card>
          <h1 className="text-3xl font-black">Entrar</h1>
          <form action={loginAction} className="mt-6 space-y-4">
            <input name="email" type="email" placeholder="Seu email" required />
            <input name="password" type="password" placeholder="Sua senha" required />
            <button className="w-full rounded-2xl bg-gold px-4 py-3 font-bold text-black">Entrar</button>
          </form>
          <p className="mt-5 text-sm text-zinc-400">
            Ainda não tem conta? <Link href="/auth/register" className="text-softGold">Criar conta</Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
