"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import type { PatientFilterDoctorOption } from "@/features/patients/model/types";
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
}: PatientDoctorComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === value),
    [doctors, value],
  );

  const displayLabel = selectedDoctor?.name ?? placeholder;

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
          className={cn(
            "h-8 w-full max-w-full min-w-0 shrink justify-between font-normal",
            value
              ? "border-primary/30 bg-accent text-accent-foreground hover:!bg-accent hover:!text-accent-foreground aria-expanded:!bg-accent aria-expanded:!text-accent-foreground"
              : "text-muted-foreground hover:!bg-accent/35 hover:!text-foreground aria-expanded:!bg-accent/35",
            className,
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">{displayLabel}</span>
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
                  className={cn(filterCommandItemClassName, "min-w-0 overflow-hidden")}
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