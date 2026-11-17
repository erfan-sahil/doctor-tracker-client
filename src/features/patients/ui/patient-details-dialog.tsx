"use client";

import { Calendar, HeartPulse, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Patient } from "@/features/patients/model/types";
import {
  patientDetailsBodyClassName,
  patientDetailsHeaderClassName,
  patientDetailsSectionClassName,
  patientDialogFooterClassName,
} from "@/features/patients/ui/patient-dialog-styles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type PatientDetailsDialogProps = {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorName: string | undefined;
};

function patientInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "PT";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

type DetailFieldProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  empty?: boolean;
  className?: string;
};

function DetailField({
  icon: Icon,
  label,
  value,
  empty = false,
  className,
}: DetailFieldProps) {
  return (
    <div
      className={cn(
        "border-border/70 bg-card/80 flex gap-3.5 rounded-xl border p-4",
        className,
      )}
    >
      <div className="bg-primary/12 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.08em] uppercase">
          {label}
        </p>
        <p
          className={cn(
            "text-foreground text-sm leading-snug font-medium wrap-break-word",
            empty && "text-muted-foreground font-normal italic",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

type DetailsSectionProps = {
  title: string;
  children: React.ReactNode;
};

function DetailsSection({ title, children }: DetailsSectionProps) {
  return (
    <section className={patientDetailsSectionClassName}>
      <h3 className="text-foreground flex items-center gap-2.5 text-sm font-semibold tracking-tight">
        <span className="bg-primary h-3.5 w-1 shrink-0 rounded-full" aria-hidden />
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PatientDetailsDialog({
  patient,
  open,
  onOpenChange,
  doctorName,
}: PatientDetailsDialogProps) {
  if (!patient) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className={patientDetailsHeaderClassName}>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "relative flex size-14 shrink-0 items-center justify-center",
                "rounded-xl bg-linear-to-br from-primary/25 via-primary/15 to-primary/5",
                "text-primary text-base font-semibold",
              )}
              aria-hidden
            >
              {patientInitials(patient.name)}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
                Patient record
              </p>
              <DialogTitle className="text-xl leading-tight font-semibold tracking-tight">
                {patient.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className={patientDetailsBodyClassName}>
          <DetailsSection title="Clinical">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailField
                icon={HeartPulse}
                label="Condition"
                value={patient.condition ?? "Not set"}
                empty={!patient.condition}
              />
              <DetailField
                icon={Calendar}
                label="Visit date"
                value={patient.date ?? "Not set"}
                empty={!patient.date}
              />
            </div>
          </DetailsSection>

          <DetailsSection title="Care team">
            <DetailField
              icon={Stethoscope}
              label="Assigned doctor"
              value={doctorName ?? patient.doctorId}
            />
          </DetailsSection>
        </div>

        <DialogFooter className={patientDialogFooterClassName}>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}