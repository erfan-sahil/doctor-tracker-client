import { z } from "zod";

export const updateDoctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  specialization: z.string().trim().max(100, "Specialization is too long"),
  hospital: z.string().trim().max(100, "Hospital is too long"),
});

export type UpdateDoctorFormValues = z.infer<typeof updateDoctorSchema>;