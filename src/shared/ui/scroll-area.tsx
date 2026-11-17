"use client"

import * as React from "react"
import { cn } from "cn"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportClassName?: string
}

function ScrollArea({
  className,
  viewportClassName,
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
          "[&>div]:!block [&>div]:min-w-full",
          viewportClassName,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "z-20 flex touch-none p-px transition-colors select-none",
        "bg-muted/40",
        "data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent",
        "data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border transition-colors hover:bg-muted-foreground/50"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

/** Modal form body: grows with content; ScrollBar appears only when content exceeds max height. */
function DialogScrollArea({
  className,
  children,
  ...props
}: Omit<ScrollAreaProps, "type">) {
  return (
    <ScrollArea
      type="auto"
      className={cn(
        "h-auto w-full min-h-0 max-h-[min(calc(90dvh-12rem),32rem)]",
        className,
      )}
      viewportClassName="max-h-[min(calc(90dvh-12rem),32rem)]"
      {...props}
    >
      {children}
    </ScrollArea>
  )
}

export { ScrollArea, ScrollBar, DialogScrollArea }