"use client";

import { useState } from "react";
import {
  createWhatsappStep,
  deleteWhatsappStep,
  updateWhatsappStep,
} from "@/lib/actions/whatsapp-steps";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";

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
  "mt-1.5 w-full rounded-lg border border-paper-line bg-paper px-3.5 py-2.5 text-[14px] text-ink focus:border-clay";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft";

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
        <label className={labelClass}>Tipo de paso</label>
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
          <label className={labelClass}>Lección asociada</label>
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
        <label className={labelClass}>Mensaje del agente</label>
        <textarea
          name="messageText"
          required
          rows={2}
          defaultValue={defaultValues?.messageText ?? ""}
          className={fieldClass}
          placeholder="Lo que el agente envía en el chat"
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
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Opciones (una por línea)</label>
            <textarea
              name="options"
              rows={3}
              defaultValue={defaultValues?.options?.join("\n") ?? ""}
              className={fieldClass}
              placeholder={"Opción A\nOpción B\nOpción C"}
            />
          </div>
          <div>
            <label className={labelClass}>Índice de la opción correcta (0, 1, 2…)</label>
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
      className="grid gap-3 sm:grid-cols-2"
    >
      <StepFields lessons={lessons} defaultValues={step} />
      <div className="sm:col-span-2 flex gap-3">
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-paper"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onDone}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint"
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
    return (
      <li className="rounded-lg border border-paper-line p-4">
        <StepEditForm step={step} courseId={courseId} lessons={lessons} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-paper-line p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-whatsapp/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-whatsapp-ink">
            {step.order} · {kindLabels[step.kind] ?? step.kind}
          </span>
          {lessonTitle && <span className="text-[12px] text-ink-faint">{lessonTitle}</span>}
        </div>
        <p className="mt-1.5 text-[14px] text-ink">{step.messageText}</p>
        {step.question && (
          <div className="mt-2 text-[13px] text-ink-soft">
            <p className="font-medium">{step.question}</p>
            <ul className="mt-1 list-inside list-disc">
              {step.options?.map((option, index) => (
                <li key={option} className={index === step.correctOptionIndex ? "text-offline-ink" : ""}>
                  {option}
                  {index === step.correctOptionIndex ? " (correcta)" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay"
        >
          Editar
        </button>
        <ConfirmDeleteForm
          action={deleteWhatsappStep.bind(null, step.id, courseId)}
          confirmText="¿Eliminar este paso del flujo de WhatsApp?"
        >
          <button type="submit" className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
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
    <div className="rounded-xl border border-paper-line bg-paper p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Flujo del agente de WhatsApp</h2>
      <p className="mt-1 text-[13px] text-ink-faint">
        Secuencia fija de mensajes y preguntas que el simulador de WhatsApp recorre en orden.
      </p>

      <ul className="mt-5 space-y-3">
        {steps.map((step) => (
          <StepRow key={step.id} step={step} courseId={courseId} lessons={lessons} />
        ))}
        {steps.length === 0 && (
          <p className="text-[14px] text-ink-faint">Todavía no hay pasos configurados.</p>
        )}
      </ul>

      <form
        action={createWhatsappStep.bind(null, courseId)}
        className="mt-6 grid gap-3 border-t border-paper-line pt-5 sm:grid-cols-2"
      >
        <StepFields lessons={lessons} />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-clay px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-paper"
          >
            Añadir paso
          </button>
        </div>
      </form>
    </div>
  );
}
