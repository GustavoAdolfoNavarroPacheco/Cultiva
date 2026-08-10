import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { deleteUser } from "@/lib/actions/users";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";
import { UserCreateForm } from "./UserCreateForm";
import { UsersIcon } from "@/app/components/icons";

export default async function UsersPage() {
  const [userList, currentUser] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    getCurrentUser(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header matched strictly to Panel Principal font hierarchy */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">
          Usuarios Administrativos
        </h1>
        <p className="mt-1 text-base text-slate-600 font-medium">
          Cuentas autorizadas con acceso a la gestión de contenidos de Plataforma Educativa.
        </p>
      </div>

      {/* Creation Form */}
      <div>
        <UserCreateForm />
      </div>

      {/* Table of Users with clear row dividers */}
      <div className="card-farmer overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UsersIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display text-xl font-bold text-slate-900">Usuarios Registrados ({userList.length})</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-500">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Correo Electrónico</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {userList.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-6 py-4.5 font-bold text-slate-900 text-base">{user.name}</td>
                  <td className="px-6 py-4.5 text-slate-600 font-medium">{user.email}</td>
                  <td className="px-6 py-4.5">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900 border border-emerald-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    {currentUser && Number(currentUser.sub) !== user.id && (
                      <ConfirmDeleteForm
                        action={deleteUser.bind(null, user.id)}
                        confirmText={`¿Eliminar la cuenta de ${user.name}?`}
                      >
                        <button
                          type="submit"
                          className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
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
    </div>
  );
}
