"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LayoutDashboard, Stethoscope, Users } from "lucide-react";

import { LogoutButton } from "@/features/auth/ui/logout-button";
import { siteConfig } from "@/shared/config/site";
import { Separator } from "@/shared/ui/separator";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/shared/ui/sidebar";

const navItems = [
  { href: siteConfig.routes.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: siteConfig.routes.doctors, label: "Doctors", icon: Stethoscope },
  { href: siteConfig.routes.patients, label: "Patients", icon: Users },
] as const;

function isActive(pathname: string, href: string) {
  if (href === siteConfig.routes.dashboard) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-2 pb-0">
          <SidebarMenu className="gap-0">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip={siteConfig.name}>
                <Link href={siteConfig.routes.dashboard}>
                  <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-semibold">
                    DT
                  </span>
                  <span className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-semibold">{siteConfig.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      Clinic workspace
                    </span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Separator className="bg-sidebar-border mx-3 w-auto" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-2">Clinic</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href} aria-current={active ? "page" : undefined}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-sidebar-border gap-3 border-t pt-2">
          <LogoutButton />
          <p className="text-muted-foreground px-2 text-xs leading-relaxed group-data-[collapsible=icon]:hidden">
            Doctors, patients, and clinic activity.
          </p>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-svh min-w-0">
        <header className="bg-background/95 supports-backdrop-filter:backdrop-blur-sm sticky top-0 z-10 flex min-h-14 shrink-0 items-center gap-2 border-b px-3 sm:gap-3 sm:px-4 md:px-6">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium sm:text-base">
            {siteConfig.name}
          </span>
          <ThemeToggle />
        </header>
        <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col p-3 sm:p-4 md:p-6 md:pb-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
