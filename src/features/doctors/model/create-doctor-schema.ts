import { z } from "zod";

import { doctorPhoneSchema } from "@/features/doctors/model/doctor-phone-schema";

export const createDoctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  phone: doctorPhoneSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  specialization: z.string().trim().max(100, "Specialization is too long").optional(),
  hospital: z.string().trim().max(100, "Hospital is too long").optional(),
});

export type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>;