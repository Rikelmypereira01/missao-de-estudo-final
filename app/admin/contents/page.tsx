import { createContentAction, toggleContentAction } from "@/app/server-actions";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminContentsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("id,name").order("name");
  const { data: contents } = await supabase
    .from("contents")
    .select("*, products(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="text-2xl font-black">Novo conteúdo</div>
        <form action={createContentAction} className="mt-5 space-y-4">
          <select name="productId" required defaultValue="">
            <option value="" disabled>Selecione o produto</option>
            {products?.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
          <input name="title" placeholder="Título do conteúdo" required />
          <textarea name="description" rows={3} placeholder="Descrição" />
          <select name="contentType" defaultValue="external_link">
            <option value="external_link">Link externo</option>
            <option value="html_local">HTML local protegido</option>
          </select>
          <input name="localPath" placeholder="Ex.: private-content/pmal/portugues-pmal.html" />
          <input name="externalUrl" placeholder="https://..." />
          <input name="position" type="number" min="1" defaultValue="1" required />
          <button className="w-full rounded-2xl bg-gold px-4 py-3 font-bold text-black">Salvar conteúdo</button>
        </form>
      </Card>

      <Card>
        <div className="text-2xl font-black">Conteúdos</div>
        <div className="mt-4 overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contents?.map((content) => (
                <tr key={content.id}>
                  <td>{(content.products as { name: string }).name}</td>
                  <td>{content.title}</td>
                  <td>{content.content_type}</td>
                  <td>{content.is_active ? "Ativo" : "Oculto"}</td>
                  <td>
                    <form action={toggleContentAction}>
                      <input type="hidden" name="contentId" value={content.id} />
                      <input type="hidden" name="currentState" value={String(content.is_active)} />
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-bold">
                        {content.is_active ? "Ocultar" : "Ativar"}
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
