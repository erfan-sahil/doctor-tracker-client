import type { ReactNode } from "react";

import { AdminGuard } from "@/features/auth/ui/admin-guard";

export default function DoctorsLayout({ children }: { children: ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}