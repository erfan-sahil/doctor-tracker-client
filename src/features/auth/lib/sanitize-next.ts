import { siteConfig } from "@/shared/config/site";

export function sanitizeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return siteConfig.routes.overview;
  }

  return value;
}