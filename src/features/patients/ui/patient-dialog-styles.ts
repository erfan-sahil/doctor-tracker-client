import { cn } from "@/shared/lib/utils";

export const patientDialogHeaderClassName = cn(
  "gap-2 border-b border-primary/22 px-6 py-5 text-left",
  "bg-[color-mix(in_oklch,var(--primary),var(--background)_86%)]",
  "dark:border-primary/20 dark:bg-[color-mix(in_oklch,var(--card),var(--primary)_9%)]",
);

export const patientDialogBodyClassName = "flex flex-col gap-5 px-6 py-5";

export const patientDetailsHeaderClassName = cn(
  patientDialogHeaderClassName,
  "gap-3 border-b border-border/60 py-4",
);

export const patientDetailsBodyClassName = "flex flex-col gap-6 bg-background px-6 py-5";

export const patientDetailsSectionClassName = "flex flex-col gap-3";

export const patientDeleteDialogHeaderClassName = cn(
  "gap-2 border-b border-destructive/12 px-6 py-5 text-left",
  "bg-[color-mix(in_oklch,var(--destructive),var(--background)_94%)]",
  "dark:border-destructive/12 dark:bg-[color-mix(in_oklch,var(--card),var(--destructive)_5%)]",
);

export { directoryDialogFooterClassName as patientDialogFooterClassName } from "@/shared/ui/directory-dialog-footer-styles";