"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDoctor } from "@/features/doctors/api/doctors-api";
import type { CreateDoctorInput } from "@/features/doctors/model/types";
import { doctorKeys } from "@/features/doctors/queries/keys";

export function useCreateDoctorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDoctorInput) => createDoctor(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorKeys.filterOptions() }),
      ]);
    },
  });
}