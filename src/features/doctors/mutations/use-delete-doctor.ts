"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { overviewKeys } from "@/features/overview/queries/keys";
import { deleteDoctor } from "@/features/doctors/api/doctors-api";
import { doctorKeys } from "@/features/doctors/queries/keys";

export function useDeleteDoctorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorKeys.filterOptions() }),
        queryClient.invalidateQueries({ queryKey: overviewKeys.all }),
      ]);
    },
  });
}