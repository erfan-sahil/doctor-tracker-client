import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export type DashboardIconTileTone = "brand" | "surface";

const TILE_TONE: Record<DashboardIconTileTone, { box: string; iconSize: string }> = {
  brand: {
    box: "bg-primary text-primary-foreground border-primary/25 shadow-sm",
    iconSize: "size-4",
  },
  surface: {
    box: "bg-primary/12 text-primary border-primary/20",
    iconSize: "size-[1.125rem]",
  },
};

type DashboardIconTileProps = {
  icon: LucideIcon;
  tone?: DashboardIconTileTone;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const TILE_SIZE = {
  sm: "size-9 rounded-lg",
  md: "size-10 rounded-lg",
  lg: "size-11 rounded-lg",
} as const;

export function DashboardIconTile({
  icon: Icon,
  tone = "surface",
  size = "md",
  className,
}: DashboardIconTileProps) {
  const styles = TILE_TONE[tone];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border",
        TILE_SIZE[size],
        styles.box,
        className,
      )}
    >
      <Icon className={styles.iconSize} strokeWidth={1.75} aria-hidden="true" />
    </div>
  );
}