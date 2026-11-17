"use client";

import { Building2, CircleUser, Mail, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { DoctorWithUser } from "@/features/doctors/model/types";
import {
  doctorDetailsBodyClassName,
  doctorDetailsSectionClassName,
  doctorDialogFooterClassName,
  doctorDialogHeaderClassName,
} from "@/features/doctors/ui/doctor-dialog-styles";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";

type DoctorDetailsDialogProps = {
  doctor: DoctorWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  mutedValue?: boolean;
};

function InfoCard({ icon: Icon, label, value, mutedValue = false }: InfoCardProps) {
  return (
    <div className="border-border/80 bg-muted/35 flex gap-3 rounded-xl border p-3.5">
      <div className="bg-background text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-sm">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p
          className={cn(
            "text-sm leading-snug font-medium break-words",
            mutedValue && "text-muted-foreground font-normal",
          )}
        >
          {value}
        </p>
      </div>
    </div>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className={cn(doctorDialogHeaderClassName, "gap-4")}>
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            Doctor details
          </p>
          <div className="flex items-start gap-4">
            <div
              className="bg-primary/15 text-primary flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold ring-1 ring-primary/20"
              aria-hidden
            >
              {doctorInitials(profile.name)}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
              <DialogTitle className="text-xl leading-tight font-semibold tracking-tight">
                {profile.name}
              </DialogTitle>
              <Badge variant={user.isActive ? "secondary" : "outline"} className="w-fit">
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
              <p className="text-muted-foreground truncate text-sm">{user.email}</p>
            </div>
          </div>
        </DialogHeader>

        <section className={doctorDetailsBodyClassName}>
          <div className={doctorDetailsSectionClassName}>
            <h3 className="text-foreground text-sm font-semibold">Practice</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={Stethoscope}
                label="Specialization"
                value={profile.specialization ?? "Not set"}
                mutedValue={!profile.specialization}
              />
              <InfoCard
                icon={Building2}
                label="Hospital"
                value={profile.hospital ?? "Not set"}
                mutedValue={!profile.hospital}
              />
            </div>
          </div>

          <Separator />

          <div className={doctorDetailsSectionClassName}>
            <h3 className="text-foreground text-sm font-semibold">Account</h3>
            <div className="grid gap-3">
              <InfoCard icon={Mail} label="Login email" value={user.email} />
              <InfoCard
                icon={CircleUser}
                label="Sign-in"
                value={user.isActive ? "Enabled" : "Disabled"}
                mutedValue={!user.isActive}
              />
            </div>
          </div>
        </section>

        <DialogFooter className={doctorDialogFooterClassName}>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}