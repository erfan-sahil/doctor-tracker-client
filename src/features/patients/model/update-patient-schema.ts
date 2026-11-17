import { z } from "zod";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

const objectIdPattern = /^[a-f\d]{24}$/i;

export const updatePatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  condition: z.string().trim().max(100, "Condition is too long"),
  date: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || dateOnlyPattern.test(value), {
      message: "Date must be YYYY-MM-DD",
    }),
  doctorId: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || objectIdPattern.test(value), {
      message: "Select a valid doctor",
    }),
});

export type UpdatePatientFormValues = z.infer<typeof updatePatientSchema>;