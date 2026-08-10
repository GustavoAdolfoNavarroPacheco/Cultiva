"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { advanceChatSession, startOrResumeChatSession, submitAnswer } from "@/lib/actions/chat";
import type { ChatAnswer } from "@/lib/db/schema";
import { PdfViewerModal } from "@/app/components/PdfViewerModal";
import { VideoViewerModal } from "@/app/components/VideoViewerModal";
import {
  SproutIcon,
  VideoIcon,
  PdfIcon,
  DownloadIcon,
  EyeIcon,
  HelpCircleIcon,
  CheckIcon,
  CloseIcon,
  ArrowRightIcon,
} from "@/app/components/icons";

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
  return `plataforma_educativa_chat_token_${courseId}`;
}

function resolvePdfUrl(url: string | null): string {
  if (!url || url.includes("cultiva.demo") || url.includes("example.com")) {
    return "/guias/guia-buenas-practicas-agroindustria.pdf";
  }
  return url;
}

function resolveVideoUrl(url: string | null): string {
  if (!url || url.includes("cultiva.demo") || url.includes("example.com")) {
    return "/videos/video-leccion-oficial.mp4";
  }
  return url;
}

function LessonBubbleExtra({ lesson }: { lesson?: Lesson }) {
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);

  if (!lesson) return null;

  const activePdfUrl = resolvePdfUrl(lesson.pdfUrl);
  const activeVideoUrl = resolveVideoUrl(lesson.videoUrl);

  return (
    <div className="mt-3 flex flex-wrap gap-2.5 pt-2.5 border-t border-slate-200">
      {/* Video Direct Download */}
      {lesson.videoUrl && (
        <a
          href={activeVideoUrl}
          download
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-900 transition-colors min-h-[40px] cursor-pointer"
        >
          <VideoIcon className="w-4 h-4" />
          <span>Descargar Video (MP4)</span>
          <DownloadIcon className="w-3.5 h-3.5 opacity-70" />
        </a>
      )}

      {/* Video Modal Preview Button */}
      {lesson.videoUrl && (
        <button
          type="button"
          onClick={() => setIsVideoPreviewOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors min-h-[40px] cursor-pointer"
        >
          <EyeIcon className="w-4 h-4 text-emerald-700" />
          <span>Ver Video (Previsualizar)</span>
        </button>
      )}

      {/* PDF Direct Download */}
      {lesson.pdfUrl && (
        <a
          href={activePdfUrl}
          download
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors min-h-[40px] cursor-pointer"
        >
          <PdfIcon className="w-4 h-4 text-emerald-700" />
          <span>Descargar PDF</span>
          <DownloadIcon className="w-3.5 h-3.5 opacity-70" />
        </a>
      )}

      {/* PDF Modal Preview Button */}
      {lesson.pdfUrl && (
        <button
          type="button"
          onClick={() => setIsPdfPreviewOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors min-h-[40px] cursor-pointer"
        >
          <EyeIcon className="w-4 h-4 text-slate-600" />
          <span>Ver PDF (Previsualizar)</span>
        </button>
      )}

      {/* PDF Viewer Modal */}
      {lesson.pdfUrl && (
        <PdfViewerModal
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          pdfUrl={activePdfUrl}
          title={`Guía PDF: ${lesson.title}`}
        />
      )}

      {/* Video Viewer Modal */}
      {lesson.videoUrl && (
        <VideoViewerModal
          isOpen={isVideoPreviewOpen}
          onClose={() => setIsVideoPreviewOpen(false)}
          videoUrl={activeVideoUrl}
          title={`Video Lección: ${lesson.title}`}
        />
      )}
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-tl-xs bg-white border border-slate-200 p-4.5 text-base leading-relaxed text-slate-900 shadow-xs"
    >
      {children}
    </motion.div>
  );
}

export function ChatSimulator({
  courseId,
  steps,
  lessonsById,
  studentId,
}: {
  courseId: number;
  steps: Step[];
  lessonsById: Record<number, Lesson>;
  studentId: number | null;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [pending, setPending] = useState(false);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const existingToken = studentId ? null : window.localStorage.getItem(storageKey(courseId));
    startOrResumeChatSession(courseId, { studentId, existingToken }).then((result) => {
      if (!studentId) {
        window.localStorage.setItem(storageKey(courseId), result.token);
      }
      setSession({
        token: result.token,
        currentStepOrder: result.currentStepOrder,
        answers: result.answers,
        completed: result.completed,
      });
    });
  }, [courseId, studentId]);

  if (!session) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center text-base font-bold text-slate-600 animate-pulse">
        Conectando con el Agente de Plataforma Educativa…
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
    <div className="overflow-hidden rounded-3xl border border-slate-300 bg-slate-900 shadow-xl">
      {/* WhatsApp Header */}
      <div className="flex items-center gap-3.5 border-b border-slate-800 bg-slate-900 px-5 py-4 text-white shadow-xs">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-white font-bold shadow-xs">
          <SproutIcon className="w-6 h-6" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-white">Agente Plataforma Educativa</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            {session.completed ? "Curso Finalizado" : "En línea — Asistente de Capacitación"}
          </p>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="space-y-6 px-4 py-6 sm:p-6 bg-[#f0f2f0] min-h-[420px]">
        {visibleSteps.map((step) => {
          const answer = session.answers.find((a) => a.stepId === step.id);
          const isCurrentUnanswered = step.id === lastStep?.id && step.kind === "question" && !answer;

          return (
            <div key={step.id} className="space-y-3">
              <BotBubble>
                <p className="font-medium text-slate-900">{step.messageText}</p>
                {step.kind === "lesson" && step.lessonId && (
                  <LessonBubbleExtra lesson={lessonsById[step.lessonId]} />
                )}
                {step.kind === "question" && step.question && (
                  <div className="mt-3 font-bold text-slate-900 text-base border-t border-slate-200 pt-2.5 flex items-start gap-2">
                    <HelpCircleIcon className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{step.question}</span>
                  </div>
                )}
              </BotBubble>

              {step.kind === "question" && step.options && (
                <div className="ml-1 sm:ml-4 space-y-2.5 max-w-[95%]">
                  {step.options.map((option, index) => {
                    const isChosen = answer?.optionIndex === index;
                    const showResult = Boolean(answer);

                    let buttonStyle = "border-2 border-emerald-700/30 bg-white text-slate-900 hover:bg-emerald-50 hover:border-emerald-700";
                    if (showResult) {
                      if (isChosen) {
                        buttonStyle = answer!.correct
                          ? "border-2 border-emerald-600 bg-emerald-100 text-emerald-950 font-bold shadow-xs"
                          : "border-2 border-rose-500 bg-rose-50 text-rose-950 font-bold";
                      } else {
                        buttonStyle = "border border-slate-200 bg-slate-100/80 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <motion.button
                        key={option}
                        type="button"
                        disabled={!isCurrentUnanswered || pending}
                        onClick={() => handleAnswer(step.id, index)}
                        whileHover={isCurrentUnanswered ? { scale: 1.01 } : undefined}
                        whileTap={isCurrentUnanswered ? { scale: 0.98 } : undefined}
                        className={`w-full text-left min-h-[50px] rounded-2xl px-5 py-3.5 text-base transition-all flex items-center justify-between gap-3 shadow-xs ${buttonStyle}`}
                      >
                        <span className="font-semibold">{option}</span>
                        {showResult && isChosen && (
                          <span className="flex items-center gap-1.5 text-sm font-bold shrink-0">
                            {answer!.correct ? (
                              <>
                                <CheckIcon className="w-5 h-5 text-emerald-700" />
                                <span className="text-emerald-800">¡Correcto!</span>
                              </>
                            ) : (
                              <>
                                <CloseIcon className="w-5 h-5 text-rose-600" />
                                <span className="text-rose-800">Incorrecto</span>
                              </>
                            )}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="btn-farmer-primary text-base px-7"
            >
              <span>{pending ? "Cargando…" : "Siguiente Paso"}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </div>
        )}

        {session.completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-emerald-100 border border-emerald-400/60 p-6 text-center shadow-sm"
          >
            <div className="inline-flex p-3 bg-emerald-800 text-white rounded-full mb-2">
              <CheckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-emerald-950">¡Curso Completado con Éxito!</h3>
            <p className="mt-1 text-sm font-bold text-emerald-900">
              Respondiste correctamente {correctCount} de {questionCount} preguntas.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
