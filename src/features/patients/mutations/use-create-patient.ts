"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { overviewKeys } from "@/features/overview/queries/keys";
import { createPatient } from "@/features/patients/api/patients-api";
import type { CreatePatientInput } from "@/features/patients/model/types";
import { patientKeys } from "@/features/patients/queries/keys";

export function useCreatePatientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePatientInput) => createPatient(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: patientKeys.filterOptions() }),
        queryClient.invalidateQueries({ queryKey: overviewKeys.all }),
      ]);
    },
  });
}