export function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}

export const phoneRegex = /^\+?\d{7,15}$/;
