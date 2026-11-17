"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { login } from "@/features/auth/api/auth-api";
import { loginSchema, type LoginFormValues } from "@/features/auth/model/login-schema";
import { useSessionStore } from "@/features/auth/model/session-store";
import { currentUserQuery } from "@/features/auth/queries/current-user";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { getQueryClient } from "@/shared/lib/query/client";
import { sanitizeNext } from "@/features/auth/lib/sanitize-next";
import { siteConfig } from "@/shared/config/site";
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

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useSessionStore((state) => state.setSession);

  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          nextErrors[field] ??= issue.message;
        }
      }

      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    loginMutation.mutate(parsed.data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Staff access to {siteConfig.name}. Use your clinic credentials.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoFocus
              aria-invalid={fieldErrors.email ? true : undefined}
              disabled={loginMutation.isPending}
              value={values.email}
              onChange={(event) => {
                setValues((current) => ({ ...current, email: event.target.value }));
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }}
            />
            {fieldErrors.email ? (
              <p className="text-destructive text-xs">{fieldErrors.email}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={fieldErrors.password ? true : undefined}
              disabled={loginMutation.isPending}
              value={values.password}
              onChange={(event) => {
                setValues((current) => ({ ...current, password: event.target.value }));
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }}
            />
            {fieldErrors.password ? (
              <p className="text-destructive text-xs">{fieldErrors.password}</p>
            ) : null}
          </div>
          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t-0 bg-transparent">
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" asChild>
            <Link href={siteConfig.routes.home}>Back to home</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}