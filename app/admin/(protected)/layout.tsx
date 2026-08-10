import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Persistent Left Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content Area beside fixed sidebar */}
      <div className="md:pl-64 min-h-screen flex flex-col">
        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
