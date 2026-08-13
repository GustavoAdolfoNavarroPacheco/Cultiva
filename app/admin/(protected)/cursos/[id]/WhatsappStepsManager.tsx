"use client";

import { useState } from "react";
import {
  createWhatsappStep,
  deleteWhatsappStep,
  updateWhatsappStep,
} from "@/lib/actions/whatsapp-steps";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";
import { ChatIcon, ArrowRightIcon } from "@/app/components/icons";

type Step = {
  id: number;
  order: number;
  kind: string;
  lessonId: number | null;
  messageText: string;
  question: string | null;
  options: string[] | null;
  correctOptionIndex: number | null;
};

type Lesson = { id: number; title: string };

const fieldClass =
  "mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10 shadow-2xs";
const labelClass = "block text-xs font-normal uppercase tracking-wider text-slate-700";
const primaryBtnSm =
  "btn-farmer-primary rounded-xl text-sm font-bold cursor-pointer disabled:opacity-60 min-h-[42px] px-5";

const kindLabels: Record<string, string> = {
  welcome: "Bienvenida",
  lesson: "Lección",
  question: "Pregunta",
  closing: "Cierre",
};

function StepFields({
  lessons,
  defaultValues,
}: {
  lessons: Lesson[];
  defaultValues?: Partial<Step>;
}) {
  const [kind, setKind] = useState(defaultValues?.kind ?? "welcome");
  const needsLesson = kind === "lesson" || kind === "question";
  const isQuestion = kind === "question";

  return (
    <>
      <div>
        <label className={labelClass}>Tipo de Paso *</label>
        <select
          name="kind"
          value={kind}
          onChange={(event) => setKind(event.target.value)}
          className={fieldClass}
        >
          <option value="welcome">Bienvenida</option>
          <option value="lesson">Lección</option>
          <option value="question">Pregunta</option>
          <option value="closing">Cierre</option>
        </select>
      </div>

      {needsLesson && (
        <div>
          <label className={labelClass}>Lección Asociada</label>
          <select
            name="lessonId"
            defaultValue={defaultValues?.lessonId ?? ""}
            className={fieldClass}
          >
            <option value="">Selecciona una lección</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="sm:col-span-2">
        <label className={labelClass}>Mensaje del Agente *</label>
        <textarea
          name="messageText"
          required
          rows={3}
          defaultValue={defaultValues?.messageText ?? ""}
          className={fieldClass}
          placeholder="Escribe el mensaje exacto que enviará el bot en WhatsApp..."
        />
      </div>

      {isQuestion && (
        <>
          <div className="sm:col-span-2">
            <label className={labelClass}>Pregunta</label>
            <input
              name="question"
              defaultValue={defaultValues?.question ?? ""}
              className={fieldClass}
              placeholder="Ej. ¿Cuál es el primer paso antes de sembrar?"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Opciones de Respuesta (Una por línea)</label>
            <textarea
              name="options"
              rows={3}
              defaultValue={defaultValues?.options?.join("\n") ?? ""}
              className={fieldClass}
              placeholder={"Opción A\nOpción B\nOpción C"}
            />
          </div>
          <div>
            <label className={labelClass}>Índice Opción Correcta (0, 1, 2…)</label>
            <input
              name="correctOptionIndex"
              type="number"
              min={0}
              defaultValue={defaultValues?.correctOptionIndex ?? 0}
              className={fieldClass}
            />
          </div>
        </>
      )}
    </>
  );
}

function StepEditForm({
  step,
  courseId,
  lessons,
  onDone,
}: {
  step: Step;
  courseId: number;
  lessons: Lesson[];
  onDone: () => void;
}) {
  return (
    <form
      action={async (formData) => {
        await updateWhatsappStep(step.id, courseId, formData);
        onDone();
      }}
      className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-4 rounded-xl border border-slate-300"
    >
      <StepFields lessons={lessons} defaultValues={step} />
      <div className="sm:col-span-2 flex items-center gap-3 pt-2">
        <button type="submit" className={primaryBtnSm}>
          Guardar Paso
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-xs font-normal uppercase tracking-wider text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function StepRow({
  step,
  courseId,
  lessons,
}: {
  step: Step;
  courseId: number;
  lessons: Lesson[];
}) {
  const [editing, setEditing] = useState(false);
  const lessonTitle = lessons.find((lesson) => lesson.id === step.lessonId)?.title;

  if (editing) {
    return <StepEditForm step={step} courseId={courseId} lessons={lessons} onDone={() => setEditing(false)} />;
  }

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:bg-slate-50/80 shadow-2xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-lg bg-emerald-100 px-2.5 py-0.5 text-xs font-normal uppercase tracking-wider text-emerald-900 border border-emerald-300">
            Paso {step.order} · {kindLabels[step.kind] ?? step.kind}
          </span>
          {lessonTitle && <span className="text-xs font-semibold text-slate-500">Lección: {lessonTitle}</span>}
        </div>
        <p className="mt-1.5 text-sm font-semibold text-slate-900">{step.messageText}</p>
        {step.question && (
          <div className="mt-2.5 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-900">❓ {step.question}</p>
            <ul className="mt-1.5 space-y-1 pl-2">
              {step.options?.map((option, index) => (
                <li
                  key={option}
                  className={`text-xs font-semibold ${index === step.correctOptionIndex ? "text-emerald-800 font-bold" : "text-slate-600"}`}
                >
                  • {option}
                  {index === step.correctOptionIndex ? " (correcta ✓)" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-normal uppercase tracking-wider text-emerald-800 hover:text-emerald-950 cursor-pointer"
        >
          Editar
        </button>
        <ConfirmDeleteForm
          action={deleteWhatsappStep.bind(null, step.id, courseId)}
          confirmText="¿Eliminar este paso del flujo de WhatsApp?"
        >
          <button
            type="submit"
            className="text-xs font-normal uppercase tracking-wider text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
          >
            Eliminar
          </button>
        </ConfirmDeleteForm>
      </div>
    </li>
  );
}

export function WhatsappStepsManager({
  courseId,
  steps,
  lessons,
}: {
  courseId: number;
  steps: Step[];
  lessons: Lesson[];
}) {
  return (
    <div className="card-farmer p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-1 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
          <ChatIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Flujo de WhatsApp ({steps.length})</h2>
          <p className="text-xs font-medium text-slate-500">Secuencia de mensajes y preguntas interactivas.</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {steps.map((step) => (
          <StepRow key={step.id} step={step} courseId={courseId} lessons={lessons} />
        ))}
        {steps.length === 0 && (
          <p className="text-sm font-medium text-slate-400 text-center py-6">Todavía no hay pasos en este flujo.</p>
        )}
      </ul>

      <form
        action={createWhatsappStep.bind(null, courseId)}
        className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2"
      >
        <StepFields lessons={lessons} />
        <div className="sm:col-span-2 pt-2">
          <button type="submit" className={primaryBtnSm}>
            <span>Añadir Paso al Flujo</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
