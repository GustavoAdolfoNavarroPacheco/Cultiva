"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  getOrCreateStudentConversation,
  sendStudentMessage,
  getCourseChatMessages,
  resetStudentConversation,
  type StudentChatMessage,
} from "@/lib/actions/student-chat";
import { PdfViewerModal } from "@/app/components/PdfViewerModal";
import { VideoViewerModal } from "@/app/components/VideoViewerModal";
import {
  PdfIcon,
  DownloadIcon,
  EyeIcon,
  HelpCircleIcon,
  CheckIcon,
  CloseIcon,
  ArrowRightIcon,
  SendIcon,
  PaperclipIcon,
  RotateCcwIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserIcon,
  DoubleCheckIcon,
} from "@/app/components/icons";

interface ChatSimulatorProps {
  courseId: number;
  courseTitle: string;
  courseCategory?: string;
  studentId: number | null;
  studentName: string | null;
  studentPhone: string | null;
}

const WHATSAPP_FORMAT_REGEX = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~)/g;

function renderWhatsAppText(content: string): React.ReactNode[] {
  return content.split(WHATSAPP_FORMAT_REGEX).map((part, idx) => {
    if (/^\*[^*\n]+\*$/.test(part)) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {part.slice(1, -1)}
        </strong>
      );
    }
    if (/^_[^_\n]+_$/.test(part)) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (/^~[^~\n]+~$/.test(part)) {
      return (
        <s key={idx} className="line-through opacity-75">
          {part.slice(1, -1)}
        </s>
      );
    }
    return part;
  });
}

