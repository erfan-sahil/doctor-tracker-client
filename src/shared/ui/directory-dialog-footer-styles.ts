import { cn } from "@/shared/lib/utils";

/** Cancel + primary actions: one row on all breakpoints; equal width on narrow screens. */
export const directoryDialogFooterClassName = cn(
  "mx-0 mb-0 !flex-row flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/40 px-4 py-3 dark:bg-white/[0.04] sm:gap-3 sm:px-6 sm:py-4",
  "[&_[data-slot=button]:not(:only-child)]:h-10 [&_[data-slot=button]:not(:only-child)]:min-w-0 [&_[data-slot=button]:not(:only-child)]:flex-1 [&_[data-slot=button]:not(:only-child)]:px-3 [&_[data-slot=button]:not(:only-child)]:text-sm",
  "sm:[&_[data-slot=button]:not(:only-child)]:flex-none sm:[&_[data-slot=button]:not(:only-child)]:px-4",
  "[&_[data-slot=button]]:cursor-pointer",
);