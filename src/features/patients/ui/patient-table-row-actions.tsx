"use client";

import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";

import type { Patient } from "@/features/patients/model/types";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type PatientTableRowActionsProps = {
  patient: Patient;
  onDetails: (patient: Patient) => void;
  onUpdate: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
};

export function PatientTableRowActions({
  patient,
  onDetails,
  onUpdate,
  onDelete,
}: PatientTableRowActionsProps) {
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
            className="text-muted-foreground cursor-pointer"
            aria-label={`Actions for ${patient.name}`}
          >
            <EllipsisVertical className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => onDetails(patient)}>
            <Eye className="size-4" aria-hidden />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onUpdate(patient)}>
            <Pencil className="size-4" aria-hidden />
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(patient)}>
            <Trash2 className="size-4" aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}