"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { DashboardIconTile } from "@/features/overview/ui/dashboard-icon-tile";
import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type DashboardSectionCardProps = {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  headerAside?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function DashboardSectionCard({
  title,
  description,
  icon: Icon,
  headerAside,
  children,
  className,
  contentClassName,
}: DashboardSectionCardProps) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      <CardHeader className="bg-primary/[0.04] flex flex-row items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          {Icon ? <DashboardIconTile icon={Icon} tone="surface" size="md" /> : null}
          <div className="min-w-0 space-y-1 pt-0.5">
            <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-xs leading-relaxed sm:text-sm">
                {description}
              </CardDescription>
            ) : null}
          </div>
        </div>
        {headerAside ? <div className="shrink-0">{headerAside}</div> : null}
      </CardHeader>
      <CardContent className={cn("px-5 py-5 sm:px-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}