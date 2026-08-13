"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChatIcon,
  UserIcon,
  PhoneIcon,
  BookIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PaperclipIcon,
} from "@/app/components/icons";

export type ConversationItem = {
  id: number;
  phone: string;
  name: string | null;
  studentId: number | null;
  mode: "AGENTE_IA" | "MANUAL";
  etapaActual: string;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  student?: {
    id: number;
    name: string;
    phone: string;
    createdAt: string;
  } | null;
  lastMessage?: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
  } | null;
};

export type MessageItem = {
  id: number;
  conversationId: number;
  author: "STUDENT" | "AGENTE_IA" | "SISTEMA" | "ADMIN";
  type: string;
  content: string;
  fileName: string | null;
  fileUrl: string | null;
  fileMimeType: string | null;
  createdAt: string;
};

export type CourseItem = {
  id: number;
  title: string;
  category: string | null;
  published: boolean;
};

function getInitials(name: string): string {
  if (!name) return "WA";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const WHATSAPP_FORMAT_REGEX = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~)/g;

function renderWhatsAppText(content: string): React.ReactNode[] {
  return content.split(WHATSAPP_FORMAT_REGEX).map((part, idx) => {
    if (/^\*\*[^*\n]+\*\*$/.test(part)) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (/^\*[^*\n]+\*$/.test(part)) {
      return <strong key={idx}>{part.slice(1, -1)}</strong>;
    }
    if (/^_[^_\n]+_$/.test(part)) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    if (/^~[^~\n]+~$/.test(part)) {
      return <s key={idx}>{part.slice(1, -1)}</s>;
    }
    return part;
  });
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export function ChatsView() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [selectedConv, setSelectedConv] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [studentInfo, setStudentInfo] = useState<any | null>(null);
  const [coursesList, setCoursesList] = useState<CourseItem[]>([]);
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConv, setLoadingConv] = useState(true);
  const [showQuickAnswers, setShowQuickAnswers] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSelected = useRef(false);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/admin/chats");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
        if (!selectedConvId && !hasAutoSelected.current && data.conversations?.length > 0) {
          hasAutoSelected.current = true;
          setSelectedConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("Error cargando conversaciones", err);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessages = async (convId: number) => {
    try {
      const res = await fetch(`/api/admin/chats/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedConv(data.conversation);
        setMessages(data.messages ?? []);
        setStudentInfo(data.student ?? null);
        setCoursesList(data.courses ?? []);
      }
    } catch (err) {
      console.error("Error cargando mensajes", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedConvId) {
        fetchMessages(selectedConvId);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedConvId]);

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
    }
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedConvId || sending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await fetch(`/api/admin/chats/${selectedConvId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });

      if (res.ok) {
        await fetchMessages(selectedConvId);
        await fetchConversations();
      } else {
        const errData = await res.json();
        alert(`Error al enviar: ${errData.error || "Fallo en servidor"}`);
      }
    } catch (err) {
      console.error("Error enviando mensaje", err);
    } finally {
      setSending(false);
    }
  };

  const handleToggleMode = async (newMode: "AGENTE_IA" | "MANUAL") => {
    if (!selectedConvId) return;
    try {
      const res = await fetch(`/api/admin/chats/${selectedConvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      if (res.ok) {
        await fetchMessages(selectedConvId);
        await fetchConversations();
      }
    } catch (err) {
      console.error("Error cambiando modo", err);
    }
  };

  const quickAnswersList = [
    "¡Hola! Bienvenido a la Plataforma Educativa KHC. ¿En qué tema te gustaría profundizar hoy?",
    "Nuestros cursos cuentan con certificación digital oficial. ¿Deseas información sobre inscripciones?",
    "Te hemos habilitado el acceso al módulo en la plataforma KHC. Puedes ingresar cuando desees.",
  ];

  const filteredConversations = conversations.filter((c) => {
    const term = search.toLowerCase();
    const nameMatch = (c.name || c.student?.name || "").toLowerCase().includes(term);
    const phoneMatch = c.phone.toLowerCase().includes(term);
    return nameMatch || phoneMatch;
  });

  const studentDisplayName = selectedConv?.student?.name || selectedConv?.name || "Estudiante KHC";
  const studentInitials = getInitials(studentDisplayName);

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="flex-1 flex min-h-0 divide-x divide-slate-200">
        
        {/* COLUMNA 1: LISTA DE CHATS (en móvil se oculta al seleccionar un chat) */}
        <div
          className={`${
            selectedConvId ? "hidden md:flex" : "flex"
          } w-full md:w-60 lg:w-80 flex-col bg-slate-50/50 shrink-0`}
        >
          {/* Buscador */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl bg-slate-100 pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-slate-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <ChatIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Lista de Conversaciones */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConv ? (
              <div className="p-8 text-center text-xs text-slate-400">Cargando chats...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const displayName = conv.student?.name || conv.name || conv.phone;
                const initials = getInitials(displayName);
                const lastText = conv.lastMessage?.content || "Sin mensajes";

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors relative cursor-pointer ${
                      isSelected ? "bg-white shadow-xs" : "hover:bg-slate-100/70"
                    }`}
                  >
                    {/* Highlight lateral en selección */}
                    {isSelected && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-full" />
                    )}

                    {/* Avatar con Iniciales */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-sm shrink-0 border border-emerald-200">
                      {initials}
                    </div>

                    {/* Detalle */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {displayName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatDateLabel(conv.lastMessageAt)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate mb-2 font-normal">
                        {lastText}
                      </p>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            conv.mode === "AGENTE_IA"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {conv.mode === "AGENTE_IA" ? (
                            <>
                              <SparklesIcon className="w-3 h-3" /> Agente IA
                            </>
                          ) : (
                            <>
                              <UserIcon className="w-3 h-3" /> Admin
                            </>
                          )}
                        </span>

                        {conv.unreadCount > 0 && (
                          <span className="ml-auto rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No se encontraron conversaciones
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA 2: VENTANA PRINCIPAL DE CHAT */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            
            {/* Header del Chat */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedConvId(null);
                    setSelectedConv(null);
                  }}
                  title="Volver a la lista de chats"
                  aria-label="Volver a la lista de chats"
                  className="flex md:hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold text-sm shrink-0 shadow-xs">
                  {studentInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {studentDisplayName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedConv.phone}
                  </p>
                </div>
              </div>

              {/* Toggle de Modo Atención (Agente IA vs Admin) */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                <button
                  onClick={() => handleToggleMode("AGENTE_IA")}
                  title="Agente IA"
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedConv.mode === "AGENTE_IA"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <SparklesIcon className="w-3.5 h-3.5" /> <span className="inline md:hidden lg:inline">Agente IA</span>
                </button>
                <button
                  onClick={() => handleToggleMode("MANUAL")}
                  title="Admin (Manual)"
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedConv.mode === "MANUAL"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" /> <span className="inline md:hidden lg:inline">Admin (Manual)</span>
                </button>
              </div>
            </div>

            {/* Hilo de Mensajes */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
              {messages.map((msg) => {
                const isStudent = msg.author === "STUDENT";
                const isAi = msg.author === "AGENTE_IA";
                const isAdmin = msg.author === "ADMIN";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isStudent ? "items-start" : "items-end"
                    }`}
                  >
                    {/* Etiqueta de Autor */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">
                      {isStudent
                        ? "[Estudiante]"
                        : isAi
                        ? "[Bot IA]"
                        : isAdmin
                        ? "[Admin]"
                        : "[Sistema]"}
                    </span>

                    {/* Globo del Mensaje */}
                    <div
                      className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                        isStudent
                          ? "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                          : isAi || isAdmin
                          ? "bg-[#d9fdd3] text-slate-900 border border-[#bce8b0] rounded-tr-xs"
                          : "bg-slate-200 text-slate-700 italic"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{renderWhatsAppText(msg.content)}</p>

                      {/* Adjunto si aplica */}
                      {msg.fileUrl && (
                        <div className="mt-2 pt-2 border-t border-slate-900/10 text-[11px] flex items-center gap-1.5">
                          <PaperclipIcon className="w-3 h-3" /> {msg.fileName || "Archivo adjunto"}
                        </div>
                      )}

                      <div className="text-[9px] mt-1 text-right font-mono text-slate-500/80">
                        {formatDateLabel(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {selectedConv.mode === "AGENTE_IA" ? (
              /* Aviso: Agente IA a cargo, no se permite escritura manual */
              <div className="p-4 border-t border-slate-200 bg-emerald-50/60 flex items-center gap-3 shrink-0">
                <SparklesIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-900 font-medium">
                  El Agente IA está respondiendo automáticamente. Activa el modo{" "}
                  <span className="font-bold">Admin (Manual)</span> para escribir tú mismo.
                </p>
              </div>
            ) : (
              <>
                {/* Respuestas Rápidas sugeridas */}
                {showQuickAnswers && (
                  <div className="p-3 bg-emerald-50 border-t border-emerald-200 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase text-emerald-800 px-1 mb-1">
                      Respuestas Rápidas Sugeridas:
                    </p>
                    {quickAnswersList.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputText(qa);
                          setShowQuickAnswers(false);
                        }}
                        className="block w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-100 text-xs text-emerald-950 font-medium transition-colors border border-emerald-200 cursor-pointer"
                      >
                        {qa}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input de Respuesta Admin */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-slate-200 bg-white flex items-center gap-3 shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setShowQuickAnswers(!showQuickAnswers)}
                    title="Escribe / para respuestas rápidas"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer border border-slate-200"
                  >
                    / Respuestas
                  </button>

                  <input
                    type="text"
                    placeholder="Envía un mensaje por WhatsApp o escribe / para respuestas rápidas..."
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (e.target.value.startsWith("/")) {
                        setShowQuickAnswers(true);
                      }
                    }}
                    className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-slate-200 font-medium"
                  />

                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="btn-farmer-primary text-xs px-5 py-3 shrink-0 disabled:opacity-50"
                  >
                    <span>{sending ? "Enviando..." : "Enviar"}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center p-8 text-center text-slate-400 bg-slate-50/20">
            <div>
              <ChatIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">
                Selecciona una conversación de la izquierda
              </p>
            </div>
          </div>
        )}

        {/* COLUMNA 3: DATOS DEL ESTUDIANTE */}
        {selectedConv && (
          <div className="w-64 lg:w-72 p-6 flex flex-col bg-white shrink-0 hidden xl:flex overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Datos del Estudiante
                </h3>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs shadow-xs">
                  100%
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <UserIcon className="w-4 h-4 text-emerald-600" />
                    <span>{studentDisplayName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <PhoneIcon className="w-4 h-4 text-slate-400" />
                    <span>{selectedConv.phone}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Estudiante Registrado KHC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cursos Disponibles/Asignados */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Cursos de la Plataforma ({coursesList.length})
              </h4>
              <div className="space-y-2">
                {coursesList.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{course.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      Activo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
