"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export const authFieldInputClassName =
  [
    "h-10 rounded-2xl border-auth-input-border bg-auth-input px-3.5 text-sm leading-5 font-normal tracking-normal text-foreground antialiased",
    "placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/60 dark:placeholder:text-muted-foreground/65",
    "focus-visible:border-ring focus-visible:bg-auth-input-focus focus-visible:ring-ring/25",
    "disabled:opacity-60 dark:shadow-none",
  ].join(" ");

type PasswordInputProps = React.ComponentProps<typeof Input>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className={cn(authFieldInputClassName, "pr-11", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground absolute top-1/2 right-1.5 size-8 -translate-y-1/2 rounded-xl"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };