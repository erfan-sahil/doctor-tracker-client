import { getRefreshedAccessToken } from "@/shared/lib/api/client";
import { isUnauthorizedError } from "@/shared/lib/api/errors";

import { getCurrentUser } from "../api/auth-api";
import { useSessionStore } from "../model/session-store";

let bootstrapPromise: Promise<void> | null = null;

async function runBootstrapSession(): Promise<void> {
  try {
    const accessToken = await getRefreshedAccessToken();
    const user = await getCurrentUser();
    useSessionStore.getState().setSession({ user, accessToken });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      useSessionStore.getState().clearSession();
    }
  }
}

export function bootstrapSession(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = runBootstrapSession().catch((error) => {
    bootstrapPromise = null;
    throw error;
  });

  return bootstrapPromise;
}