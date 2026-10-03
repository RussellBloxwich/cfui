import * as React from "react";
import { cn } from "../../utils.js";
import "./textarea.css";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  sizeVariant?: "default" | "sm" | "lg";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, sizeVariant = "default", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-invalid={error ? "true" : undefined}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={cn(
          "cfui-textarea",
          sizeVariant !== "default" && `cfui-textarea--${sizeVariant}`,
          error && "cfui-textarea--error",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
