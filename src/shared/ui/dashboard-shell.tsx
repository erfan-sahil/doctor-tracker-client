"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { LayoutDashboard, Stethoscope, Users } from "lucide-react";

import { useSessionStore } from "@/features/auth/model/session-store";
import { SidebarUserMenu } from "@/features/auth/ui/sidebar-user-menu";
import { siteConfig } from "@/shared/config/site";
import { BrandWordmark } from "@/shared/ui/brand-wordmark";
import {
  DashboardMobileSidebarSync,
  DashboardNavLink,
  DashboardNavigationProgress,
  DashboardNavigationProvider,
  DashboardNavigationSpinner,
} from "@/shared/ui/dashboard-navigation";
import { Separator } from "@/shared/ui/separator";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
  { href: siteConfig.routes.overview, label: "Overview", icon: LayoutDashboard },
  {
    href: siteConfig.routes.doctors,
    label: "Doctors",
    icon: Stethoscope,
    adminOnly: true,
  },
  { href: siteConfig.routes.patients, label: "Patients", icon: Users },
] as const;

function isActive(pathname: string, href: string) {
  if (href === siteConfig.routes.overview) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = useSessionStore((state) => state.user?.role === "admin");
  const headerTitle = isAdmin ? "Admin Dashboard" : "Doctor Dashboard";
  const visibleNavItems = useMemo(
    () => navItems.filter((item) => !("adminOnly" in item && item.adminOnly) || isAdmin),
    [isAdmin],
  );

  return (
    <DashboardNavigationProvider>
    <SidebarProvider>
      <div
        aria-hidden
        className="bg-sidebar-border pointer-events-none fixed inset-x-0 top-14 z-[11] hidden h-px md:block"
      />
      <DashboardMobileSidebarSync />
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-14 shrink-0 justify-center gap-0 p-2 pb-0">
          <SidebarMenu className="gap-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                tooltip={siteConfig.name}
                className="hover:bg-transparent hover:text-sidebar-foreground active:bg-transparent active:text-sidebar-foreground data-active:bg-transparent data-active:text-sidebar-foreground data-active:font-semibold group-data-[collapsible=icon]:mx-auto"
              >
                <DashboardNavLink href={siteConfig.routes.overview} aria-label={siteConfig.name}>
                  <Image
                    src={siteConfig.brandIcon}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-lg object-contain"
                    priority
                  />
                  <BrandWordmark />
                </DashboardNavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Separator className="bg-sidebar-border mx-3 w-auto group-data-[collapsible=icon]:hidden" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {visibleNavItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className="min-h-10 gap-2.5 px-2.5 py-2 [&_svg]:size-[1.125rem]"
                      >
                        <DashboardNavLink href={item.href} aria-current={active ? "page" : undefined}>
                          <Icon />
                          <span>{item.label}</span>
                        </DashboardNavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-sidebar-border border-t">
          <SidebarUserMenu />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex min-h-svh min-w-0 flex-col">
        <DashboardNavigationProgress />
        <header className="bg-background supports-backdrop-filter:backdrop-blur-sm sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3 sm:gap-3 sm:px-4 md:border-b-0 md:bg-background/95 md:px-6">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium sm:text-base">
            {headerTitle}
          </span>
          <ThemeToggle />
        </header>
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <DashboardNavigationSpinner />
          <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col p-3 sm:p-4 md:p-6 md:pb-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </DashboardNavigationProvider>
  );
}
