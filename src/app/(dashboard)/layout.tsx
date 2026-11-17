import type { ReactNode } from "react";
import { Suspense } from "react";

import { AuthGuard } from "@/features/auth/ui/auth-guard";
import { AuthLoading } from "@/features/auth/ui/auth-loading";
import { DashboardShell } from "@/shared/ui/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AuthLoading />}>
      <DashboardShell>
        <AuthGuard>{children}</AuthGuard>
      </DashboardShell>
    </Suspense>
  );
}
