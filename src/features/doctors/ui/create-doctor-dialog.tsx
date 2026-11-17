"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { createDoctor } from "@/features/doctors/api/doctors-api";
import {
  createDoctorSchema,
  type CreateDoctorFormValues,
} from "@/features/doctors/model/create-doctor-schema";
import type { CreateDoctorInput } from "@/features/doctors/model/types";
import { doctorKeys } from "@/features/doctors/queries/keys";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { getQueryClient } from "@/shared/lib/query/client";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "@/shared/ui/password-input";

type CreateDoctorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: CreateDoctorFormValues = {
  name: "",
  email: "",
  password: "",
  specialization: "",
  hospital: "",
};

function toCreateDoctorInput(values: CreateDoctorFormValues): CreateDoctorInput {
  const specialization = values.specialization?.trim();
  const hospital = values.hospital?.trim();

  return {
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    ...(specialization ? { specialization } : {}),
    ...(hospital ? { hospital } : {}),
  };
}

export function CreateDoctorDialog({ open, onOpenChange }: CreateDoctorDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateDoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: async () => {
      await Promise.all([
        getQueryClient().invalidateQueries({ queryKey: doctorKeys.lists() }),
        getQueryClient().invalidateQueries({ queryKey: doctorKeys.filterOptions() }),
      ]);
      reset(defaultValues);
      onOpenChange(false);
    },
    onError: (error) => {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Unable to create doctor. Try again.";
      setError("root", { message });
    },
  });

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(toCreateDoctorInput(values));
  });

  const pending = createMutation.isPending;
  const rootError = errors.root?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add doctor</DialogTitle>
          <DialogDescription>
            Create a doctor account with login credentials for the clinic roster.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="doctor-name">Name</Label>
            <Input
              id="doctor-name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="doctor-email">Email</Label>
            <Input
              id="doctor-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="doctor-password">Password</Label>
            <PasswordInput
              id="doctor-password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="doctor-specialization">Specialization (optional)</Label>
            <Input id="doctor-specialization" {...register("specialization")} />
            {errors.specialization ? (
              <p className="text-destructive text-xs">{errors.specialization.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="doctor-hospital">Hospital (optional)</Label>
            <Input id="doctor-hospital" {...register("hospital")} />
            {errors.hospital ? (
              <p className="text-destructive text-xs">{errors.hospital.message}</p>
            ) : null}
          </div>

          {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}

          <DialogFooter showCloseButton={false} className="border-t-0 bg-transparent p-0 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Create doctor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}