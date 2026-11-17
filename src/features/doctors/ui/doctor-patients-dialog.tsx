"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { toDoctorPatientOption } from "@/features/doctors/lib/to-doctor-patient-option";
import type { DoctorWithUser } from "@/features/doctors/model/types";
import {
  doctorDialogFooterClassName,
  doctorDialogHeaderClassName,
} from "@/features/doctors/ui/doctor-dialog-styles";
import { DoctorFormDialogHeader } from "@/features/doctors/ui/doctor-form-dialog-header";
import { doctorPatientsQuery } from "@/features/doctors/queries/doctors";
import { CreatePatientDialog } from "@/features/patients/ui/create-patient-dialog";
import { DeletePatientDialog } from "@/features/patients/ui/delete-patient-dialog";
import type { Patient } from "@/features/patients/model/types";
import { toApiRequestError } from "@/shared/lib/api/errors";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/shared/ui/dialog";
import { DialogScrollArea } from "@/shared/ui/scroll-area";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type DoctorPatientsDialogProps = {
  doctor: DoctorWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const listBodyClassName = "px-6 py-5";

export function DoctorPatientsDialog({ doctor, open, onOpenChange }: DoctorPatientsDialogProps) {
  const doctorId = doctor?.doctor.id ?? "";
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { data, isPending, isError, error } = useQuery({
    ...doctorPatientsQuery(doctorId),
    enabled: open && Boolean(doctorId),
  });

  const fixedDoctor = useMemo(
    () => (doctor ? toDoctorPatientOption(doctor) : undefined),
    [doctor],
  );

  const patients = data ?? [];
  const errorMessage = isError ? toApiRequestError(error).message : undefined;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setCreateOpen(false);
      setDeleteOpen(false);
      setSelectedPatient(null);
    }
    onOpenChange(next);
  };

  if (!doctor) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="!flex h-fit max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DoctorFormDialogHeader
            icon={Users}
            eyebrow="Assigned patients"
            title={doctor.doctor.name}
            description="Patients linked to this doctor. Add new records or remove assignments."
            headerClassName={doctorDialogHeaderClassName}
            className="shrink-0"
          />

          <DialogScrollArea className="min-h-0 flex-1">
            <div className={listBodyClassName}>
              {errorMessage ? (
                <p className="text-destructive mb-4 text-sm" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <div className="rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Visit date</TableHead>
                      <TableHead className="w-[72px]">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <TableRow key={`patient-skeleton-${index}`}>
                          <TableCell colSpan={4}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : patients.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-muted-foreground h-24 text-center text-sm"
                        >
                          No patients assigned yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      patients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {patient.condition ?? "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {patient.date ?? "—"}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive"
                              aria-label={`Delete ${patient.name}`}
                              onClick={() => {
                                setSelectedPatient(patient);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {!isPending && !isError ? (
                <p className="text-muted-foreground mt-3 text-xs">
                  {patients.length === 1
                    ? "1 patient"
                    : `${patients.length.toLocaleString()} patients`}
                </p>
              ) : null}
            </div>
          </DialogScrollArea>

          <DialogFooter
            showCloseButton={false}
            className={cn(doctorDialogFooterClassName, "shrink-0")}
          >
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" aria-hidden />
              Add patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreatePatientDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        doctors={[]}
        fixedDoctor={fixedDoctor}
        invalidateDoctorPatientsId={doctorId}
      />

      <DeletePatientDialog
        patient={selectedPatient}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        invalidateDoctorPatientsId={doctorId}
      />
    </>
  );
}