import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils.js";
import "./progress.css";

const progressVariants = cva("cfui-progress", {
  variants: {
    variant: {
      default: "cfui-progress--default",
      brand: "cfui-progress--brand",
      success: "cfui-progress--success",
      warning: "cfui-progress--warning",
      danger: "cfui-progress--danger",
    },
    size: {
      sm: "cfui-progress--sm",
      md: "cfui-progress--md",
      lg: "cfui-progress--lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorClassName?: string;
}

const ProgressRoot = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      max = 100,
      variant,
      size,
      indicatorClassName,
      ...props
    },
    ref
  ) => {
    const isIndeterminate = value === undefined || value === null;
    const percentage = isIndeterminate
      ? undefined
      : Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={value}
        max={max}
        className={cn(
          progressVariants({ variant, size }),
          isIndeterminate && "cfui-progress--indeterminate",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("cfui-progress-indicator", indicatorClassName)}
          style={
            percentage !== undefined
              ? { transform: `translateX(-${100 - percentage}%)` }
              : undefined
          }
        />
      </ProgressPrimitive.Root>
    );
  }
);
ProgressRoot.displayName = ProgressPrimitive.Root.displayName;

const ProgressTrack = ProgressPrimitive.Root;
const ProgressIndicator = ProgressPrimitive.Indicator;

export const Progress = Object.assign(ProgressRoot, {
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
});

export { ProgressTrack, ProgressIndicator, progressVariants };
