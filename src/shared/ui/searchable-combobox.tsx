"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

type SearchableComboboxProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  allLabel?: string;
  allowCustom?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Active option stays deep; hover highlight clears when the pointer leaves (cmdk keeps data-selected). */
const filterCommandItemClassName = cn(
  "data-selected:!bg-transparent data-selected:text-foreground",
  "hover:bg-accent/35 hover:text-accent-foreground",
  "data-selected:hover:!bg-accent/35 data-selected:hover:text-accent-foreground",
  "data-selected:focus-visible:!bg-accent/35 data-selected:focus-visible:text-accent-foreground",
  "data-[active-value=true]:!bg-accent data-[active-value=true]:text-accent-foreground",
  "data-[active-value=true]:hover:!bg-accent data-[active-value=true]:hover:text-accent-foreground",
  "data-[active-value=true]:data-selected:!bg-accent data-[active-value=true]:data-selected:text-accent-foreground",
  "data-[active-value=true]:data-selected:hover:!bg-accent",
  "data-[active-value=true]:data-selected:focus-visible:!bg-accent",
);

export function SearchableCombobox({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  searchPlaceholder = "Search...",
  emptyLabel = "No results found.",
  allLabel,
  allowCustom = false,
  disabled = false,
  className,
}: SearchableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const mergedOptions = useMemo(() => {
    if (!value || options.includes(value)) {
      return options;
    }

    return [value, ...options];
  }, [options, value]);

  const displayLabel = value || placeholder;

  const normalizedSearch = search.trim();
  const filteredOptions = useMemo(() => {
    if (!allowCustom || !normalizedSearch) {
      return mergedOptions;
    }

    const query = normalizedSearch.toLowerCase();
    return mergedOptions.filter((option) => option.toLowerCase().includes(query));
  }, [allowCustom, mergedOptions, normalizedSearch]);

  const canCreateCustom =
    allowCustom &&
    normalizedSearch.length > 0 &&
    !mergedOptions.some(
      (option) => option.toLowerCase() === normalizedSearch.toLowerCase(),
    );

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSearch("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-8 w-full justify-between font-normal",
            value
              ? "border-primary/30 bg-accent text-accent-foreground hover:!bg-accent hover:!text-accent-foreground aria-expanded:!bg-accent aria-expanded:!text-accent-foreground"
              : "text-muted-foreground hover:!bg-accent/35 hover:!text-foreground aria-expanded:!bg-accent/35",
            className,
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={!allowCustom}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              {allLabel ? (
                <CommandItem
                  value={allLabel}
                  data-active-value={value ? undefined : true}
                  className={filterCommandItemClassName}
                  onSelect={() => {
                    onValueChange("");
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn("size-4", value ? "opacity-0" : "opacity-100")}
                    aria-hidden="true"
                  />
                  {allLabel}
                </CommandItem>
              ) : null}
              {canCreateCustom ? (
                <CommandItem
                  value={normalizedSearch}
                  data-active-value={value === normalizedSearch ? true : undefined}
                  className={filterCommandItemClassName}
                  onSelect={() => {
                    onValueChange(normalizedSearch);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === normalizedSearch ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                  Use &ldquo;{normalizedSearch}&rdquo;
                </CommandItem>
              ) : null}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  data-active-value={value === option ? true : undefined}
                  className={filterCommandItemClassName}
                  onSelect={() => {
                    onValueChange(option);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === option ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}