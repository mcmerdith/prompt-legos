import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { app } from "@/utils/shims";

const buttonVariants = cva("pl:rounded-sm pl:p-1", {
  variants: {
    variant: {
      default:
        "pl:border-secondary pl:bg-secondary/80 pl:hover:border-secondary/80 pl:hover:bg-secondary/60",
      widget:
        "pl:border-secondary/80 pl:bg-secondary/60 pl:hover:border-secondary/60 pl:hover:bg-secondary/40",
      transparent: "pl:border-transparent pl:bg-transparent",
      outline:
        "pl:border-secondary/80 pl:bg-transparent pl:hover:border-secondary/60",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Button({
  iconStart,
  iconEnd,
  variant,
  className,
  children,
  ...props
}: {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
} & VariantProps<typeof buttonVariants> &
  React.ComponentPropsWithRef<"button">) {
  return (
    <button
      className={cn(
        "pl:flex pl:flex-row pl:items-center pl:justify-center pl:gap-2",
        className,
        buttonVariants({ variant }),
      )}
      {...props}
    >
      {iconStart}
      {children}
      {iconEnd}
    </button>
  );
}
