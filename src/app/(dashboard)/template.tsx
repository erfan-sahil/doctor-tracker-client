"use client";

import type { ReactNode } from "react";

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col animate-in fade-in-0 slide-in-from-bottom-0.5 duration-200 fill-mode-both">
      {children}
    </div>
  );
}