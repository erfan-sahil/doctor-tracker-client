"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { useSidebar } from "@/shared/ui/sidebar";

const NAV_SPINNER_DELAY_MS = 150;

type DashboardNavigationContextValue = {
  markNavigating: () => void;
  isNavigating: boolean;
};

const DashboardNavigationContext = createContext<DashboardNavigationContextValue | null>(null);

export function DashboardNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const markNavigating = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const value = useMemo(
    () => ({ markNavigating, isNavigating }),
    [isNavigating, markNavigating],
  );

  return (
    <DashboardNavigationContext.Provider value={value}>{children}</DashboardNavigationContext.Provider>
  );
}

function useDashboardNavigation() {
  const context = useContext(DashboardNavigationContext);
  if (!context) {
    throw new Error("useDashboardNavigation must be used within DashboardNavigationProvider.");
  }
  return context;
}

type DashboardNavLinkProps = React.ComponentProps<typeof Link>;

export function DashboardNavLink({ className, onClick, ...props }: DashboardNavLinkProps) {
  const { markNavigating } = useDashboardNavigation();
  const { isMobile, closeMobileSidebarForNavigation } = useSidebar();

  return (
    <Link
      prefetch
      className={className}
      onClick={(event) => {
        markNavigating();
        if (isMobile) {
          closeMobileSidebarForNavigation();
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}

export function DashboardMobileSidebarSync() {
  const pathname = usePathname();
  const { isMobile, closeMobileSidebarForNavigation } = useSidebar();

  useEffect(() => {
    if (!isMobile) {
      return;
    }
    closeMobileSidebarForNavigation();
  }, [closeMobileSidebarForNavigation, isMobile, pathname]);

  return null;
}

function useDebouncedNavigating(isNavigating: boolean, delayMs: number) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isNavigating) {
      setShow(false);
      return;
    }

    const timer = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, isNavigating]);

  return show;
}

export function DashboardNavigationProgress() {
  const { isNavigating } = useDashboardNavigation();

  if (!isNavigating) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden"
      aria-hidden
    >
      <div
        className={cn(
          "bg-primary h-full w-1/3",
          "motion-safe:animate-[dashboard-nav-progress_0.9s_ease-in-out_infinite]",
        )}
      />
    </div>
  );
}

export function DashboardNavigationSpinner() {
  const { isNavigating } = useDashboardNavigation();
  const showSpinner = useDebouncedNavigating(isNavigating, NAV_SPINNER_DELAY_MS);

  if (!showSpinner) {
    return null;
  }

  return (
    <div
      className="bg-background/55 pointer-events-none absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="bg-background/90 ring-border flex size-12 items-center justify-center rounded-full shadow-sm ring-1">
        <Loader2 className="text-primary size-6 animate-spin" aria-hidden />
      </div>
    </div>
  );
}