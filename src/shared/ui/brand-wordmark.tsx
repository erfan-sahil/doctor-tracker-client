import { cn } from "@/shared/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  /** Use sidebar color tokens (default) or standard foreground tokens */
  variant?: "sidebar" | "default";
};

export function BrandWordmark({ className, variant = "sidebar" }: BrandWordmarkProps) {
  const doctorTone =
    variant === "sidebar"
      ? "text-[color-mix(in_oklch,var(--primary)_58%,var(--sidebar-foreground))]"
      : "text-[color-mix(in_oklch,var(--primary)_45%,var(--foreground))]";
  const trackerTone = "text-primary";

  return (
    <span
      className={cn(
        "flex min-w-0 flex-col gap-px text-left leading-none",
        "font-[family-name:var(--font-brand)]",
        className,
      )}
    >
      <span
        className={cn(
          "text-xs font-semibold tracking-[0.01em]",
          doctorTone,
        )}
      >
        Doctor
      </span>
      <span className={cn("text-[0.9375rem] font-bold tracking-[-0.02em]", trackerTone)}>
        Tracker
      </span>
    </span>
  );
}