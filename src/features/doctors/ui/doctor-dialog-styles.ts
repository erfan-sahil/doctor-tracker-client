import { cn } from "@/shared/lib/utils";

export const doctorDialogHeaderClassName = cn(
  "gap-2 border-b border-primary/22 px-6 py-5 text-left",
  "bg-[color-mix(in_oklch,var(--primary),var(--background)_86%)]",
  "dark:border-primary/20 dark:bg-[color-mix(in_oklch,var(--card),var(--primary)_9%)]",
);

export const doctorDialogBodyClassName = "flex flex-col gap-5 px-6 py-5";

export const doctorDetailsBodyClassName = "flex flex-col gap-5 px-6 py-5";

export const doctorDetailsSectionClassName = "flex flex-col gap-3";

export const doctorDialogFooterClassName =
  "mx-0 mb-0 gap-3 border-t bg-muted/50 px-6 py-4 sm:flex-row sm:justify-end";