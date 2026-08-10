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
    <div>
      <Link
        href="/admin/cursos"
        className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint hover:text-clay"
      >
        ← Cursos
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{course.title}</h1>
        <ConfirmDeleteForm
          action={deleteCourse.bind(null, course.id)}
          confirmText={`¿Eliminar el curso "${course.title}" y todo su contenido? Esta acción no se puede deshacer.`}
        >
          <button
            type="submit"
            className="rounded-full border border-clay/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-clay hover:bg-clay/10"
          >
            Eliminar curso
          </button>
        </ConfirmDeleteForm>
      </div>

      <div className="mt-6 rounded-xl border border-paper-line bg-paper p-6">
        <CourseEditForm course={course} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
