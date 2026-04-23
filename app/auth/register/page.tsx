import Link from "next/link";
import { registerAction } from "@/app/server-actions";
import { Card, Container } from "@/components/ui";

export default function RegisterPage() {
  return (
    <Container>
      <div className="mx-auto max-w-md py-10">
        <Card>
          <h1 className="text-3xl font-black">Criar conta</h1>
          <form action={registerAction} className="mt-6 space-y-4">
            <input name="fullName" placeholder="Seu nome" required />
            <input name="email" type="email" placeholder="Seu email" required />
            <input name="password" type="password" placeholder="Crie uma senha" minLength={6} required />
            <button className="w-full rounded-2xl bg-gold px-4 py-3 font-bold text-black">Criar conta</button>
          </form>
          <p className="mt-5 text-sm text-zinc-400">
            Já tem conta? <Link href="/auth/login" className="text-softGold">Entrar</Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
