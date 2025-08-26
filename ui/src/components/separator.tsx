import React from "react";

import { cn } from "@/lib/utils";

export function VerticalSeparator({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  return (
    <div className={cn("pl:min-h-full pl:w-[2px]", className)} {...props} />
  );
}

export function HorizontalSeparator({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  return (
    <div className={cn("pl:h-[2px] pl:min-w-full", className)} {...props} />
  );
}
