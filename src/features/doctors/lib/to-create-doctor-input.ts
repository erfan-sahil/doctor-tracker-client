import type { CreateDoctorFormValues } from "@/features/doctors/model/create-doctor-schema";
import type { CreateDoctorInput } from "@/features/doctors/model/types";

export function toCreateDoctorInput(values: CreateDoctorFormValues): CreateDoctorInput {
  const specialization = values.specialization?.trim();
  const hospital = values.hospital?.trim();

  return {
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    ...(specialization ? { specialization } : {}),
    ...(hospital ? { hospital } : {}),
  };
}