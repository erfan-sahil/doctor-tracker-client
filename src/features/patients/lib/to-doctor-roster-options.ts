import type { DoctorWithUser } from "@/features/doctors/model/types";
import type { PatientFilterDoctorOption } from "@/features/patients/model/types";

export function toDoctorRosterOptions(
  doctors: DoctorWithUser[],
): PatientFilterDoctorOption[] {
  return doctors.map(({ doctor, user }) => ({
    id: doctor.id,
    name: doctor.name,
    email: user.email,
  }));
}