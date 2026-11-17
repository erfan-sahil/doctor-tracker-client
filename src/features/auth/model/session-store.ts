import { create } from "zustand";

import { registerAuthSessionInvalidation } from "@/shared/lib/api/session-invalidation";
import { setAccessToken, subscribeAccessToken } from "@/shared/lib/api/token";
import { resetAppQueriesForAuthChange } from "@/shared/lib/query/reset-on-auth-change";

import type { PublicUser, Session } from "./types";

type SessionStatus = "anonymous" | "authenticated";

type SessionState = {
  user: PublicUser | null;
  accessToken: string | null;
  status: SessionStatus;
  isBootstrapped: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
  finishBootstrap: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  accessToken: null,
  status: "anonymous",
  isBootstrapped: false,
  setSession: ({ user, accessToken }) => {
    const previousUser = useSessionStore.getState().user;

    set({ user, accessToken, status: "authenticated" });
    setAccessToken(accessToken);

    if (
      previousUser &&
      (previousUser.id !== user.id || previousUser.role !== user.role)
    ) {
      resetAppQueriesForAuthChange();
    }
  },
  clearSession: () => {
    set({ user: null, accessToken: null, status: "anonymous" });
    setAccessToken(null);
    resetAppQueriesForAuthChange();
  },
  finishBootstrap: () => {
    set({ isBootstrapped: true });
  },
}));

subscribeAccessToken((accessToken) => {
  if (accessToken) {
    useSessionStore.setState({ accessToken });
  }
});

registerAuthSessionInvalidation(() => {
  useSessionStore.getState().clearSession();
});
