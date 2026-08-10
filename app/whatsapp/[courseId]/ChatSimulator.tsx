"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
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
          className="rounded-full bg-green-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white"
        >
          ▶ Ver video
        </a>
      )}
      {lesson.pdfUrl && (
        <a
          href={lesson.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-green-600/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-green-700"
        >
          📄 Ver guía PDF
        </a>
      )}
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-[14px] leading-relaxed text-ink"
    >
      {children}
    </motion.div>
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
      <div className="glass animate-sprout-in rounded-[var(--radius-lg)] p-8 text-center text-ink-faint">
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
    <div className="glass-strong animate-sprout-in overflow-hidden rounded-[var(--radius-lg)]">
      <div className="flex items-center gap-3 border-b border-white/50 bg-gradient-to-r from-green-600 to-green-500 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-green-700">
          C
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white">Agente Cultiva</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/75">
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
                      <motion.button
                        key={option}
                        type="button"
                        disabled={!isCurrentUnanswered || pending}
                        onClick={() => handleAnswer(step.id, index)}
                        whileHover={isCurrentUnanswered ? { scale: 1.03 } : undefined}
                        whileTap={isCurrentUnanswered ? { scale: 0.96 } : undefined}
                        className={`rounded-full border px-4 py-2 text-left text-[13px] transition-colors ${
                          showResult
                            ? isChosen
                              ? answer!.correct
                                ? "border-green-500 bg-green-100 text-green-700"
                                : "border-red-300 bg-red-50 text-red-600"
                              : "border-white/60 text-ink-faint"
                            : "border-green-600/30 bg-white/40 text-ink hover:bg-green-50"
                        }`}
                      >
                        {option}
                        {showResult && isChosen && (answer!.correct ? " ✓" : " ✕")}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {!session.completed && lastStep && lastStep.kind !== "question" && (
          <motion.button
            type="button"
            onClick={handleAdvance}
            disabled={pending}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="btn-glow rounded-full bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-white shadow-lg shadow-green-600/25 disabled:opacity-60"
          >
            {pending ? "…" : "Siguiente →"}
          </motion.button>
        )}

        {session.completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[var(--radius-md)] bg-green-100 px-4 py-3 text-[13px] font-medium text-green-700"
          >
            Curso completado. Respondiste correctamente {correctCount} de {questionCount} preguntas.
          </motion.div>
        )}
      </div>
    </div>
  );
}
