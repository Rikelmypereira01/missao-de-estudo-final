import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { slug } = await params;

  const { data: content } = await supabase.from("contents").select("*").eq("slug", slug).eq("is_active", true).single();
  if (!content) {
    return NextResponse.json({ error: "Conteúdo não encontrado" }, { status: 404 });
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", content.product_id)
    .eq("status", "paid")
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  if (content.content_type === "external_link" && content.external_url) {
    return NextResponse.redirect(content.external_url);
  }

  const fullPath = path.join(process.cwd(), content.local_path ?? "");
  const html = await fs.readFile(fullPath, "utf8");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store"
    }
  });
}
