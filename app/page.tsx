import Link from "next/link";
import { ShieldCheck, ShoppingBag, LockKeyhole, MessageCircleMore } from "lucide-react";
import { Card, Container, Pill, Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { currencyBRL } from "@/lib/utils";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const featured = products?.[0];

  return (
    <Container>
      <section className="grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden">
          <div className="mb-6">
            <Pill>DOMÍNIO: missaodeestudo.com</Pill>
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Venda jogos, arquivos e treinamentos com login, Pix e conteúdo protegido.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Plataforma pronta para a Missão de Estudo com área do aluno, admin, histórico de vendas, bloqueio de acesso e grupo do WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/products">Ver produtos</Button>
            <Button href="/auth/login" variant="secondary">Entrar</Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
              <div className="font-black text-softGold">Segurança real</div>
              Login, verificação de compra, bloqueio por admin e acesso privado por permissão.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
              <div className="font-black text-softGold">Escala pronta</div>
              Estrutura preparada para PMAL, PMSE, ESA, apostilas, simulados e novos jogos.
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-white">Produto inicial</h2>
          {featured ? (
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-2xl font-black text-softGold">{featured.name}</div>
                <p className="mt-2 text-sm leading-7 text-zinc-300">{featured.description}</p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-gold/10 p-4">
                <div className="text-sm text-zinc-300">Preço inicial</div>
                <div className="text-3xl font-black text-white">{currencyBRL(featured.price_brl)}</div>
                <div className="mt-1 text-xs text-zinc-400">Acesso vitalício após pagamento aprovado.</div>
              </div>
              <Button href={`/products/${featured.slug}`}>Comprar agora</Button>
            </div>
          ) : (
            <p className="mt-4 text-zinc-300">Cadastre o primeiro produto pelo SQL seed ou pelo admin.</p>
          )}
        </Card>
      </section>

      <section className="grid gap-4 pb-12 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: ShieldCheck,
            title: "Acesso vitalício",
            text: "A compra aprovada libera o produto e o usuário continua com acesso até você bloquear manualmente."
          },
          {
            icon: ShoppingBag,
            title: "Minhas compras",
            text: "O aluno enxerga tudo o que comprou em uma área única, simples e profissional."
          },
          {
            icon: LockKeyhole,
            title: "Proteção de conteúdo",
            text: "Conteúdo local protegido por checagem de sessão e permissão de compra."
          },
          {
            icon: MessageCircleMore,
            title: "Grupo de WhatsApp",
            text: "Botão para entrar no grupo e aumentar retenção, comunidade e prova social."
          }
        ].map((item) => (
          <Card key={item.title}>
            <item.icon className="text-softGold" />
            <h3 className="mt-4 text-lg font-black">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-300">{item.text}</p>
          </Card>
        ))}
      </section>
    </Container>
  );
}
