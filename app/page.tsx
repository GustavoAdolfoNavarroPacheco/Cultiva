import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { BrandPanel } from "@/app/components/BrandPanel";
import { AuthPanel } from "@/app/components/AuthPanel";
import { PublicHeader } from "@/app/components/PublicHeader";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "student" ? "/puntos" : "/admin");
  }

  return (
    <div className="flex h-dvh flex-col overflow-y-auto lg:overflow-hidden">
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <BrandPanel />
          <div className="flex justify-center lg:justify-end">
            <AuthPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
