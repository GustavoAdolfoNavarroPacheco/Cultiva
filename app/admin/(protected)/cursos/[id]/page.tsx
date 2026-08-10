import { notFound } from "next/navigation";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, whatsappSteps } from "@/lib/db/schema";
import { deleteCourse } from "@/lib/actions/courses";
import { CourseEditForm } from "../CourseForms";
import { LessonsManager } from "./LessonsManager";
import { WhatsappStepsManager } from "./WhatsappStepsManager";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";
import { ArrowLeftIcon } from "@/app/components/icons";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseId = Number(id);
  if (Number.isNaN(courseId)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const [courseLessons, steps] = await Promise.all([
    db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(asc(lessons.order)),
    db
      .select()
      .from(whatsappSteps)
      .where(eq(whatsappSteps.courseId, courseId))
      .orderBy(asc(whatsappSteps.order)),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/cursos"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Volver a Cursos</span>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">{course.title}</h1>
          <p className="mt-1 text-base text-slate-600 font-medium">Gestión de lecciones y flujo del agente de WhatsApp</p>
        </div>
        <ConfirmDeleteForm
          action={deleteCourse.bind(null, course.id)}
          confirmText={`¿Eliminar el curso "${course.title}" y todo su contenido? Esta acción no se puede deshacer.`}
        >
          <button
            type="submit"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-700 transition-colors hover:bg-rose-100 cursor-pointer shadow-2xs"
          >
            Eliminar Curso
          </button>
        </ConfirmDeleteForm>
      </div>

      <div className="card-farmer animate-sprout-in p-6 sm:p-8">
        <CourseEditForm course={course} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 pt-2">
        <LessonsManager courseId={course.id} lessons={courseLessons} />
        <WhatsappStepsManager
          courseId={course.id}
          steps={steps}
          lessons={courseLessons.map((lesson) => ({ id: lesson.id, title: lesson.title }))}
        />
      </div>
    </div>
  );
}
