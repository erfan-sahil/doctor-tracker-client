import type { ListDoctorsParams } from "../model/types";

export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (params: ListDoctorsParams) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  patients: (id: string) => [...doctorKeys.all, "patients", id] as const,
  filterOptions: () => [...doctorKeys.all, "filter-options"] as const,
};
