import { cn } from "@/lib/utils"
import React from "react"

export const VerticalSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("pl:min-h-full pl:w-[2px]", className)}
    {...props}
    ref={ref}
  />
))
VerticalSeparator.displayName = "VerticalSeparator"

export const HorizontalSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("pl:h-[2px] pl:min-w-full", className)}
    {...props}
    ref={ref}
  />
))
HorizontalSeparator.displayName = "HorizontalSeparator"
