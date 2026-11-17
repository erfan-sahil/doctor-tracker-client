"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { DoctorFormDialogHeader } from "@/features/doctors/ui/doctor-form-dialog-header";
import { useDeletePatientMutation } from "@/features/patients/mutations/use-delete-patient";
import type { Patient } from "@/features/patients/model/types";
import {
  patientDeleteDialogHeaderClassName,
  patientDialogFooterClassName,
} from "@/features/patients/ui/patient-dialog-styles";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/shared/ui/dialog";

type DeletePatientDialogProps = {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeletePatientDialog({ patient, open, onOpenChange }: DeletePatientDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const deleteMutation = useDeletePatientMutation();
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
    if (!patient) {
      return;
    }

    setError(null);

    try {
      await deleteMutation.mutateAsync(patient.id);
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : "Unable to delete patient. Try again.";
      setError(message);
    }
  };

  if (!patient) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DoctorFormDialogHeader
          icon={Trash2}
          variant="destructive"
          eyebrow="Remove patient"
          title="Delete patient"
          description={
            <>
              This permanently removes{" "}
              <span className="text-foreground font-medium">{patient.name}</span> from the
              clinic records.
            </>
          }
          headerClassName={patientDeleteDialogHeaderClassName}
        />

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

        <DialogFooter className={patientDialogFooterClassName}>
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