function formatMessageTime(date: Date | string): string {
  try {
    const d = new Date(date);
    return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function ChatSimulator({
  courseId,
  courseTitle,
  courseCategory,
  studentId,
  studentName,
  studentPhone,
}: ChatSimulatorProps) {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<StudentChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Modales
  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: "",
    title: "",
  });

  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: "",
    title: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bootstrapped = useRef(false);

  // Carga inicial
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    async function init() {
      setIsLoading(true);
      try {
        const res = await getOrCreateStudentConversation(courseId, {
          studentId,
          studentName,
          studentPhone,
        });
        setConversationId(res.conversation.id);
        setMessages(res.messages);
      } catch (err) {
        console.error("Error inicializando chat:", err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [courseId, studentId, studentName, studentPhone]);

  // Polling cada 3 segundos para sincronización en tiempo real con panel de administración
  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getCourseChatMessages(conversationId);
        // Solo actualizar si hay cambios en la longitud o último mensaje
        setMessages((prev) => {
          if (res.messages.length !== prev.length || (res.messages[res.messages.length - 1]?.id !== prev[prev.length - 1]?.id)) {
            return res.messages;
          }
          return prev;
        });
      } catch (err) {
        // Silenciar errores de polling para no interrumpir la experiencia
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  // Enviar mensaje
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !conversationId || isSending) return;

    if (!textToSend) {
      setInputText("");
    }

    // Optimistic UI
    const tempId = -Date.now();
    const optimisticMessage: StudentChatMessage = {
      id: tempId,
      conversationId,
      author: "STUDENT",
      type: "TEXTO",
      content: text,
      fileName: null,
      fileUrl: null,
      fileMimeType: null,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setIsSending(true);
    setIsAiTyping(true);

    try {
      const result = await sendStudentMessage(conversationId, courseId, text, studentId);
      if (result.success && result.messages) {
        setMessages(result.messages);
      }
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      alert("No se pudo enviar el mensaje. Intenta de nuevo.");
    } finally {
      setIsSending(false);
      setIsAiTyping(false);
    }
  };

  // Reiniciar chat
  const handleResetChat = async () => {
    if (!conversationId) return;
    if (!window.confirm("¿Deseas reiniciar la conversación de este curso desde el inicio?")) return;

    setIsLoading(true);
    try {
      const res = await resetStudentConversation(conversationId, courseId);
      setMessages(res.messages);
    } catch (err) {
      console.error("Error reiniciando conversación:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizador de burbuja con detección de PDF, Quiz y Curso Completado
  const renderMessageContent = (msg: StudentChatMessage) => {
    let content = msg.content;
    const isStudent = msg.author === "STUDENT";
    const isAi = msg.author === "AGENTE_IA";
    const isAdmin = msg.author === "ADMIN";

    // 1. Detección de PDF: [PDF: <url> | <titulo>]
    const pdfRegex = /\[PDF:\s*(.+?)\s*\|\s*(.+?)\s*\]/gi;
    const pdfMatches = [...content.matchAll(pdfRegex)];
    content = content.replace(pdfRegex, "");

    // 2. Detección de Quiz: [QUIZ: <pregunta> | <opcion1> | <opcion2> ... ]
    const quizRegex = /\[QUIZ:\s*(.+?)\s*\|\s*(.+?)\s*\]/gi;
    const quizMatches = [...content.matchAll(quizRegex)];
    content = content.replace(quizRegex, "");

    // 3. Detección de Curso Completado: [CURSO_COMPLETADO]
    const isCourseCompleted = content.includes("[CURSO_COMPLETADO]");
    content = content.replace(/\[CURSO_COMPLETADO\]/gi, "");

    const cleanLines = content.trim().split("\n");

    return (
      <div className="space-y-3">
        {/* Texto formateado */}
        {cleanLines.length > 0 && cleanLines[0] !== "" && (
          <div className="text-sm sm:text-base leading-relaxed text-slate-800 space-y-2">
            {cleanLines.map((line, lIdx) => (
              <p key={lIdx} className="min-h-[1.25rem]">
                {renderWhatsAppText(line)}
              </p>
            ))}
          </div>
        )}

        {/* Tarjetas Interactivas de PDF */}
        {pdfMatches.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200/80">
            {pdfMatches.map((match, pIdx) => {
              const url = match[1].trim();
              const title = match[2].trim();
              const activeUrl =
                !url || url.includes("cultiva.demo") || url.includes("example.com")
                  ? "/guias/guia-buenas-practicas-agroindustria.pdf"
                  : url;

              return (
                <div
                  key={pIdx}
                  className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
                      <PdfIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-950 truncate">{title}</p>
                      <p className="text-[11px] font-medium text-emerald-700">Documento PDF Oficial</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setPdfModal({
                          isOpen: true,
                          url: activeUrl,
                          title,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <EyeIcon className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ver PDF</span>
                    </button>

                    <a
                      href={activeUrl}
                      download
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tarjeta Interactiva de Quiz */}
        {quizMatches.length > 0 && (
          <div className="space-y-3 pt-2">
            {quizMatches.map((match, qIdx) => {
              const question = match[1].trim();
              const options = match[2]
                .split("|")
                .map((o) => o.trim())
                .filter(Boolean);

              return (
                <div
                  key={qIdx}
                  className="rounded-2xl bg-amber-50/60 border-2 border-amber-200 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs mt-0.5">
                      ?
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-snug">{question}</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSendMessage(opt)}
                        disabled={isSending}
                        className="w-full text-left rounded-xl border border-amber-300/80 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-amber-100/70 hover:border-amber-400 hover:text-amber-950 transition-all flex items-center justify-between gap-2 cursor-pointer shadow-2xs group"
                      >
                        <span>{opt}</span>
                        <ArrowRightIcon className="w-4 h-4 text-amber-600 transition-transform group-hover:translate-x-1 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Banner de Curso Completado */}
        {isCourseCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 text-center shadow-md space-y-3"
          >
            <div className="inline-flex p-3 bg-white/20 rounded-full">
              <CheckCircleIcon className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-lg font-bold">¡Felicitaciones! Curso Completado</h4>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Has respondido con éxito las preguntas y completado todas las lecciones de{" "}
              <strong>{courseTitle}</strong>.
            </p>
          </motion.div>
        )}
      </div>
    );
  };

  const quickPrompts = [
    "Comenzar curso",
    "Descargar Guía en PDF",
    "Hacer quiz de prueba",
    "Ver temario",
    "Tengo una duda",
  ];

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-lg space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 animate-bounce">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Conectando con el Agente de WhatsApp...</h3>
        <p className="text-xs text-slate-500">Cargando tutor interactivo y material didáctico del curso</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-300 bg-[#efeae2] shadow-2xl flex flex-col h-[700px] max-h-[85vh]">
      {/* WhatsApp Header */}
      <div className="flex items-center justify-between border-b border-emerald-950/20 bg-emerald-900 px-4 sm:px-6 py-3.5 text-white shadow-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-emerald-400/50 overflow-hidden p-1 shadow-xs">
            <Image
              src="/logos/campuslands.png"
              alt="Campuslands"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-emerald-900" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                Tutor Agro IA — {courseTitle}
              </h3>
            </div>
            <p className="text-xs text-emerald-200 font-medium flex items-center gap-1.5">
              {isAiTyping ? (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
                  <span className="italic font-bold text-emerald-300">Escribiendo respuesta...</span>
                </>
              ) : (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>En línea • Asistente Oficial</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetChat}
            title="Reiniciar Curso"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer border border-emerald-700"
          >
            <RotateCcwIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        style={{
          backgroundImage: `radial-gradient(#d1d5db 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="text-center my-2">
          <span className="inline-block rounded-lg bg-white/80 backdrop-blur-xs border border-slate-200/80 px-3 py-1 text-[11px] font-bold text-slate-500 shadow-2xs uppercase tracking-wider">
            Sesión de Aprendizaje Interactivo • Plataforma Agro
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isStudent = msg.author === "STUDENT";
            const isAi = msg.author === "AGENTE_IA";
            const isAdmin = msg.author === "ADMIN";

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col ${isStudent ? "items-end" : "items-start"}`}
              >
                {/* Bubble */}
                <div
                  className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs ${
                    isStudent
                      ? "rounded-tr-xs bg-[#d9fdd3] text-slate-900 border border-emerald-200/60"
                      : "rounded-tl-xs bg-white text-slate-900 border border-slate-200"
                  }`}
                >
                  {/* Sender Tag */}
                  {!isStudent && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1.5 pb-1 border-b border-slate-100">
                      {isAi ? (
                        <>
                          <SparklesIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tutor Agro IA</span>
                        </>
                      ) : isAdmin ? (
                        <>
                          <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                          <span>Asesor Docente KHC</span>
                        </>
                      ) : (
                        <span>Sistema</span>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  {renderMessageContent(msg)}

                  {/* Time and Status Footer */}
                  <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-slate-400 font-medium">
                    <span>{formatMessageTime(msg.createdAt)}</span>
                    {isStudent && (
                      <span className="text-emerald-700" title="Entregado y leido">
                        <DoubleCheckIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* AI Typing Indicator */}
        {isAiTyping && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start"
          >
            <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200 px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800">Tutor Agro IA está respondiendo</span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="bg-[#f0f2f5] border-t border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Opciones Rápidas:</span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            disabled={isSending}
            className="rounded-full bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 px-3 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors shrink-0 shadow-2xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* WhatsApp Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2.5 bg-[#f0f2f5] px-4 py-3 border-t border-slate-200/80 shrink-0"
      >
        <button
          type="button"
          onClick={() => handleSendMessage("Descargar Guía en PDF")}
          title="Ver material didáctico en PDF"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un mensaje o responde la pregunta..."
          disabled={isSending}
          className="flex-1 rounded-full bg-white border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all shadow-md cursor-pointer ${
            inputText.trim() && !isSending
              ? "bg-emerald-700 text-white hover:bg-emerald-800 hover:scale-105 active:scale-95"
              : "bg-slate-300 text-slate-400 cursor-not-allowed"
          }`}
          title="Enviar mensaje"
        >
          <SendIcon className="w-5 h-5 translate-x-0.5" />
        </button>
      </form>

      {/* PDF Modal Viewer */}
      <PdfViewerModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal({ isOpen: false, url: "", title: "" })}
        pdfUrl={pdfModal.url}
        title={pdfModal.title}
      />

      {/* Video Modal Viewer */}
      <VideoViewerModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, url: "", title: "" })}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
}
