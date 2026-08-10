import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { deleteUser } from "@/lib/actions/users";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";
import { UserCreateForm } from "./UserCreateForm";

export default async function UsersPage() {
  const [userList, currentUser] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    getCurrentUser(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">Usuarios</h1>
      <p className="mt-1 text-ink-soft">Cuentas con acceso al panel administrativo.</p>

      <div className="mt-8 animate-sprout-in">
        <UserCreateForm />
      </div>

      <div
        className="glass animate-sprout-in mt-8 overflow-x-auto rounded-[var(--radius-lg)]"
        style={{ animationDelay: "120ms" }}
      >
        <table className="w-full min-w-[480px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-white/60 text-ink-faint">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">Nombre</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">Correo</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">Rol</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id} className="border-b border-white/50 transition-colors last:border-0 hover:bg-white/40">
                <td className="px-5 py-3 font-medium text-ink">{user.name}</td>
                <td className="px-5 py-3 text-ink-soft">{user.email}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-green-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {currentUser && Number(currentUser.sub) !== user.id && (
                    <ConfirmDeleteForm
                      action={deleteUser.bind(null, user.id)}
                      confirmText={`¿Eliminar a ${user.name}?`}
                    >
                      <button
                        type="submit"
                        className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint hover:text-red-600"
                      >
                        Eliminar
                      </button>
                    </ConfirmDeleteForm>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
