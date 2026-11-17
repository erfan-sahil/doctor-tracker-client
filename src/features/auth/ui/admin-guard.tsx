"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";

import { siteConfig } from "@/shared/config/site";

import { useSessionStore } from "../model/session-store";
import { AuthLoading } from "./auth-loading";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped);
  const isAdmin = useSessionStore((state) => state.user?.role === "admin");

  useLayoutEffect(() => {
    if (!isBootstrapped) {
      return;
    }

    if (!isAdmin) {
      router.replace(siteConfig.routes.overview);
    }
  }, [isAdmin, isBootstrapped, router]);

  if (!isBootstrapped || !isAdmin) {
    return <AuthLoading />;
  }

  return children;
}