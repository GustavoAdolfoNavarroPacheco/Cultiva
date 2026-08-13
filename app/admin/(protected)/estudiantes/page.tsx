import { getStudentsWithStats } from "@/lib/actions/students";
import { StudentsView } from "./StudentsView";

export const metadata = {
  title: "Gestión de Estudiantes — Panel Administrativo KHC",
  description:
    "Seguimiento detallado de avance de cursos y rendimiento en quizzes de estudiantes.",
};

export const dynamic = "force-dynamic";

export default async function AdminEstudiantesPage() {
  const students = await getStudentsWithStats();
  return <StudentsView initialStudents={students} />;
}
