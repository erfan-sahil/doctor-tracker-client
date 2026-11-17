"use client"

import * as React from "react"
import { cn } from "cn"

import { TableScrollArea } from "@/shared/ui/scroll-area"

type TableProps = React.ComponentProps<"table"> & {
  containerClassName?: string
}

function Table({ className, containerClassName, ...props }: TableProps) {
  return (
    <TableScrollArea
      data-slot="table-container"
      className={containerClassName}
    >
      <table
        data-slot="table"
        className={cn("w-max min-w-full caption-bottom text-sm", className)}
        {...props}
      />
    </TableScrollArea>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-primary/18 [&_tr]:border-b [&_tr]:bg-table-header",
        "dark:[&_tr]:border-primary/15",
        "[&_tr]:hover:bg-table-header",
        className,
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group/table-row border-b transition-colors",
        "hover:bg-accent/30 hover:text-foreground",
        "has-aria-expanded:bg-accent has-aria-expanded:text-accent-foreground",
        "data-[state=selected]:bg-accent data-[state=selected]:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-primary h-11 px-3 text-left align-middle text-xs font-semibold tracking-[0.06em] whitespace-nowrap uppercase dark:text-primary [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
