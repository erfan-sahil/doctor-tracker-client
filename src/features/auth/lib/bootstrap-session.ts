import { setAccessToken } from "@/shared/lib/api/token";

import { getCurrentUser, refreshSession } from "../api/auth-api";
import { useSessionStore } from "../model/session-store";

export async function bootstrapSession(): Promise<void> {
  try {
    const { accessToken } = await refreshSession();
    setAccessToken(accessToken);
    const user = await getCurrentUser();
    useSessionStore.getState().setSession({ user, accessToken });
  } catch {
    useSessionStore.getState().clearSession();
  }
}