import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type DashboardPageProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardPage({ children, className }: DashboardPageProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-6", className)}>{children}</div>
  );
}