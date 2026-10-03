import * as React from "react";
import { cn } from "../../utils.js";
import "./input.css";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  sizeVariant?: "default" | "sm" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, sizeVariant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-invalid={error ? "true" : undefined}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={cn(
          "cfui-input",
          sizeVariant !== "default" && `cfui-input--${sizeVariant}`,
          error && "cfui-input--error",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
