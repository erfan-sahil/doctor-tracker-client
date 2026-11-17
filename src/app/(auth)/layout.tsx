import type { ReactNode } from "react";

import { ThemeToggle } from "@/shared/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary),transparent_84%),transparent)] px-4 py-12 sm:px-6 sm:py-16">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm min-w-0">{children}</div>
    </div>
  );
}
