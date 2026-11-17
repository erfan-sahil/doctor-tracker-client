"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { overviewKeys } from "@/features/overview/queries/keys";
import { updatePatient } from "@/features/patients/api/patients-api";
import type { UpdatePatientInput } from "@/features/patients/model/types";
import { patientKeys } from "@/features/patients/queries/keys";

type UpdatePatientVariables = {
  id: string;
  input: UpdatePatientInput;
};

export function useUpdatePatientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdatePatientVariables) => updatePatient(id, input),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) }),
        queryClient.invalidateQueries({ queryKey: patientKeys.filterOptions() }),
        queryClient.invalidateQueries({ queryKey: overviewKeys.all }),
      ]);
    },
  });
}