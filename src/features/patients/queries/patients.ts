import { queryOptions } from "@tanstack/react-query";

import { getPatient, listPatientFilterOptions, listPatients } from "../api/patients-api";
import type { ListPatientsParams } from "../model/types";
import { patientKeys } from "./keys";

export function patientFilterOptionsQuery() {
  return queryOptions({
    queryKey: patientKeys.filterOptions(),
    queryFn: () => listPatientFilterOptions(),
  });
}

export function patientsQuery(params: ListPatientsParams = {}) {
  return queryOptions({
    queryKey: patientKeys.list(params),
    queryFn: () => listPatients(params),
  });
}

export function patientQuery(id: string) {
  return queryOptions({
    queryKey: patientKeys.detail(id),
    queryFn: () => getPatient(id),
  });
}
