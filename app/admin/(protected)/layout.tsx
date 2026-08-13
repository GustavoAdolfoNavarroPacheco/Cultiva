import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { PageTransition } from "@/app/components/PageTransition";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50/50">
      {/* Persistent Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area beside fixed sidebar */}
      <div className="md:pl-64 h-screen flex flex-col">
        {/* Top Header Bar with Profile & Logout at top right */}
        <AdminTopBar user={user} />

        <main className="flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 max-w-7xl w-full mx-auto flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
