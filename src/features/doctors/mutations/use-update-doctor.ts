"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { overviewKeys } from "@/features/overview/queries/keys";
import { updateDoctor } from "@/features/doctors/api/doctors-api";
import type { UpdateDoctorInput } from "@/features/doctors/model/types";
import { doctorKeys } from "@/features/doctors/queries/keys";

type UpdateDoctorVariables = {
  id: string;
  input: UpdateDoctorInput;
};

export function useUpdateDoctorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateDoctorVariables) => updateDoctor(id, input),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorKeys.detail(variables.id) }),
        queryClient.invalidateQueries({ queryKey: doctorKeys.filterOptions() }),
        queryClient.invalidateQueries({ queryKey: overviewKeys.all }),
      ]);
    },
  });
}