import { getCurrentUser } from "@/lib/auth/current-user";
import { CampuslandsInfoView } from "@/app/components/CampuslandsInfoView";

export const metadata = {
  title: "Info — Campuslands Tech & Plataforma Educativa Sector Agro",
  description:
    "Información institucional y comercial de Campuslands: Desarrollo de software, Inteligencia Artificial, aplicaciones web y móviles e integraciones a la medida.",
};

export default async function InfoPage() {
  const user = await getCurrentUser();
  return <CampuslandsInfoView userRole={user?.role} />;
}
