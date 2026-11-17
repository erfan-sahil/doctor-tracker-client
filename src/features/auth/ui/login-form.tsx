"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { login } from "@/features/auth/api/auth-api";
import { sanitizeNext } from "@/features/auth/lib/sanitize-next";
import { loginSchema, type LoginFormValues } from "@/features/auth/model/login-schema";
import { useSessionStore } from "@/features/auth/model/session-store";
import { currentUserQuery } from "@/features/auth/queries/current-user";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { getQueryClient } from "@/shared/lib/query/client";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { authFieldInputClassName, PasswordInput } from "@/shared/ui/password-input";

const formBodyClassName = "flex flex-col gap-5 px-8 pt-6";
const formFieldClassName = "flex flex-col gap-2";
const submitButtonClassName =
  "h-10 w-full rounded-2xl text-sm font-medium shadow-sm dark:shadow-none";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useSessionStore((state) => state.setSession);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      getQueryClient().setQueryData(currentUserQuery.queryKey, session.user);
      router.replace(sanitizeNext(searchParams.get("next")));
    },
    onError: (error) => {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Unable to sign in. Try again.";
      setFormError(message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    loginMutation.mutate(data);
  });

  const pending = loginMutation.isPending;

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden rounded-2xl py-0 shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.04]",
        "dark:shadow-black/25 dark:ring-white/[0.06]",
      )}
    >
      <CardHeader
        className={cn(
          "relative items-center gap-3.5 overflow-hidden border-b border-primary/22 px-8 py-10 text-center sm:px-10 sm:py-12",
          "bg-[color-mix(in_oklch,var(--primary),var(--background)_86%)]",
          "dark:border-primary/20 dark:bg-[color-mix(in_oklch,var(--card),var(--primary)_9%)]",
        )}
      >
        <div className="flex flex-col items-center gap-3.5 text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">Sign in</p>
          <CardTitle className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed text-balance">
            Enter your clinic credentials to access your workspace.
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className={cn(formBodyClassName, "pb-0")}>
          <div className={formFieldClassName}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoFocus
              disabled={pending}
              aria-invalid={errors.email ? true : undefined}
              className={authFieldInputClassName}
              {...register("email", {
                onChange: () => setFormError(null),
              })}
            />
            {errors.email ? (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            ) : null}
          </div>

          <div className={formFieldClassName}>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              disabled={pending}
              aria-invalid={errors.password ? true : undefined}
              {...register("password", {
                onChange: () => setFormError(null),
              })}
            />
            {errors.password ? (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            ) : null}
          </div>

          {formError ? (
            <p
              className="border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border px-3 py-2 text-sm"
              role="alert"
            >
              {formError}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="border-t-0 bg-transparent px-8 pt-6 pb-8">
          <Button type="submit" size="lg" className={submitButtonClassName} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}