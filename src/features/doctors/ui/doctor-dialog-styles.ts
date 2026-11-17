import { cn } from "@/shared/lib/utils";

export const doctorDialogHeaderClassName = cn(
  "gap-2 border-b border-primary/22 px-6 py-5 text-left",
  "bg-[color-mix(in_oklch,var(--primary),var(--background)_86%)]",
  "dark:border-primary/20 dark:bg-[color-mix(in_oklch,var(--card),var(--primary)_9%)]",
);

export const doctorDialogBodyClassName = "flex flex-col gap-5 px-6 py-5";

export const doctorDetailsHeaderClassName = cn(
  doctorDialogHeaderClassName,
  "gap-5 border-b-0 pb-5",
);

export const doctorDetailsEmailStripClassName = cn(
  "border-border border-b bg-muted/20 px-6 py-4",
);

export const doctorDetailsBodyClassName = "flex flex-col gap-8 bg-background px-6 py-6";

export const doctorDetailsSectionClassName = "flex flex-col gap-3.5";

export const doctorDeleteDialogHeaderClassName = cn(
  "gap-2 border-b border-destructive/12 px-6 py-5 text-left",
  "bg-[color-mix(in_oklch,var(--destructive),var(--background)_94%)]",
  "dark:border-destructive/12 dark:bg-[color-mix(in_oklch,var(--card),var(--destructive)_5%)]",
);

export { directoryDialogFooterClassName as doctorDialogFooterClassName } from "@/shared/ui/directory-dialog-footer-styles";