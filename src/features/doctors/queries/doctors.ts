import { queryOptions } from "@tanstack/react-query";

import {
  getDoctor,
  listDoctorFilterOptions,
  listDoctorPatients,
  listDoctors,
} from "../api/doctors-api";
import type { ListDoctorsParams } from "../model/types";
import { doctorKeys } from "./keys";

export function doctorFilterOptionsQuery() {
  return queryOptions({
    queryKey: doctorKeys.filterOptions(),
    queryFn: () => listDoctorFilterOptions(),
  });
}

export function doctorsQuery(params: ListDoctorsParams = {}) {
  return queryOptions({
    queryKey: doctorKeys.list(params),
    queryFn: () => listDoctors(params),
  });
}

export function doctorQuery(id: string) {
  return queryOptions({
    queryKey: doctorKeys.detail(id),
    queryFn: () => getDoctor(id),
  });
}

export function doctorPatientsQuery(id: string) {
  return queryOptions({
    queryKey: doctorKeys.patients(id),
    queryFn: () => listDoctorPatients(id),
  });
}
