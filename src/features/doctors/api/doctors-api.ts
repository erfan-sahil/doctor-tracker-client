import type { Patient } from "@/features/patients/model/types";
import { apiClient, apiData, definedParams } from "@/shared/lib/api/client";
import type { ApiSuccess } from "@/shared/types/api";

import type {
  CreateDoctorInput,
  DoctorAccount,
  DoctorWithUser,
  ListDoctorsParams,
  PaginatedDoctors,
  UpdateDoctorInput,
} from "../model/types";

export function listDoctors(params: ListDoctorsParams = {}): Promise<PaginatedDoctors> {
  return apiData(
    apiClient.get<ApiSuccess<PaginatedDoctors>>("/doctors", {
      params: definedParams(params),
    }),
  );
}

export function getDoctor(id: string): Promise<DoctorWithUser> {
  return apiData(apiClient.get<ApiSuccess<DoctorWithUser>>(`/doctors/${id}`));
}

export function createDoctor(input: CreateDoctorInput): Promise<DoctorAccount> {
  return apiData(apiClient.post<ApiSuccess<DoctorAccount>>("/doctors", input));
}

export function updateDoctor(
  id: string,
  input: UpdateDoctorInput,
): Promise<DoctorWithUser> {
  return apiData(apiClient.patch<ApiSuccess<DoctorWithUser>>(`/doctors/${id}`, input));
}

export function deleteDoctor(id: string): Promise<null> {
  return apiData(apiClient.delete<ApiSuccess<null>>(`/doctors/${id}`));
}

export function listDoctorPatients(id: string): Promise<Patient[]> {
  return apiData(apiClient.get<ApiSuccess<Patient[]>>(`/doctors/${id}/patients`));
}
