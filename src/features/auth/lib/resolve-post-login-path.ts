import type { PublicUser } from "@/features/auth/model/types";
import { siteConfig } from "@/shared/config/site";

const adminOnlyPathPrefixes = [siteConfig.routes.doctors] as const;

export function resolvePostLoginPath(user: PublicUser, next: string): string {
  if (user.role === "admin") {
    return next;
  }

  const isAdminOnly = adminOnlyPathPrefixes.some(
    (prefix) => next === prefix || next.startsWith(`${prefix}/`),
  );

  return isAdminOnly ? siteConfig.routes.overview : next;
}