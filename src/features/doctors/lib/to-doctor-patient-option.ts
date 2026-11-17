import type { DoctorWithUser } from "@/features/doctors/model/types";
import type { PatientFilterDoctorOption } from "@/features/patients/model/types";

export function toDoctorPatientOption(doctor: DoctorWithUser): PatientFilterDoctorOption {
  return {
    id: doctor.doctor.id,
    name: doctor.doctor.name,
    email: doctor.user.email,
  };
}