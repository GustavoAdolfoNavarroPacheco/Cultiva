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
      <h1 className="font-display text-3xl font-semibold text-ink">Usuarios</h1>
      <p className="mt-1 text-ink-soft">Cuentas con acceso al panel administrativo.</p>

      <div className="mt-8">
        <UserCreateForm />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-paper-line bg-paper">
        <table className="w-full min-w-[480px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-paper-line text-ink-faint">
              <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Nombre</th>
              <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Correo</th>
              <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Rol</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id} className="border-b border-paper-line last:border-0">
                <td className="px-5 py-3 font-medium text-ink">{user.name}</td>
                <td className="px-5 py-3 text-ink-soft">{user.email}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-admin/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-admin-ink">
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
                        className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint hover:text-clay"
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
