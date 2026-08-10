import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { BrandPanel } from "@/app/components/BrandPanel";
import { LoginForm } from "@/app/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-4xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <BrandPanel />
        <div className="flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
