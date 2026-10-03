import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils.js";
import "./label.css";

const labelVariants = cva("cfui-label", {
  variants: {
    size: {
      default: "",
      sm: "cfui-label--sm",
      lg: "cfui-label--lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  disabled?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, size, required, disabled, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants({ size }),
      disabled && "cfui-label--disabled",
      className
    )}
    {...props}
  >
    {children}
    {required && (
      <span className="cfui-label-asterisk" aria-hidden="true">
        *
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
