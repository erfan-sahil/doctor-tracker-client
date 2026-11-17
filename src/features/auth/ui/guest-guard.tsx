"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { sanitizeNext } from "@/features/auth/lib/sanitize-next";

import { useSessionStore } from "../model/session-store";
import { AuthLoading } from "./auth-loading";

export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped);
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    if (!isBootstrapped || status !== "authenticated") {
      return;
    }

    const next = sanitizeNext(searchParams.get("next"));
    router.replace(next);
  }, [isBootstrapped, router, searchParams, status]);

  if (!isBootstrapped) {
    return <AuthLoading />;
  }

  if (status === "authenticated") {
    return <AuthLoading />;
  }

  return children;
}