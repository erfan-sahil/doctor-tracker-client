"use client";

import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";

import type { DoctorWithUser } from "@/features/doctors/model/types";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type DoctorTableRowActionsProps = {
  doctor: DoctorWithUser;
  onDetails: (doctor: DoctorWithUser) => void;
  onUpdate: (doctor: DoctorWithUser) => void;
  onDelete: (doctor: DoctorWithUser) => void;
};

export function DoctorTableRowActions({
  doctor,
  onDetails,
  onUpdate,
  onDelete,
}: DoctorTableRowActionsProps) {
  return (
    <div
      className="flex justify-end"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer text-muted-foreground"
            aria-label={`Actions for ${doctor.doctor.name}`}
          >
            <EllipsisVertical className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => onDetails(doctor)}>
            <Eye className="size-4" aria-hidden />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onUpdate(doctor)}>
            <Pencil className="size-4" aria-hidden />
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(doctor)}>
            <Trash2 className="size-4" aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}