import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Container } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ProductContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { user } = await requireUser();
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (!product) notFound();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("*")
    .eq("product_id", product.id)
    .eq("user_id", user.id)
    .eq("status", "paid")
    .maybeSingle();

  if (!purchase) notFound();

  const { data: contents } = await supabase
    .from("contents")
    .select("*")
    .eq("product_id", product.id)
    .eq("is_active", true)
    .order("position");

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-4xl font-black">{product.name}</h1>
        <p className="mt-2 text-zinc-400">Apenas conteúdos liberados para a sua compra.</p>

        <div className="mt-8 grid gap-4">
          {contents?.map((content) => (
            <Card key={content.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xl font-black text-softGold">{content.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{content.description}</div>
                </div>
                {content.content_type === "html_local" ? (
                  <Link href={`/api/content/${content.slug}`} target="_blank" className="rounded-2xl bg-gold px-4 py-3 font-bold text-black">Abrir</Link>
                ) : (
                  <Link href={content.external_url ?? "#"} target="_blank" className="rounded-2xl bg-gold px-4 py-3 font-bold text-black">Abrir</Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
