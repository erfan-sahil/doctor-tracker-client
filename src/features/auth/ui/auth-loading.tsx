import { Skeleton } from "@/shared/ui/skeleton";

export function AuthLoading() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-4 p-6"
      role="status"
      aria-live="polite"
      aria-label="Checking session"
    >
      <Skeleton className="h-8 w-48 max-w-full" />
      <Skeleton className="h-4 w-64 max-w-full" />
    </div>
  );
}