import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  courses,
  lessons,
  puntosDigitales,
  students,
  whatsappMessages,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { OnePageView } from "./OnePageView";

export const metadata = {
  title: "One Page Estratégico — Plataforma Educativa Sector Agro",
  description:
    "Resumen ejecutivo del proyecto Plataforma Educativa Sector Agro: formación práctica para el sector agropecuario, con Puntos Digitales para conectarse a internet, Modo Offline para sedes rurales sin conexión y acompañamiento por WhatsApp.",
};

export const dynamic = "force-dynamic";

export default async function OnePage() {
  const user = await getCurrentUser();

  const [
    [coursesCountRes],
    [lessonsCountRes],
    [puntosCountRes],
    [studentsCountRes],
    [messagesCountRes],
  ] = await Promise.all([
    db.select({ val: count() }).from(courses),
    db.select({ val: count() }).from(lessons),
    db.select({ val: count() }).from(puntosDigitales),
    db.select({ val: count() }).from(students),
    db.select({ val: count() }).from(whatsappMessages),
  ]);

  const metrics = {
    coursesCount: coursesCountRes?.val ?? 0,
    lessonsCount: lessonsCountRes?.val ?? 0,
    puntosCount: puntosCountRes?.val ?? 0,
    studentsCount: studentsCountRes?.val ?? 0,
    messagesCount: messagesCountRes?.val ?? 0,
  };

  return <OnePageView userRole={user?.role} metrics={metrics} />;
}
