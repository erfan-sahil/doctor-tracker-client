"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { DoctorWithUser } from "@/features/doctors/model/types";
import { DoctorTableRowActions } from "@/features/doctors/ui/doctor-table-row-actions";
import { ActiveStatusBadge } from "@/shared/ui/status-badge";

export type DoctorTableActions = {
  onDetails: (doctor: DoctorWithUser) => void;
  onUpdate: (doctor: DoctorWithUser) => void;
  onDelete: (doctor: DoctorWithUser) => void;
};

export function createDoctorTableColumns(
  actions: DoctorTableActions,
): ColumnDef<DoctorWithUser>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => row.doctor.name,
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.doctor.name}</span>
      ),
    },
    {
      id: "email",
      accessorFn: (row) => row.user.email,
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.user.email}</span>
      ),
    },
    {
      id: "specialization",
      accessorFn: (row) => row.doctor.specialization,
      header: "Specialization",
      cell: ({ row }) => row.original.doctor.specialization ?? "—",
    },
    {
      id: "hospital",
      accessorFn: (row) => row.doctor.hospital,
      header: "Hospital",
      cell: ({ row }) => row.original.doctor.hospital ?? "—",
    },
    {
      id: "status",
      accessorFn: (row) => row.user.isActive,
      header: "Status",
      cell: ({ row }) => {
        const active = row.original.user.isActive;
        return <ActiveStatusBadge active={active} />;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DoctorTableRowActions
          doctor={row.original}
          onDetails={actions.onDetails}
          onUpdate={actions.onUpdate}
          onDelete={actions.onDelete}
        />
      ),
    },
  ];
}