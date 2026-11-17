"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import type { DoctorWithUser } from "@/features/doctors/model/types";
import { siteConfig } from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export const doctorTableColumns: ColumnDef<DoctorWithUser>[] = [
  {
    id: "name",
    accessorFn: (row) => row.doctor.name,
    header: "Name",
    cell: ({ row }) => {
      const { doctor } = row.original;
      return (
        <Link
          href={`${siteConfig.routes.doctors}/${doctor.id}`}
          className="font-medium hover:underline"
        >
          {doctor.name}
        </Link>
      );
    },
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
      return (
        <Badge variant={active ? "secondary" : "outline"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const id = row.original.doctor.id;
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`${siteConfig.routes.doctors}/${id}`}>View</Link>
        </Button>
      );
    },
  },
];