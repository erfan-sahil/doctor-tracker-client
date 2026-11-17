"use client";

import { X } from "lucide-react";

import { directoryFilterOutlineButtonClassName } from "@/shared/lib/directory-filter-button-styles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type ClearFiltersButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

export function ClearFiltersButton({ onClick, className, disabled }: ClearFiltersButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className={directoryFilterOutlineButtonClassName(false, cn("shrink-0 justify-start gap-2", className))}
      onClick={onClick}
    >
      <X className="size-4 shrink-0 opacity-70" aria-hidden="true" />
      Clear filters
    </Button>
  );
}