"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

import { doctorKeys } from "@/features/doctors/queries/keys";
import { overviewKeys } from "@/features/overview/queries/keys";
import { createPatient } from "@/features/patients/api/patients-api";
import type { CreatePatientInput } from "@/features/patients/model/types";
import { patientKeys } from "@/features/patients/queries/keys";

type UseCreatePatientMutationOptions = {
  invalidateDoctorPatientsId?: string;
};

export function useCreatePatientMutation(options?: UseCreatePatientMutationOptions) {
  const queryClient = useQueryClient();
  const invalidateDoctorPatientsIdRef = useRef(options?.invalidateDoctorPatientsId);
  invalidateDoctorPatientsIdRef.current = options?.invalidateDoctorPatientsId;

  return useMutation({
    mutationFn: (input: CreatePatientInput) => createPatient(input),
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