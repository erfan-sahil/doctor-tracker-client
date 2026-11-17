import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

type DoctorFormDialogHeaderProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  headerClassName: string;
  className?: string;
  variant?: "primary" | "destructive";
};

const eyebrowClassName = {
  primary: "text-primary",
  destructive: "text-destructive",
} as const;

const iconWrapClassName = {
  primary: "bg-primary/12 text-primary",
  destructive: "bg-destructive/12 text-destructive",
} as const;

export function DoctorFormDialogHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  headerClassName,
  className,
  variant = "primary",
}: DoctorFormDialogHeaderProps) {
  return (
    <DialogHeader className={cn(headerClassName, className)}>
      <div className="flex gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            iconWrapClassName[variant],
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 text-left">
          <p
            className={cn(
              "text-xs font-semibold tracking-[0.14em] uppercase",
              eyebrowClassName[variant],
            )}
          >
            {eyebrow}
          </p>
          <DialogTitle className="text-lg font-semibold tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>
  );
}