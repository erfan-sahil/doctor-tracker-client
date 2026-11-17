"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useDeleteDoctorMutation } from "@/features/doctors/mutations/use-delete-doctor";
import type { DoctorWithUser } from "@/features/doctors/model/types";
import {
  doctorDeleteDialogHeaderClassName,
  doctorDialogFooterClassName,
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

type DeleteDoctorDialogProps = {
  doctor: DoctorWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteDoctorDialog({ doctor, open, onOpenChange }: DeleteDoctorDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const deleteMutation = useDeleteDoctorMutation();
  const pending = deleteMutation.isPending;

  const handleOpenChange = (next: boolean) => {
    if (pending) {
      return;
    }
    if (!next) {
      setError(null);
    }
    onOpenChange(next);
  };

  const handleDelete = async () => {
    if (!doctor) {
      return;
    }

    setError(null);

    try {
      await deleteMutation.mutateAsync(doctor.doctor.id);
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : "Unable to delete doctor. Try again.";
      setError(message);
    }
  };

  if (!doctor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className={doctorDeleteDialogHeaderClassName}>
          <p className="text-destructive text-xs font-semibold tracking-[0.14em] uppercase">
            Remove doctor
          </p>
          <DialogTitle className="text-lg font-semibold tracking-tight">Delete doctor</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            This removes <span className="text-foreground font-medium">{doctor.doctor.name}</span> and
            their login account. Doctors with assigned patients cannot be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {error ? (
            <p
              className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
              role="alert"
            >
              {error}
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
          <Button type="button" variant="destructive" disabled={pending} onClick={handleDelete}>
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}