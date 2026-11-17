"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { Patient } from "@/features/patients/model/types";
import { PatientTableRowActions } from "@/features/patients/ui/patient-table-row-actions";

export type PatientTableActions = {
  onDetails: (patient: Patient) => void;
  onUpdate: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
};

type CreatePatientTableColumnsOptions = {
  doctorNameById: Map<string, string>;
  showDoctorColumn: boolean;
};

export function createPatientTableColumns(
  actions: PatientTableActions,
  options: CreatePatientTableColumnsOptions,
): ColumnDef<Patient>[] {
  const columns: ColumnDef<Patient>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      id: "condition",
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => row.original.condition ?? "—",
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Visit date",
      cell: ({ row }) => row.original.date ?? "—",
    },
  ];

  if (options.showDoctorColumn) {
    columns.push({
      id: "doctor",
      accessorKey: "doctorId",
      header: "Doctor",
      cell: ({ row }) =>
        options.doctorNameById.get(row.original.doctorId) ?? row.original.doctorId,
    });
  }

  columns.push({
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <PatientTableRowActions
        patient={row.original}
        onDetails={actions.onDetails}
        onUpdate={actions.onUpdate}
        onDelete={actions.onDelete}
      />
    ),
  });

  return columns;
}