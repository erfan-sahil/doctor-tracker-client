import type { UpdateDoctorFormValues } from "@/features/doctors/model/update-doctor-schema";
import type { UpdateDoctorInput } from "@/features/doctors/model/types";

export function toUpdateDoctorInput(values: UpdateDoctorFormValues): UpdateDoctorInput {
  const specialization = values.specialization.trim();
  const hospital = values.hospital.trim();

  return {
    name: values.name.trim(),
    specialization: specialization.length > 0 ? specialization : null,
    hospital: hospital.length > 0 ? hospital : null,
  };
}