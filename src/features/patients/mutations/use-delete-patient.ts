"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { overviewKeys } from "@/features/overview/queries/keys";
import { deletePatient } from "@/features/patients/api/patients-api";
import { patientKeys } from "@/features/patients/queries/keys";

export function useDeletePatientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: patientKeys.filterOptions() }),
        queryClient.invalidateQueries({ queryKey: overviewKeys.all }),
      ]);
    },
  });
}