import { AppError } from "./app-error";

export function normalizeKenyanPhoneToE164(raw: string): string {
  const cleaned = raw.replace(/[^\d+]/g, "");

  let digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 10) {
    digits = `254${digits.slice(1)}`;
  }

  if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) {
    digits = `254${digits}`;
  }

  if (!digits.startsWith("254") || digits.length !== 12) {
    throw new AppError(400, "Phone number must be a valid Kenyan mobile number.");
  }

  return `+${digits}`;
}

export function normalizeWaIdToE164(waId: string): string {
  const digits = waId.replace(/\D/g, "");

  if (!digits || digits.length < 10) {
    throw new AppError(400, "Invalid WhatsApp sender number.");
  }

  return `+${digits}`;
}

export function e164ToWaId(e164: string): string {
  return e164.replace(/\D/g, "");
}