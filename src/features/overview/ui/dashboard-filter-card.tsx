"use client";

import { CalendarRange } from "lucide-react";
import type { ReactNode } from "react";

import { DashboardIconTile } from "@/features/overview/ui/dashboard-icon-tile";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

type DashboardFilterCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardFilterCard({ children, className }: DashboardFilterCardProps) {
  return (
    <Card className={cn("gap-0 overflow-visible py-0", className)}>
      <CardHeader className="bg-primary/[0.04] flex flex-row items-start gap-3 border-b px-5 py-4 sm:px-6">
        <DashboardIconTile icon={CalendarRange} tone="surface" size="md" />
        <div className="min-w-0 space-y-1 pt-0.5">
          <CardTitle className="text-base font-semibold tracking-tight">Report range</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Narrow metrics by visit date and how activity is grouped.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4 sm:px-6">{children}</CardContent>
    </Card>
  );
}