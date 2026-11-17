import { format, isValid, parseISO } from "date-fns";

/** API and filter value format (YYYY-MM-DD). */
export function formatDateOnly(value: Date): string {
  return format(value, "yyyy-MM-dd");
}

export function parseDateOnly(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

export function formatDateOnlyLabel(value: string): string | undefined {
  const parsed = parseDateOnly(value);
  if (!parsed) {
    return undefined;
  }

  return format(parsed, "MMM d, yyyy");
}