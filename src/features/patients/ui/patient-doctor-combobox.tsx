"use client";

import { Check, ChevronsUpDown, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";

import type { PatientFilterDoctorOption } from "@/features/patients/model/types";
import { directoryFilterOutlineButtonClassName } from "@/shared/lib/directory-filter-button-styles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

type PatientDoctorComboboxProps = {
  id?: string;
  value: string;
  onValueChange: (doctorId: string) => void;
  doctors: PatientFilterDoctorOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  allLabel?: string;
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
  /** Rich trigger shows avatar, name, and email (patient forms). */
  variant?: "compact" | "rich";
};

const filterCommandItemClassName = cn(
  "data-selected:!bg-transparent data-selected:text-foreground",
  "hover:bg-accent/35 hover:text-accent-foreground",
  "data-selected:hover:!bg-accent/35 data-selected:hover:text-accent-foreground",
  "data-selected:focus-visible:!bg-accent/35 data-selected:focus-visible:text-accent-foreground",
  "data-[active-value=true]:!bg-accent data-[active-value=true]:text-accent-foreground",
  "data-[active-value=true]:hover:!bg-accent data-[active-value=true]:hover:text-accent-foreground",
  "data-[active-value=true]:data-selected:!bg-accent data-[active-value=true]:data-selected:text-accent-foreground",
  "data-[active-value=true]:data-selected:hover:!bg-accent",
  "data-[active-value=true]:data-selected:focus-visible:!bg-accent",
);

function doctorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function DoctorAvatarBadge({
  doctor,
  empty,
  className,
}: {
  doctor?: PatientFilterDoctorOption;
  empty?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold tracking-tight",
        empty
          ? "bg-muted text-muted-foreground"
          : "bg-primary/12 text-primary",
        className,
      )}
      aria-hidden
    >
      {empty || !doctor ? (
        <Stethoscope className="size-3.5" />
      ) : (
        doctorInitials(doctor.name)
      )}
    </span>
  );
}

function TriggerLabel({
  variant,
  selectedDoctor,
  placeholder,
}: {
  variant: "compact" | "rich";
  selectedDoctor?: PatientFilterDoctorOption;
  placeholder: string;
}) {
  if (variant === "rich") {
    return (
      <span className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
        <DoctorAvatarBadge doctor={selectedDoctor} empty={!selectedDoctor} />
        {selectedDoctor ? (
          <span className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden">
            <span className="truncate text-sm font-medium leading-none">{selectedDoctor.name}</span>
            <span className="text-muted-foreground truncate text-xs leading-none">
              {selectedDoctor.email}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground truncate text-sm">{placeholder}</span>
        )}
      </span>
    );
  }

  const displayLabel = selectedDoctor?.name ?? placeholder;

  return (
    <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
      <DoctorAvatarBadge
        doctor={selectedDoctor}
        empty={!selectedDoctor}
        className="size-6 rounded-[5px] text-[10px]"
      />
      <span
        className={cn(
          "min-w-0 truncate",
          selectedDoctor ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {displayLabel}
      </span>
    </span>
  );
}

export function PatientDoctorCombobox({
  id,
  value,
  onValueChange,
  doctors,
  placeholder = "Select doctor",
  searchPlaceholder = "Search doctors...",
  emptyLabel = "No doctors found.",
  allLabel,
  allowClear = false,
  disabled = false,
  className,
  variant = "compact",
}: PatientDoctorComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === value),
    [doctors, value],
  );

  const hasValue = Boolean(value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={directoryFilterOutlineButtonClassName(hasValue, cn(
            "w-full max-w-full min-w-0 shrink justify-between gap-2",
            variant === "rich" ? "h-auto min-h-10 py-2" : "h-8",
            className,
          ))}
        >
          <TriggerLabel
            variant={variant}
            selectedDoctor={selectedDoctor}
            placeholder={placeholder}
          />
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[100] max-w-[min(100vw-2rem,var(--radix-popover-trigger-width))] w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              {allowClear && allLabel ? (
                <CommandItem
                  value={allLabel}
                  data-active-value={value ? undefined : true}
                  className={filterCommandItemClassName}
                  onSelect={() => {
                    onValueChange("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("size-4", value ? "opacity-0" : "opacity-100")}
                    aria-hidden="true"
                  />
                  {allLabel}
                </CommandItem>
              ) : null}
              {doctors.map((doctor) => (
                <CommandItem
                  key={doctor.id}
                  value={`${doctor.name} ${doctor.email}`}
                  data-active-value={value === doctor.id ? true : undefined}
                  className={cn(filterCommandItemClassName, "min-w-0 gap-2 overflow-hidden py-2")}
                  onSelect={() => {
                    onValueChange(doctor.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      value === doctor.id ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                  <DoctorAvatarBadge doctor={doctor} className="size-8 rounded-lg text-xs" />
                  <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden text-left">
                    <span className="w-full truncate font-medium">{doctor.name}</span>
                    <span className="text-muted-foreground w-full truncate text-xs">
                      {doctor.email}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}