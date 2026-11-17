import { z } from "zod";

/** Matches backend `doctor.schema.ts` phone rules. */
export const doctorPhoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .max(30, "Phone is too long")
  .regex(/^[\d\s+().-]+$/, "Enter a valid phone number");