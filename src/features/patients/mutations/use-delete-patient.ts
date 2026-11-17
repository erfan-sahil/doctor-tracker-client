"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

import { doctorKeys } from "@/features/doctors/queries/keys";
import { overviewKeys } from "@/features/overview/queries/keys";
import { deletePatient } from "@/features/patients/api/patients-api";
import { patientKeys } from "@/features/patients/queries/keys";

type UseDeletePatientMutationOptions = {
  invalidateDoctorPatientsId?: string;
};

export function useDeletePatientMutation(options?: UseDeletePatientMutationOptions) {
  const queryClient = useQueryClient();
  const invalidateDoctorPatientsIdRef = useRef(options?.invalidateDoctorPatientsId);
  invalidateDoctorPatientsIdRef.current = options?.invalidateDoctorPatientsId;

  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: async () => {
      const tasks = [
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: patientKeys.filterOptions() }),
        queryClient.invalidateQueries({ queryKey: overviewKeys.all }),
      ];

      const doctorId = invalidateDoctorPatientsIdRef.current;
      if (doctorId) {
        tasks.push(
          queryClient.invalidateQueries({
            queryKey: doctorKeys.patients(doctorId),
          }),
        );
      }

      await Promise.all(tasks);
    },
  });
}