"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UsersIcon,
  SearchIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  CloseIcon,
  PhoneIcon,
  BookIcon,
  HelpCircleIcon,
  AlertTriangleIcon,
  TagIcon,
} from "@/app/components/icons";
import {
  type StudentWithStats,
  type StudentCourseProgress,
  updateStudent,
  deleteStudent,
} from "@/lib/actions/students";

function getInitials(name: string): string {
  if (!name) return "ST";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDateLabel(date: Date | string): string {
  try {
    const d = new Date(date);
    return d.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function StudentsView({ initialStudents }: { initialStudents: StudentWithStats[] }) {
  const [studentsList, setStudentsList] = useState<StudentWithStats[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [accuracyFilter, setAccuracyFilter] = useState<string>("ALL");
  const [progressFilter, setProgressFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("RECENT");

  // Modales
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentWithStats | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<StudentWithStats | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentWithStats | null>(null);

  // Form states para edición
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editError, setEditError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Métricas Globales
  const totalStudents = studentsList.length;
  const avgCompletion =
    totalStudents > 0
      ? Number(
          (
            studentsList.reduce((acc, s) => acc + s.overallCompletionPercentage, 0) /
            totalStudents
          ).toFixed(1)
        )
      : 0;

  const studentsWithQuizzes = studentsList.filter((s) => s.totalQuizQuestionsAnswered > 0);
  const avgAccuracy =
    studentsWithQuizzes.length > 0
      ? Number(
          (
            studentsWithQuizzes.reduce((acc, s) => acc + s.accuracyPercentage, 0) /
            studentsWithQuizzes.length
          ).toFixed(1)
        )
      : 0;

  const activeStudentsCount = studentsList.filter(
    (s) => s.overallCompletionPercentage > 0
  ).length;

  // Filtrado y Ordenamiento
  const filteredStudents = studentsList.filter((student) => {
    // Filtro por texto
    const term = searchTerm.toLowerCase().trim();
    const matchesName = student.name.toLowerCase().includes(term);
    const matchesPhone = student.phone.toLowerCase().includes(term);
    if (term && !matchesName && !matchesPhone) return false;

    // Filtro por Porcentaje de Acierto
    if (accuracyFilter === "HIGH" && student.accuracyPercentage < 80) return false;
    if (
      accuracyFilter === "MED" &&
      (student.accuracyPercentage < 50 || student.accuracyPercentage >= 80)
    )
      return false;
    if (
      accuracyFilter === "LOW" &&
      (student.accuracyPercentage >= 50 || student.totalQuizQuestionsAnswered === 0)
    )
      return false;
    if (accuracyFilter === "ZERO" && student.totalQuizQuestionsAnswered > 0) return false;

    // Filtro por Progreso
    if (progressFilter === "COMPLETED" && student.overallCompletionPercentage < 100)
      return false;
    if (
      progressFilter === "IN_PROGRESS" &&
      (student.overallCompletionPercentage === 0 || student.overallCompletionPercentage === 100)
    )
      return false;
    if (progressFilter === "NOT_STARTED" && student.overallCompletionPercentage > 0)
      return false;

    return true;
  });

  filteredStudents.sort((a, b) => {
    if (sortBy === "PROGRESS_DESC") return b.overallCompletionPercentage - a.overallCompletionPercentage;
    if (sortBy === "PROGRESS_ASC") return a.overallCompletionPercentage - b.overallCompletionPercentage;
    if (sortBy === "ACCURACY_DESC") return b.accuracyPercentage - a.accuracyPercentage;
    if (sortBy === "NAME_ASC") return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Abrir Modal de Edición
  const handleOpenEdit = (student: StudentWithStats) => {
    setStudentToEdit(student);
    setEditName(student.name);
    setEditPhone(student.phone);
    setEditPassword("");
    setEditError("");
  };

  // Guardar Edición
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToEdit) return;

    startTransition(async () => {
      const res = await updateStudent(studentToEdit.id, {
        name: editName,
        phone: editPhone,
        password: editPassword || undefined,
      });

      if (res.success) {
        setStudentsList((prev) =>
          prev.map((s) =>
            s.id === studentToEdit.id
              ? { ...s, name: editName, phone: editPhone }
              : s
          )
        );
        setStudentToEdit(null);
      } else {
        setEditError(res.error || "Error al actualizar estudiante");
      }
    });
  };

  // Eliminar Estudiante
  const handleConfirmDelete = () => {
    if (!studentToDelete) return;

    startTransition(async () => {
      const res = await deleteStudent(studentToDelete.id);
      if (res.success) {
        setStudentsList((prev) => prev.filter((s) => s.id !== studentToDelete.id));
        setStudentToDelete(null);
      } else {
        alert(res.error || "No se pudo eliminar el estudiante");
      }
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Encabezado */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Estudiantes Registrados
        </h1>
        <p className="mt-1 text-base text-slate-600 font-normal">
          Seguimiento de avance en cursos, porcentaje de completado general y rendimiento en quizzes interactivos de WhatsApp.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-farmer p-5 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Estudiantes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">{totalStudents}</span>
            <span className="text-xs font-bold text-emerald-700">Registrados</span>
          </div>
          <p className="text-xs text-slate-500">Cuentas activas en la plataforma</p>
        </div>

        <div className="card-farmer p-5 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Avance Global Promedio
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-emerald-700">{avgCompletion}%</span>
            <span className="text-xs font-bold text-slate-500">Completación</span>
          </div>
          <p className="text-xs text-slate-500">Progreso acumulado en todos los cursos</p>
        </div>

        <div className="card-farmer p-5 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tasa de Acierto Quizzes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-amber-600">{avgAccuracy}%</span>
            <span className="text-xs font-bold text-slate-500">Aciertos</span>
          </div>
          <p className="text-xs text-slate-500">En {studentsWithQuizzes.length} estudiantes con intentos</p>
        </div>

        <div className="card-farmer p-5 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estudiantes Activos
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">{activeStudentsCount}</span>
            <span className="text-xs font-bold text-emerald-700">Con progreso</span>
          </div>
          <p className="text-xs text-slate-500">{totalStudents - activeStudentsCount} sin iniciar</p>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="card-farmer p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-12 items-center">
          {/* Input de Búsqueda */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl bg-slate-100/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:bg-white border border-slate-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Filtro por % de Acierto */}
          <div className="md:col-span-3">
            <select
              value={accuracyFilter}
              onChange={(e) => setAccuracyFilter(e.target.value)}
              className="w-full rounded-2xl bg-slate-100/90 px-4 py-2.5 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600/30 border border-slate-200"
            >
              <option value="ALL">Filtrar por Acierto: Todos</option>
              <option value="HIGH">Alto (≥ 80% Acierto)</option>
              <option value="MED">Medio (50% - 79% Acierto)</option>
              <option value="LOW">Bajo (&lt; 50% Acierto)</option>
              <option value="ZERO">Sin Quizzes Respondidos</option>
            </select>
          </div>

          {/* Filtro por Nivel de Completación */}
          <div className="md:col-span-2">
            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="w-full rounded-2xl bg-slate-100/90 px-3 py-2.5 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600/30 border border-slate-200"
            >
              <option value="ALL">Avance: Todos</option>
              <option value="COMPLETED">100% Completados</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="NOT_STARTED">Sin Iniciar</option>
            </select>
          </div>

          {/* Ordenar por */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-2xl bg-slate-100/90 px-3 py-2.5 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600/30 border border-slate-200"
            >
              <option value="RECENT">Más Recientes</option>
              <option value="PROGRESS_DESC">Mayor Progreso</option>
              <option value="PROGRESS_ASC">Menor Progreso</option>
              <option value="ACCURACY_DESC">Mayor Acierto</option>
              <option value="NAME_ASC">Nombre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Estudiantes */}
      <div className="card-farmer overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <UsersIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display text-xl font-bold text-slate-900">
              Estudiantes ({filteredStudents.length} de {totalStudents})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-500">
                <th className="px-6 py-3.5 text-xs font-normal uppercase tracking-wider">Estudiante</th>
                <th className="px-6 py-3.5 text-xs font-normal uppercase tracking-wider">Teléfono / Registro</th>
                <th className="px-6 py-3.5 text-xs font-normal uppercase tracking-wider min-w-[220px]">
                  Progreso Global (Todos los Cursos)
                </th>
                <th className="px-6 py-3.5 text-xs font-normal uppercase tracking-wider">
                  Tasa de Acierto (Quizzes)
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-normal uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => {
                const initials = getInitials(student.name);
                const isComplete = student.overallCompletionPercentage === 100;
                const inProgress = student.overallCompletionPercentage > 0 && !isComplete;

                // Color de badge de acierto
                let accuracyBadgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                if (student.totalQuizQuestionsAnswered > 0) {
                  if (student.accuracyPercentage >= 80) {
                    accuracyBadgeClass = "bg-emerald-100 text-emerald-900 border-emerald-300";
                  } else if (student.accuracyPercentage >= 50) {
                    accuracyBadgeClass = "bg-amber-100 text-amber-900 border-amber-300";
                  } else {
                    accuracyBadgeClass = "bg-rose-100 text-rose-900 border-rose-300";
                  }
                }

                return (
                  <tr key={student.id} className="transition-colors hover:bg-slate-50/80">
                    {/* Nombre y Avatar */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-sm border border-emerald-200 shadow-2xs">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{student.name}</p>
                          <p className="text-xs text-slate-500 font-mono">ID: #{student.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Teléfono y Fecha */}
                    <td className="px-6 py-4.5">
                      <p className="text-sm font-semibold text-slate-800 font-mono flex items-center gap-1.5">
                        <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.phone}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDateLabel(student.createdAt)}
                      </p>
                    </td>

                    {/* Porcentaje de Completación Global */}
                    <td className="px-6 py-4.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold rounded-full px-2.5 py-0.5 border ${
                              isComplete
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : inProgress
                                ? "bg-amber-50 text-amber-900 border-amber-300"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {student.overallCompletionPercentage}% Completado
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {student.completedCoursesCount}/{student.totalPublishedCourses} cursos
                          </span>
                        </div>

                        {/* Barra de Progreso */}
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isComplete
                                ? "bg-emerald-600"
                                : inProgress
                                ? "bg-amber-500"
                                : "bg-slate-300"
                            }`}
                            style={{ width: `${student.overallCompletionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Tasa de Acierto en Quizzes */}
                    <td className="px-6 py-4.5">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold rounded-full px-2.5 py-0.5 border ${accuracyBadgeClass}`}
                        >
                          {student.totalQuizQuestionsAnswered > 0
                            ? `${student.accuracyPercentage}% Acierto`
                            : "Sin Quizzes"}
                        </span>
                        {student.totalQuizQuestionsAnswered > 0 && (
                          <p className="text-[11px] text-slate-500 font-medium">
                            {student.correctQuizQuestions} de {student.totalQuizQuestionsAnswered} correctas
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForDetail(student)}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                        title="Ver desglose por curso"
                      >
                        <BookIcon className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Detalle</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(student)}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer shadow-2xs"
                        title="Editar información"
                      >
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudentToDelete(student)}
                        className="inline-flex items-center gap-1 rounded-xl bg-white text-rose-700 border border-rose-200 px-3 py-1.5 text-xs font-bold hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer shadow-2xs"
                        title="Eliminar estudiante"
                      >
                        <span>Eliminar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-500 font-medium">
                    No se encontraron estudiantes que coincidan con la búsqueda y filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: DESGLOSE DETALLADO POR CURSO */}
      <AnimatePresence>
        {selectedStudentForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Desglose de Cursos — {selectedStudentForDetail.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Tel: {selectedStudentForDetail.phone} • Progreso Global: {selectedStudentForDetail.overallCompletionPercentage}%
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudentForDetail(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {selectedStudentForDetail.coursesProgress.map((cp) => (
                  <div
                    key={cp.courseId}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4 text-emerald-700" />
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {cp.courseTitle}
                        </h4>
                      </div>

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          cp.status === "COMPLETADO"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : cp.status === "EN_PROGRESO"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {cp.status === "COMPLETADO"
                          ? "100% Completado"
                          : cp.status === "EN_PROGRESO"
                          ? `${cp.progressPercentage}% En Progreso`
                          : "0% Sin Iniciar"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cp.status === "COMPLETADO"
                            ? "bg-emerald-600"
                            : cp.status === "EN_PROGRESO"
                            ? "bg-amber-500"
                            : "bg-slate-300"
                        }`}
                        style={{ width: `${cp.progressPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Paso alcanzado: {cp.currentStepOrder} de {cp.totalSteps}</span>
                      <span>
                        Quizzes respondidos: {cp.correctAnswers}/{cp.totalAnswers} correctas
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDetail(null)}
                  className="btn-farmer-secondary text-sm"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDITAR ESTUDIANTE */}
      <AnimatePresence>
        {studentToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Editar Estudiante</h3>
                <button
                  onClick={() => setStudentToEdit(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nueva Contraseña (Opcional)
                  </label>
                  <input
                    type="password"
                    placeholder="Dejar en blanco para mantener la actual"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                  />
                </div>

                {editError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800 flex items-center gap-2">
                    <AlertTriangleIcon className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setStudentToEdit(null)}
                    className="btn-farmer-secondary text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn-farmer-primary text-sm"
                  >
                    <span>{isPending ? "Guardando..." : "Guardar Cambios"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ELIMINAR ESTUDIANTE */}
      <AnimatePresence>
        {studentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <AlertTriangleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">¿Eliminar Estudiante?</h3>
                  <p className="text-xs text-slate-500">Esta acción no se puede deshacer.</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 font-medium">
                ¿Estás seguro de que deseas eliminar permanentemente a{" "}
                <strong>{studentToDelete.name}</strong> ({studentToDelete.phone}) y su historial de aprendizaje?
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStudentToDelete(null)}
                  className="btn-farmer-secondary text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleConfirmDelete}
                  className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 text-sm transition-colors cursor-pointer shadow-sm"
                >
                  <span>{isPending ? "Eliminando..." : "Sí, Eliminar"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
