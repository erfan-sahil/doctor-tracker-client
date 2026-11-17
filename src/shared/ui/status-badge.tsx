import { CircleCheck, CircleOff } from "lucide-react";
import type * as React from "react";

import { cn } from "@/shared/lib/utils";
import { Badge, type badgeVariants } from "@/shared/ui/badge";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export type StatusBadgeProps = React.ComponentProps<typeof Badge> & {
  icon?: React.ReactNode;
};

export function StatusBadge({
  icon,
  children,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge className={cn(className)} {...props}>
      {icon ? (
        <span
          data-icon="inline-start"
          className="inline-flex shrink-0 [&_svg]:pointer-events-none [&_svg]:size-3"
        >
          {icon}
        </span>
      ) : null}
      {children}
    </Badge>
  );
}

export type ActiveStatusBadgeProps = {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
  showIcon?: boolean;
  activeVariant?: BadgeVariant;
  inactiveVariant?: BadgeVariant;
};

export function ActiveStatusBadge({
  active,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  className,
  showIcon = true,
  activeVariant = "success",
  inactiveVariant = "neutral",
}: ActiveStatusBadgeProps) {
  return (
    <StatusBadge
      variant={active ? activeVariant : inactiveVariant}
      className={className}
      icon={
        showIcon ? (
          active ? (
            <CircleCheck aria-hidden />
          ) : (
            <CircleOff aria-hidden />
          )
        ) : undefined
      }
    >
      {active ? activeLabel : inactiveLabel}
    </StatusBadge>
  );
}