type LogCategory = "WHATSAPP" | "IA" | "AUTH" | "DB" | "SYSTEM";

export const logger = {
  info: (category: LogCategory, message: string, data?: unknown) => {
    console.log(`[INFO][${category}] ${message}`, data !== undefined ? data : "");
  },
  warn: (category: LogCategory, message: string, data?: unknown) => {
    console.warn(`[WARN][${category}] ${message}`, data !== undefined ? data : "");
  },
  error: (category: LogCategory, message: string, data?: unknown) => {
    console.error(`[ERROR][${category}] ${message}`, data !== undefined ? data : "");
  },
  debug: (category: LogCategory, message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG][${category}] ${message}`, data !== undefined ? data : "");
    }
  },
};
