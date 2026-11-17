"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import {
  formatDateOnly,
  formatDateOnlyLabel,
  parseDateOnly,
} from "@/features/patients/lib/date-only";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

type PatientVisitDateFilterProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const START_MONTH = new Date(1990, 0, 1);
const END_MONTH = new Date(new Date().getFullYear() + 5, 11, 31);

export function PatientVisitDateFilter({
  id,
  value,
  onValueChange,
  placeholder = "All dates",
  disabled = false,
  className,
}: PatientVisitDateFilterProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateOnly(value);
  const displayLabel = formatDateOnlyLabel(value) ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-8 w-full max-w-full min-w-0 shrink justify-start gap-2 font-normal",
            value
              ? "border-primary/30 bg-accent text-accent-foreground hover:!bg-accent hover:!text-accent-foreground aria-expanded:!bg-accent aria-expanded:!text-accent-foreground"
              : "text-muted-foreground hover:!bg-accent/35 hover:!text-foreground aria-expanded:!bg-accent/35",
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-left">{displayLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[100] w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={START_MONTH}
          endMonth={END_MONTH}
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            if (!date) {
              return;
            }

            onValueChange(formatDateOnly(date));
            setOpen(false);
          }}
        />
        <div className="border-border border-t p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-center hover:!bg-accent/35 hover:!text-accent-foreground"
            disabled={!value}
            onClick={() => {
              onValueChange("");
              setOpen(false);
            }}
          >
            {placeholder}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}