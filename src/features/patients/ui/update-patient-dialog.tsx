"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPen } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useSessionStore } from "@/features/auth/model/session-store";
import { DoctorFormDialogHeader } from "@/features/doctors/ui/doctor-form-dialog-header";
import { toUpdatePatientInput } from "@/features/patients/lib/to-update-patient-input";
import { useUpdatePatientMutation } from "@/features/patients/mutations/use-update-patient";
import type { Patient, PatientFilterDoctorOption } from "@/features/patients/model/types";
import {
  updatePatientSchema,
  type UpdatePatientFormValues,
} from "@/features/patients/model/update-patient-schema";
import {
  patientDialogBodyClassName,
  patientDialogFooterClassName,
  patientDialogHeaderClassName,
} from "@/features/patients/ui/patient-dialog-styles";
import { PatientDoctorCombobox } from "@/features/patients/ui/patient-doctor-combobox";
import { PatientVisitDateFilter } from "@/features/patients/ui/patient-visit-date-filter";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

type UpdatePatientDialogProps = {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctors: PatientFilterDoctorOption[];
};

function valuesFromPatient(patient: Patient): UpdatePatientFormValues {
  return {
    name: patient.name,
    condition: patient.condition ?? "",
    date: patient.date ?? "",
    doctorId: patient.doctorId,
  };
}

export function UpdatePatientDialog({
  patient,
  open,
  onOpenChange,
  doctors,
}: UpdatePatientDialogProps) {
  const role = useSessionStore((state) => state.user?.role);
  const isAdmin = role === "admin";

  const form = useForm<UpdatePatientFormValues>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: { name: "", condition: "", date: "", doctorId: "" },
    mode: "onSubmit",
  });

  const updateMutation = useUpdatePatientMutation();
  const pending = updateMutation.isPending;
  const rootError = form.formState.errors.root?.message;

  useEffect(() => {
    if (open && patient) {
      form.reset(valuesFromPatient(patient));
      form.clearErrors();
    }
  }, [open, patient, form]);

  const handleOpenChange = (next: boolean) => {
    if (pending) {
      return;
    }
    onOpenChange(next);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!patient) {
      return;
    }

    form.clearErrors("root");

    try {
      await updateMutation.mutateAsync({
        id: patient.id,
        input: toUpdatePatientInput(values, { includeDoctorId: isAdmin }),
      });
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Unable to update patient. Try again.";
      form.setError("root", { message });
    }
  });

  if (!patient) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DoctorFormDialogHeader
          icon={UserPen}
          eyebrow="Update patient"
          title={patient.name}
          description="Change patient details or reassign them to another doctor."
          headerClassName={patientDialogHeaderClassName}
        />

        <Form {...form}>
          <form onSubmit={onSubmit} noValidate>
            <div className={patientDialogBodyClassName}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        placeholder="e.g. John Doe"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isAdmin ? (
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <FormControl>
                        <PatientDoctorCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          doctors={doctors}
                          disabled={pending}
                          placeholder="Select doctor"
                          variant="rich"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Hypertension" disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit date</FormLabel>
                    <FormControl>
                      <PatientVisitDateFilter
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={pending}
                        placeholder="Select visit date"
                        clearLabel="No visit date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {rootError ? (
                <p
                  className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
                  role="alert"
                >
                  {rootError}
                </p>
              ) : null}
            </div>

            <DialogFooter className={patientDialogFooterClassName}>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}