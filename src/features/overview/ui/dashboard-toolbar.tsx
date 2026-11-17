"use client";

import { format, subDays } from "date-fns";
import { RotateCcw } from "lucide-react";

import type { DashboardGroupBy } from "@/features/overview/model/types";
import { formatDateOnly } from "@/features/patients/lib/date-only";
import { PatientVisitDateFilter } from "@/features/patients/ui/patient-visit-date-filter";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export type DashboardRangePreset = "7d" | "30d" | "90d" | "all";

export type DashboardFilters = {
  from: string;
  to: string;
  groupBy: DashboardGroupBy;
  preset: DashboardRangePreset;
};

type DashboardToolbarProps = {
  filters: DashboardFilters;
  onFiltersChange: (next: DashboardFilters) => void;
  disabled?: boolean;
  className?: string;
};

const PRESETS: { id: DashboardRangePreset; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "all", label: "All time" },
];

export function filtersFromPreset(preset: DashboardRangePreset): Pick<DashboardFilters, "from" | "to" | "preset"> {
  const today = new Date();

  if (preset === "all") {
    return { from: "", to: "", preset };
  }

  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;

  return {
    from: formatDateOnly(subDays(today, days - 1)),
    to: formatDateOnly(today),
    preset,
  };
}

export const defaultDashboardFilters = (): DashboardFilters => ({
  ...filtersFromPreset("all"),
  groupBy: "day",
});

export function DashboardToolbar({
  filters,
  onFiltersChange,
  disabled = false,
  className,
}: DashboardToolbarProps) {
  const setPartial = (partial: Partial<DashboardFilters>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const applyPreset = (preset: DashboardRangePreset) => {
    onFiltersChange({ ...filters, ...filtersFromPreset(preset) });
  };

  const reset = () => {
    onFiltersChange(defaultDashboardFilters());
  };

  const hasRange = Boolean(filters.from || filters.to);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="bg-primary/[0.06] inline-flex flex-wrap gap-0.5 rounded-lg border border-primary/15 p-1"
          role="group"
          aria-label="Date range presets"
        >
          {PRESETS.map((preset) => {
            const selected = filters.preset === preset.id;

            return (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant={selected ? "secondary" : "ghost"}
                disabled={disabled}
                className={cn(
                  "h-8 rounded-md px-3 text-xs font-medium sm:text-sm",
                  selected && "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                )}
                onClick={() => applyPreset(preset.id)}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-muted-foreground h-8"
          disabled={disabled}
          onClick={reset}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-1.5">
            <Label htmlFor="dashboard-from">From</Label>
            <PatientVisitDateFilter
              id="dashboard-from"
              value={filters.from}
              placeholder="No start date"
              disabled={disabled}
              onValueChange={(from) => {
                setPartial({ from, preset: "all" });
              }}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="dashboard-to">To</Label>
            <PatientVisitDateFilter
              id="dashboard-to"
              value={filters.to}
              placeholder="No end date"
              disabled={disabled}
              onValueChange={(to) => {
                setPartial({ to, preset: "all" });
              }}
            />
          </div>

          <div className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="dashboard-group-by">Group by</Label>
            <Select
              value={filters.groupBy}
              onValueChange={(value) => setPartial({ groupBy: value as DashboardGroupBy })}
              disabled={disabled}
            >
              <SelectTrigger id="dashboard-group-by" size="sm" className="h-8 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                compact
                side="bottom"
                align="start"
                sideOffset={4}
                className="z-[200] min-w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-muted-foreground border-border border-t pt-3 text-xs leading-relaxed">
          {hasRange ? (
            <p>
              Stats include only patients with a visit date
              {filters.from ? ` from ${format(filters.from, "MMM d, yyyy")}` : null}
              {filters.to ? ` through ${format(filters.to, "MMM d, yyyy")}` : null}
              . Records without a visit date are excluded.
            </p>
          ) : (
            <p>All patient records are included, including those without a visit date.</p>
          )}
        </div>
      </div>
    </div>
  );
}