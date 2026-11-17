import type { Metadata } from "next";

import { siteConfig } from "@/shared/config/site";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-muted-foreground text-sm">
        Staff sign-in for {siteConfig.name} will live here.
      </p>
    </section>
  );
}
