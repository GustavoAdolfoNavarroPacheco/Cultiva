import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { TopBar } from "@/app/components/TopBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar user={user} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
