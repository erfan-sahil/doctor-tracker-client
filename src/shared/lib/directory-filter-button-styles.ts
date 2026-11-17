import { cn } from "@/shared/lib/utils";

/** Shared outline control styling for directory toolbars (filters, columns, clear). */
export function directoryFilterOutlineButtonClassName(
  hasValue: boolean,
  className?: string,
): string {
  return cn(
    "h-8 font-normal",
    hasValue
      ? "border-primary/30 bg-accent text-accent-foreground hover:!bg-accent hover:!text-accent-foreground aria-expanded:!bg-accent aria-expanded:!text-accent-foreground"
      : "text-muted-foreground hover:!bg-accent/35 hover:!text-foreground aria-expanded:!bg-accent/35",
    className,
  );
}