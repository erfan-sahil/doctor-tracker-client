import { Loader2 } from "lucide-react";

export function DashboardRouteLoading() {
  return (
    <div
      className="flex min-h-[min(70dvh,calc(100dvh-7rem))] w-full min-w-0 animate-in fade-in-50 items-center justify-center duration-150"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="bg-background ring-border flex size-12 items-center justify-center rounded-full shadow-sm ring-1">
        <Loader2 className="text-primary size-6 animate-spin" aria-hidden />
      </div>
    </div>
  );
}