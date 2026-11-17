import type { CreatePatientFormValues } from "@/features/patients/model/create-patient-schema";
import type { CreatePatientInput } from "@/features/patients/model/types";

export function toCreatePatientInput(values: CreatePatientFormValues): CreatePatientInput {
  const condition = values.condition?.trim();
  const date = values.date?.trim();
  const doctorId = values.doctorId?.trim();

  return {
    name: values.name.trim(),
    ...(condition ? { condition } : {}),
    ...(date ? { date } : {}),
    ...(doctorId ? { doctorId } : {}),
  };
}