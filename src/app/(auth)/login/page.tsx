import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthLoading } from "@/features/auth/ui/auth-loading";
import { GuestGuard } from "@/features/auth/ui/guest-guard";
import { LoginForm } from "@/features/auth/ui/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <GuestGuard>
        <LoginForm />
      </GuestGuard>
    </Suspense>
  );
}