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
      id: "contact",
      accessorFn: (row) =>
        [row.user.email, row.doctor.phone?.trim()].filter(Boolean).join(" "),
      header: "Contact",
      cell: ({ row }) => {
        const email = row.original.user.email;
        const phone = row.original.doctor.phone?.trim();

        return (
          <div className="flex min-w-0 flex-col gap-0.5">
            <a
              href={`mailto:${email}`}
              className="text-muted-foreground hover:text-foreground truncate text-sm underline-offset-4 hover:underline"
            >
              {email}
            </a>
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-muted-foreground/90 hover:text-foreground truncate text-xs underline-offset-4 hover:underline"
              >
                {phone}
              </a>
            ) : (
              <span className="text-muted-foreground text-xs">No phone</span>
            )}
          </div>
        );
      },
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