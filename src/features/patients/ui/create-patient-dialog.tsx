"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useSessionStore } from "@/features/auth/model/session-store";
import { toCreatePatientInput } from "@/features/patients/lib/to-create-patient-input";
import { useCreatePatientMutation } from "@/features/patients/mutations/use-create-patient";
import {
  createPatientSchema,
  type CreatePatientFormValues,
} from "@/features/patients/model/create-patient-schema";
import type { PatientFilterDoctorOption } from "@/features/patients/model/types";
import { DoctorFormDialogHeader } from "@/features/doctors/ui/doctor-form-dialog-header";
import {
  patientDialogFooterClassName,
  patientDialogHeaderClassName,
} from "@/features/patients/ui/patient-dialog-styles";
import { PatientDoctorCombobox } from "@/features/patients/ui/patient-doctor-combobox";
import { PatientVisitDateFilter } from "@/features/patients/ui/patient-visit-date-filter";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { cn } from "@/shared/lib/utils";
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
import { DialogScrollArea } from "@/shared/ui/scroll-area";

type CreatePatientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctors: PatientFilterDoctorOption[];
};

const defaultValues: CreatePatientFormValues = {
  name: "",
  condition: "",
  date: "",
  doctorId: "",
};

const dialogBodyClassName = "flex flex-col gap-5 px-6 py-5 pr-3";

function applyCreatePatientError(
  error: unknown,
  setError: ReturnType<typeof useForm<CreatePatientFormValues>>["setError"],
) {
  if (!(error instanceof ApiRequestError)) {
    setError("root", { message: "Unable to create patient. Try again." });
    return;
  }

  setError("root", { message: error.message });
}

export function CreatePatientDialog({ open, onOpenChange, doctors }: CreatePatientDialogProps) {
  const role = useSessionStore((state) => state.user?.role);
  const isAdmin = role === "admin";

  const form = useForm<CreatePatientFormValues>({
    resolver: zodResolver(createPatientSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { reset, setError, clearErrors, formState } = form;
  const rootError = formState.errors.root?.message;

  const createMutation = useCreatePatientMutation();

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [open, reset, clearErrors]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (isAdmin && !values.doctorId?.trim()) {
      form.setError("doctorId", { message: "Doctor is required" });
      return;
    }

    clearErrors("root");

    try {
      await createMutation.mutateAsync(toCreatePatientInput(values));
      reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      applyCreatePatientError(error, setError);
    }
  });

  const pending = createMutation.isPending;

  const handleOpenChange = (next: boolean) => {
    if (pending) {
      return;
    }

    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!flex h-fit max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DoctorFormDialogHeader
          icon={UserPlus}
          eyebrow="New patient"
          title="Add patient"
          description="Create a patient record and assign them to a doctor on the roster."
          headerClassName={patientDialogHeaderClassName}
          className="shrink-0"
        />

        <Form {...form}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex min-h-0 flex-col overflow-hidden"
          >
            <DialogScrollArea>
              <div className={dialogBodyClassName}>
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
                            value={field.value ?? ""}
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
                      <FormLabel>Condition (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Hypertension"
                          disabled={pending}
                          {...field}
                          value={field.value ?? ""}
                        />
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
                      <FormLabel>Visit date (optional)</FormLabel>
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
            </DialogScrollArea>

            <DialogFooter
              showCloseButton={false}
              className={cn(patientDialogFooterClassName, "shrink-0")}
            >
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
                Create patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}