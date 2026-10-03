import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils.js";
import "./spinner.css";

const spinnerVariants = cva("cfui-spinner", {
  variants: {
    size: {
      xs: "cfui-spinner--xs",
      sm: "cfui-spinner--sm",
      md: "cfui-spinner--md",
      lg: "cfui-spinner--lg",
      xl: "cfui-spinner--xl",
    },
    variant: {
      default: "cfui-spinner--default",
      brand: "cfui-spinner--brand",
      contrast: "cfui-spinner--contrast",
      current: "cfui-spinner--current",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
  strokeWidth?: number;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      className,
      size = "md",
      variant = "default",
      label = "Loading",
      strokeWidth = 3,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size, variant }), className)}
        {...props}
      >
        <svg
          className="cfui-spinner-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <circle
            className="cfui-spinner-track"
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <path
            className="cfui-spinner-indicator"
            d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </svg>
        {label && <span className="cfui-spinner-sr">{label}</span>}
      </span>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
