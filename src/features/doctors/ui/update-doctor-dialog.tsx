"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { toUpdateDoctorInput } from "@/features/doctors/lib/to-update-doctor-input";
import { useUpdateDoctorMutation } from "@/features/doctors/mutations/use-update-doctor";
import type { DoctorWithUser } from "@/features/doctors/model/types";
import {
  updateDoctorSchema,
  type UpdateDoctorFormValues,
} from "@/features/doctors/model/update-doctor-schema";
import {
  doctorDialogBodyClassName,
  doctorDialogFooterClassName,
  doctorDialogHeaderClassName,
} from "@/features/doctors/ui/doctor-dialog-styles";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

type UpdateDoctorDialogProps = {
  doctor: DoctorWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function valuesFromDoctor(doctor: DoctorWithUser): UpdateDoctorFormValues {
  return {
    name: doctor.doctor.name,
    specialization: doctor.doctor.specialization ?? "",
    hospital: doctor.doctor.hospital ?? "",
  };
}

export function UpdateDoctorDialog({ doctor, open, onOpenChange }: UpdateDoctorDialogProps) {
  const form = useForm<UpdateDoctorFormValues>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: { name: "", specialization: "", hospital: "" },
    mode: "onSubmit",
  });

  const updateMutation = useUpdateDoctorMutation();
  const pending = updateMutation.isPending;
  const rootError = form.formState.errors.root?.message;

  useEffect(() => {
    if (open && doctor) {
      form.reset(valuesFromDoctor(doctor));
      form.clearErrors();
    }
  }, [open, doctor, form]);

  const handleOpenChange = (next: boolean) => {
    if (pending) {
      return;
    }
    onOpenChange(next);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!doctor) {
      return;
    }

    form.clearErrors("root");

    try {
      await updateMutation.mutateAsync({
        id: doctor.doctor.id,
        input: toUpdateDoctorInput(values),
      });
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Unable to update doctor. Try again.";
      form.setError("root", { message });
    }
  });

  if (!doctor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className={doctorDialogHeaderClassName}>
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            Update doctor
          </p>
          <DialogTitle className="text-lg font-semibold tracking-tight">{doctor.doctor.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Change roster details. Login email cannot be changed here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} noValidate>
            <div className={doctorDialogBodyClassName}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Cardiology"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. City General Hospital"
                        disabled={pending}
                        {...field}
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

            <DialogFooter className={doctorDialogFooterClassName}>
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