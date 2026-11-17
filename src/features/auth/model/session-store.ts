import { create } from "zustand";

import { setAccessToken, subscribeAccessToken } from "@/shared/lib/api/token";

import type { PublicUser, Session } from "./types";

type SessionStatus = "anonymous" | "authenticated";

type SessionState = {
  user: PublicUser | null;
  accessToken: string | null;
  status: SessionStatus;
  setSession: (session: Session) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  accessToken: null,
  status: "anonymous",
  setSession: ({ user, accessToken }) => {
    set({ user, accessToken, status: "authenticated" });
    setAccessToken(accessToken);
  },
  clearSession: () => {
    set({ user: null, accessToken: null, status: "anonymous" });
    setAccessToken(null);
  },
}));

subscribeAccessToken((accessToken) => {
  if (accessToken) {
    useSessionStore.setState({ accessToken });
    return;
  }

  useSessionStore.setState({
    user: null,
    accessToken: null,
    status: "anonymous",
  });
});
