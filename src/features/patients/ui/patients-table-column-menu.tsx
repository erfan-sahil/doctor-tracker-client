"use client";

import type { ColumnDef, OnChangeFn, VisibilityState } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Label } from "@/shared/ui/label";

type PatientsTableColumnMenuProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: OnChangeFn<VisibilityState>;
};

function isColumnVisible(columnId: string, visibility: VisibilityState): boolean {
  return visibility[columnId] !== false;
}

function columnLabel(columnId: string): string {
  return columnId.charAt(0).toUpperCase() + columnId.slice(1);
}

export function PatientsTableColumnMenu<TData>({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
}: PatientsTableColumnMenuProps<TData>) {
  const hideableColumns = columns.filter((column) => {
    const id = column.id ?? (column as { accessorKey?: string }).accessorKey;
    return id && column.enableHiding !== false;
  });

  return (
    <div className="flex flex-col gap-2">
      <Label id="patient-table-columns-label">Columns</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="w-full justify-start"
            aria-labelledby="patient-table-columns-label"
          >
            <Columns3 className="size-4" aria-hidden="true" />
            Customize
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {hideableColumns.map((column) => {
            const columnId = column.id ?? String((column as { accessorKey?: string }).accessorKey);

            return (
              <DropdownMenuCheckboxItem
                key={columnId}
                checked={isColumnVisible(columnId, columnVisibility)}
                onCheckedChange={(value) => {
                  onColumnVisibilityChange((current) => ({
                    ...current,
                    [columnId]: value,
                  }));
                }}
              >
                {columnLabel(columnId)}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}