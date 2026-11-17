import type { Metadata } from "next";

import { siteConfig } from "@/shared/config/site";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Staff sign-in for {siteConfig.name} will live here.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
