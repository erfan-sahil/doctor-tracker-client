"use client";

import { Building2, Mail, ShieldCheck, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { DoctorWithUser } from "@/features/doctors/model/types";
import {
  doctorDetailsBodyClassName,
  doctorDetailsEmailStripClassName,
  doctorDetailsHeaderClassName,
  doctorDetailsSectionClassName,
  doctorDialogFooterClassName,
} from "@/features/doctors/ui/doctor-dialog-styles";
import { cn } from "@/shared/lib/utils";
import { ActiveStatusBadge } from "@/shared/ui/status-badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type DoctorDetailsDialogProps = {
  doctor: DoctorWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DoctorEmailStrip({ email }: { email: string }) {
  return (
    <div
      className={cn(
        "border-border/80 bg-card/90 flex gap-4 rounded-xl border p-4",
        "border-l-primary border-l-[3px]",
      )}
    >
      <div className="bg-primary/12 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Mail className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.08em] uppercase">
          Email address
        </p>
        <a
          href={`mailto:${email}`}
          className="text-foreground hover:text-primary mt-1.5 block text-sm leading-relaxed font-medium break-all underline-offset-4 hover:underline sm:text-[15px]"
        >
          {email}
        </a>
      </div>
    </div>
  );
}

function doctorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "DR";
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
    <section className={doctorDetailsSectionClassName}>
      <h3 className="text-foreground flex items-center gap-2.5 text-sm font-semibold tracking-tight">
        <span
          className="bg-primary h-3.5 w-1 shrink-0 rounded-full"
          aria-hidden
        />
        {title}
      </h3>
      {children}
    </section>
  );
}

export function DoctorDetailsDialog({
  doctor,
  open,
  onOpenChange,
}: DoctorDetailsDialogProps) {
  if (!doctor) {
    return null;
  }

  const { doctor: profile, user } = doctor;
  const signInEnabled = user.isActive;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className={doctorDetailsHeaderClassName}>
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            Doctor profile
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className={cn(
                "relative flex size-18 shrink-0 items-center justify-center",
                "rounded-2xl bg-linear-to-br from-primary/25 via-primary/15 to-primary/5",
                "text-primary text-xl font-semibold",
              )}
              aria-hidden
            >
              {doctorInitials(profile.name)}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <DialogTitle className="text-xl leading-tight font-semibold tracking-tight sm:text-2xl">
                  {profile.name}
                </DialogTitle>
                <ActiveStatusBadge active={user.isActive} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className={doctorDetailsEmailStripClassName}>
          <DoctorEmailStrip email={user.email} />
        </div>

        <div className={doctorDetailsBodyClassName}>
          <DetailsSection title="Practice">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailField
                icon={Stethoscope}
                label="Specialization"
                value={profile.specialization ?? "Not set"}
                empty={!profile.specialization}
              />
              <DetailField
                icon={Building2}
                label="Hospital"
                value={profile.hospital ?? "Not set"}
                empty={!profile.hospital}
              />
            </div>
          </DetailsSection>

          <DetailsSection title="Account access">
            <DetailField
              icon={ShieldCheck}
              label="Portal sign-in"
              value={signInEnabled ? "Enabled" : "Disabled"}
              empty={!signInEnabled}
            />
          </DetailsSection>
        </div>

        <DialogFooter className={doctorDialogFooterClassName}>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}