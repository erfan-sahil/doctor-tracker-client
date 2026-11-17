import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/shared/config/site";

const navItems = [
  { href: siteConfig.routes.dashboard, label: "Dashboard" },
  { href: siteConfig.routes.doctors, label: "Doctors" },
  { href: siteConfig.routes.patients, label: "Patients" },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link
            href={siteConfig.routes.dashboard}
            className="font-semibold tracking-tight"
          >
            {siteConfig.name}
          </Link>
          <nav className="text-muted-foreground flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8">
        {children}
      </div>
    </div>
  );
}
