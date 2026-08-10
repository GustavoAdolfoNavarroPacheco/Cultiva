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
  return `agro_ai_chat_token_${courseId}`;
}

function LessonBubbleExtra({ lesson }: { lesson?: Lesson }) {
  if (!lesson) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2.5 pt-2 border-t border-emerald-950/10">
      {lesson.videoUrl && (
        <a
          href={lesson.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition-colors min-h-[44px]"
        >
          <span>▶</span> Ver Video de la Lección
        </a>
      )}
      {lesson.pdfUrl && (
        <a
          href={lesson.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-700/40 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-100 transition-colors min-h-[44px]"
        >
          <span>📄</span> Abrir Guía (PDF)
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
      className="max-w-[90%] sm:max-w-[85%] rounded-3xl rounded-tl-md bg-white border border-emerald-900/15 p-4 sm:p-5 text-base sm:text-lg leading-relaxed text-emerald-950 shadow-md shadow-emerald-950/5"
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
      <div className="rounded-3xl bg-white border-2 border-emerald-200 p-10 text-center text-lg font-bold text-emerald-900 animate-pulse">
        ⏳ Conectando con el Agente de Agro.ai…
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
    <div className="overflow-hidden rounded-3xl border-2 border-emerald-900/20 bg-slate-100 shadow-2xl">
      {/* WhatsApp Header */}
      <div className="flex items-center gap-3.5 border-b border-emerald-950/20 bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-900 px-5 py-4 text-white shadow-md">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white font-display text-xl font-black text-emerald-900 shadow-md">
          🌾
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-emerald-900" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight">Agente Agro.ai</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-300 flex items-center gap-1.5 mt-0.5">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-ping" />
            {session.completed ? "Curso Finalizado" : "En línea — Asistente de Capacitación"}
          </p>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="space-y-6 px-4 py-6 sm:p-6 bg-[#efeae2]/60 min-h-[420px]">
        {visibleSteps.map((step) => {
          const answer = session.answers.find((a) => a.stepId === step.id);
          const isCurrentUnanswered = step.id === lastStep?.id && step.kind === "question" && !answer;

          return (
            <div key={step.id} className="space-y-3">
              <BotBubble>
                <p className="font-medium text-emerald-950">{step.messageText}</p>
                {step.kind === "lesson" && step.lessonId && (
                  <LessonBubbleExtra lesson={lessonsById[step.lessonId]} />
                )}
                {step.kind === "question" && step.question && (
                  <p className="mt-3 font-bold text-emerald-950 text-lg border-t border-emerald-950/10 pt-2">
                    ❓ {step.question}
                  </p>
                )}
              </BotBubble>

              {step.kind === "question" && step.options && (
                <div className="ml-1 sm:ml-4 space-y-2.5 max-w-[95%]">
                  {step.options.map((option, index) => {
                    const isChosen = answer?.optionIndex === index;
                    const showResult = Boolean(answer);

                    let buttonStyle = "border-2 border-emerald-700/40 bg-white text-emerald-950 hover:bg-emerald-50 hover:border-emerald-700";
                    if (showResult) {
                      if (isChosen) {
                        buttonStyle = answer!.correct
                          ? "border-2 border-emerald-600 bg-emerald-100 text-emerald-950 font-bold shadow-md"
                          : "border-2 border-rose-500 bg-rose-50 text-rose-950 font-bold";
                      } else {
                        buttonStyle = "border border-gray-300 bg-gray-50/80 text-gray-400 opacity-60";
                      }
                    }

                    return (
                      <motion.button
                        key={option}
                        type="button"
                        disabled={!isCurrentUnanswered || pending}
                        onClick={() => handleAnswer(step.id, index)}
                        whileHover={isCurrentUnanswered ? { scale: 1.02 } : undefined}
                        whileTap={isCurrentUnanswered ? { scale: 0.98 } : undefined}
                        className={`w-full text-left min-h-[52px] rounded-2xl px-5 py-3.5 text-base sm:text-lg transition-all flex items-center justify-between gap-3 shadow-sm ${buttonStyle}`}
                      >
                        <span className="font-semibold">{option}</span>
                        {showResult && isChosen && (
                          <span className="text-xl font-bold">
                            {answer!.correct ? "✓ ¡Correcto!" : "✕ Incorrecto"}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {!session.completed && lastStep && lastStep.kind !== "question" && (
          <div className="pt-2 flex justify-start">
            <motion.button
              type="button"
              onClick={handleAdvance}
              disabled={pending}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="btn-farmer-primary text-lg min-h-[56px] px-8 shadow-xl"
            >
              <span>{pending ? "Cargando…" : "Siguiente Paso ➔"}</span>
            </motion.button>
          </div>
        )}

        {session.completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-emerald-100 border-2 border-emerald-600/40 p-6 text-center shadow-lg"
          >
            <span className="text-4xl">🎉</span>
            <h3 className="mt-2 text-2xl font-black text-emerald-950">¡Curso Completado con Éxito!</h3>
            <p className="mt-1 text-base font-bold text-emerald-900">
              Respondiste correctamente {correctCount} de {questionCount} preguntas.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
