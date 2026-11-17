"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { DashboardIconTile } from "@/features/overview/ui/dashboard-icon-tile";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export type DashboardStatAccent = "doctors" | "patients" | "visits";

type DashboardStatCardProps = {
  label: string;
  value: ReactNode;
  hint: ReactNode;
  icon: LucideIcon;
  loading?: boolean;
  className?: string;
};

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  loading = false,
  className,
}: DashboardStatCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-0 overflow-hidden border-t-2 border-t-primary py-0",
        className,
      )}
    >
      <CardContent className="flex flex-1 flex-col justify-center gap-4 px-5 pt-5 pb-4">
        <div className="flex items-start gap-3.5">
          <DashboardIconTile icon={Icon} tone="surface" size="lg" />

          <div className="min-w-0 space-y-1.5">
            <p className="text-muted-foreground text-sm leading-none font-medium">{label}</p>
            <div className="text-foreground text-3xl font-semibold tracking-tight tabular-nums">
              {loading ? <Skeleton className="h-9 w-28" /> : value}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-primary/[0.06] text-muted-foreground border-border/70 mt-auto border-t px-5 py-3 text-xs leading-relaxed">
        {loading ? <Skeleton className="h-3 w-full max-w-[14rem]" /> : hint}
      </CardFooter>
    </Card>
  );
}