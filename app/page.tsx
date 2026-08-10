import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { BrandPanel } from "@/app/components/BrandPanel";
import { LoginForm } from "@/app/components/LoginForm";
import { PublicHeader } from "@/app/components/PublicHeader";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:py-16">
        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <BrandPanel />
          <div className="flex justify-center lg:justify-end">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
