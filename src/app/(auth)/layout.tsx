import type { ReactNode } from "react";

import { ThemeToggle } from "@/shared/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,color-mix(in_oklch,var(--primary),transparent_86%),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--border), transparent 40%) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--border), transparent 40%) 1px, transparent 1px)",
          backgroundSize: "3.5rem 3.5rem",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />
      <div className="absolute top-3 right-3 z-10 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      <div className="relative z-[1] w-full max-w-md min-w-0">{children}</div>
    </div>
  );
}