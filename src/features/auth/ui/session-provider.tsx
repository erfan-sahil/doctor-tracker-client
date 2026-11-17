"use client";

import { useEffect, type ReactNode } from "react";

import { bootstrapSession } from "../lib/bootstrap-session";
import { useSessionStore } from "../model/session-store";

export function SessionProvider({ children }: { children: ReactNode }) {
  const finishBootstrap = useSessionStore((state) => state.finishBootstrap);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await bootstrapSession();

      if (!cancelled) {
        finishBootstrap();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [finishBootstrap]);

  return children;
}