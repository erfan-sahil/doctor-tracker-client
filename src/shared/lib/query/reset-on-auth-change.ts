import { doctorKeys } from "@/features/doctors/queries/keys";
import { overviewKeys } from "@/features/overview/queries/keys";
import { patientKeys } from "@/features/patients/queries/keys";

import { getQueryClient } from "./client";

/** Drops role-scoped lists and metrics so a new login never reads the previous user's cache. */
export function resetAppQueriesForAuthChange(): void {
  const queryClient = getQueryClient();

  queryClient.removeQueries({ queryKey: patientKeys.all });
  queryClient.removeQueries({ queryKey: doctorKeys.all });
  queryClient.removeQueries({ queryKey: overviewKeys.all });
  queryClient.removeQueries({ queryKey: ["auth"] });
}