"use client";

import { useEffect, useRef, useState } from "react";
import { advanceChatSession, startOrResumeChatSession, submitAnswer } from "@/lib/actions/chat";
import type { ChatAnswer } from "@/lib/db/schema";

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

type Lesson = { id: number; title: string; videoUrl: string | null; pdfUrl: string | null };

type Session = {
  token: string;
  currentStepOrder: number;
  answers: ChatAnswer[];
  completed: boolean;
};

function storageKey(courseId: number) {
  return `cultiva_chat_token_${courseId}`;
}

function LessonBubbleExtra({ lesson }: { lesson?: Lesson }) {
  if (!lesson) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {lesson.videoUrl && (
        <a
          href={lesson.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-whatsapp/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-whatsapp-ink"
        >
          ▶ Ver video
        </a>
      )}
      {lesson.pdfUrl && (
        <a
          href={lesson.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-whatsapp/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-whatsapp-ink"
        >
          📄 Ver guía PDF
        </a>
      )}
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-paper-deep px-4 py-3 text-[14px] leading-relaxed text-ink">
      {children}
    </div>
  );
}

export function ChatSimulator({
  courseId,
  steps,
  lessonsById,
}: {
  courseId: number;
  steps: Step[];
  lessonsById: Record<number, Lesson>;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [pending, setPending] = useState(false);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const existingToken = window.localStorage.getItem(storageKey(courseId));
    startOrResumeChatSession(courseId, existingToken).then((result) => {
      window.localStorage.setItem(storageKey(courseId), result.token);
      setSession({
        token: result.token,
        currentStepOrder: result.currentStepOrder,
        answers: result.answers,
        completed: result.completed,
      });
    });
  }, [courseId]);

  if (!session) {
    return (
      <div className="rounded-2xl border border-paper-line bg-paper p-8 text-center text-ink-faint">
        Conectando con el agente…
      </div>
    );
  }

  const visibleSteps = steps.filter((step) => step.order <= session.currentStepOrder);
  const lastStep = visibleSteps[visibleSteps.length - 1];

  async function handleAdvance() {
    setPending(true);
    const updated = await advanceChatSession(session!.token);
    setSession({
      token: updated.token,
      currentStepOrder: updated.currentStepOrder,
      answers: updated.answers,
      completed: updated.completed,
    });
    setPending(false);
  }

  async function handleAnswer(stepId: number, optionIndex: number) {
    setPending(true);
    const { session: updated } = await submitAnswer(session!.token, stepId, optionIndex);
    setSession({
      token: updated.token,
      currentStepOrder: updated.currentStepOrder,
      answers: updated.answers,
      completed: updated.completed,
    });
    setPending(false);
  }

  const correctCount = session.answers.filter((answer) => answer.correct).length;
  const questionCount = steps.filter((step) => step.kind === "question").length;

  return (
    <div className="rounded-2xl border border-paper-line bg-paper shadow-[4px_4px_0_0_rgba(36,29,18,0.06)]">
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-paper-line bg-whatsapp-ink px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper font-display text-sm font-semibold text-whatsapp-ink">
          C
        </div>
        <div>
          <p className="text-[14px] font-medium text-paper">Agente Cultiva</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-paper/70">
            {session.completed ? "curso completado" : "en línea"}
          </p>
        </div>
      </div>

      <div className="space-y-4 px-5 py-6">
        {visibleSteps.map((step) => {
          const answer = session.answers.find((a) => a.stepId === step.id);
          const isCurrentUnanswered = step.id === lastStep?.id && step.kind === "question" && !answer;

          return (
            <div key={step.id} className="space-y-2">
              <BotBubble>
                <p>{step.messageText}</p>
                {step.kind === "lesson" && step.lessonId && (
                  <LessonBubbleExtra lesson={lessonsById[step.lessonId]} />
                )}
                {step.kind === "question" && step.question && (
                  <p className="mt-2 font-medium">{step.question}</p>
                )}
              </BotBubble>

              {step.kind === "question" && step.options && (
                <div className="ml-1 flex flex-col items-start gap-2">
                  {step.options.map((option, index) => {
                    const isChosen = answer?.optionIndex === index;
                    const showResult = Boolean(answer);
                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={!isCurrentUnanswered || pending}
                        onClick={() => handleAnswer(step.id, index)}
                        className={`rounded-full border px-4 py-2 text-left text-[13px] transition-colors ${
                          showResult
                            ? isChosen
                              ? answer!.correct
                                ? "border-offline bg-offline/15 text-offline-ink"
                                : "border-clay bg-clay/10 text-clay-deep"
                              : "border-paper-line text-ink-faint"
                            : "border-whatsapp/40 text-ink hover:bg-whatsapp/10"
                        }`}
                      >
                        {option}
                        {showResult && isChosen && (answer!.correct ? " ✓" : " ✕")}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {!session.completed && lastStep && lastStep.kind !== "question" && (
          <button
            type="button"
            onClick={handleAdvance}
            disabled={pending}
            className="rounded-full bg-whatsapp-ink px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-paper disabled:opacity-60"
          >
            {pending ? "…" : "Siguiente →"}
          </button>
        )}

        {session.completed && (
          <div className="rounded-xl bg-offline/10 px-4 py-3 text-[13px] text-offline-ink">
            Curso completado. Respondiste correctamente {correctCount} de {questionCount} preguntas.
          </div>
        )}
      </div>
    </div>
  );
}
