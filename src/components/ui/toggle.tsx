import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils.js";
import "./toggle.css";

const toggleVariants = cva("cfui-toggle", {
  variants: {
    variant: {
      default: "cfui-toggle--default",
      outline: "cfui-toggle--outline",
    },
    size: {
      default: "cfui-toggle--size-default",
      sm: "cfui-toggle--size-sm",
      lg: "cfui-toggle--size-lg",
      sidebar: "cfui-toggle--size-sidebar",
      tiny: "cfui-toggle--size-tiny",
      xs: "cfui-toggle--size-tiny",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
