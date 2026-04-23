import { blockUserAction, unblockUserAction } from "@/app/server-actions";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <Card>
      <div className="mb-4 text-2xl font-black">Usuários</div>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name || "Sem nome"}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_blocked ? "Bloqueado" : "Ativo"}</td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  {user.is_blocked ? (
                    <form action={unblockUserAction}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-bold">Reativar</button>
                    </form>
                  ) : (
                    <form action={blockUserAction}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 font-bold text-red-200">Bloquear</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
