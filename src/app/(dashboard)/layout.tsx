import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/ui/auth-guard";
import { DashboardShell } from "@/shared/ui/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>
      <AuthGuard>{children}</AuthGuard>
    </DashboardShell>
  );
}
