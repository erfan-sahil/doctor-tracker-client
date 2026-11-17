import { useSessionStore } from "@/features/auth/model/session-store";

export function useSessionReady(): boolean {
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped);
  const status = useSessionStore((state) => state.status);

  return isBootstrapped && status === "authenticated";
}