import { apiClient, apiData, definedParams } from "@/shared/lib/api/client";
import type { ApiSuccess } from "@/shared/types/api";

import type {
  CreatePatientInput,
  ListPatientsParams,
  PaginatedPatients,
  Patient,
  PatientFilterOptions,
  UpdatePatientInput,
} from "../model/types";

export function listPatientFilterOptions(): Promise<PatientFilterOptions> {
  return apiData(apiClient.get<ApiSuccess<PatientFilterOptions>>("/patients/filters"));
}

export function listPatients(
  params: ListPatientsParams = {},
): Promise<PaginatedPatients> {
  return apiData(
    apiClient.get<ApiSuccess<PaginatedPatients>>("/patients", {
      params: definedParams(params),
    }),
  );
}

export function getPatient(id: string): Promise<Patient> {
  return apiData(apiClient.get<ApiSuccess<Patient>>(`/patients/${id}`));
}

export function createPatient(input: CreatePatientInput): Promise<Patient> {
  return apiData(apiClient.post<ApiSuccess<Patient>>("/patients", input));
}

export function updatePatient(id: string, input: UpdatePatientInput): Promise<Patient> {
  return apiData(apiClient.patch<ApiSuccess<Patient>>(`/patients/${id}`, input));
}

export function deletePatient(id: string): Promise<null> {
  return apiData(apiClient.delete<ApiSuccess<null>>(`/patients/${id}`));
}
