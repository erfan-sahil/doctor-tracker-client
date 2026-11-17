"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { sanitizeNext } from "@/features/auth/lib/sanitize-next";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";

import { useSessionStore } from "../model/session-store";
import { AuthLoading } from "./auth-loading";

function AuthSessionRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped);
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    if (!isBootstrapped || status === "authenticated") {
      return;
    }

    const query = searchParams.toString();
    const returnPath = query ? `${pathname}?${query}` : pathname;
    const next = encodeURIComponent(sanitizeNext(returnPath));
    router.replace(`${siteConfig.routes.login}?next=${next}`);
  }, [isBootstrapped, pathname, router, searchParams, status]);

  return null;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped);
  const status = useSessionStore((state) => state.status);
  const isAuthenticated = isBootstrapped && status === "authenticated";

  return (
    <>
      <AuthSessionRedirect />
      {!isAuthenticated ? <AuthLoading /> : null}
      <div className={cn(!isAuthenticated && "sr-only")} aria-hidden={!isAuthenticated}>
        {children}
      </div>
    </>
  );
}