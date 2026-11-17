"use client";

import { useEffect, useRef, type ComponentProps } from "react";

import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { Input } from "@/shared/ui/input";

export type DebouncedSearchInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  onDebouncedChange: (value: string) => void;
  debounceMs?: number;
};

export function DebouncedSearchInput({
  value,
  onValueChange,
  onDebouncedChange,
  debounceMs = 350,
  ...props
}: DebouncedSearchInputProps) {
  const debouncedValue = useDebouncedValue(value.trim(), debounceMs);
  const onDebouncedChangeRef = useRef(onDebouncedChange);

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    onDebouncedChangeRef.current(debouncedValue);
  }, [debouncedValue]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    />
  );
}