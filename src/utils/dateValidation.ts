import { z } from "zod";

const isISODate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

const parseISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? dt : null;
};

const isFuture = (dt: Date) => dt.getTime() > Date.now();

const ageInYears = (dt: Date) => {
  const now = new Date();
  let age = now.getFullYear() - dt.getFullYear();
  const m = now.getMonth() - dt.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age--;
  return age;
};

export const birthDateSchema = z.string()
  .refine((s) => isISODate(s), "Data inválida")
  .refine((s) => { const d = parseISO(s); return !!d; }, "Data inválida")
  .refine((s) => { const d = parseISO(s)!; return !isFuture(d); }, "Data no futuro não é permitida")
  .refine((s) => { const d = parseISO(s)!; return ageInYears(d) <= 12; }, "A criança deve ter até 12 anos");

export const validateBirthDate = (dateString: string) => {
  try {
    birthDateSchema.parse(dateString);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message || "Data inválida" };
    }
    return { isValid: false, error: "Data inválida" };
  }
};