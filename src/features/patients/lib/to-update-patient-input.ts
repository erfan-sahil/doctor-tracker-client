import type { UpdatePatientFormValues } from "@/features/patients/model/update-patient-schema";
import type { UpdatePatientInput } from "@/features/patients/model/types";

export function toUpdatePatientInput(
  values: UpdatePatientFormValues,
  options: { includeDoctorId: boolean },
): UpdatePatientInput {
  const condition = values.condition.trim();
  const date = values.date.trim();
  const doctorId = values.doctorId.trim();

  const input: UpdatePatientInput = {
    name: values.name.trim(),
    condition: condition.length > 0 ? condition : null,
    date: date.length > 0 ? date : null,
  };

  if (options.includeDoctorId && doctorId.length > 0) {
    input.doctorId = doctorId;
  }

  return input;
}