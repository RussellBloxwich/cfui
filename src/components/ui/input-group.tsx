import * as React from "react";
import { cn } from "../../utils.js";
import "./input-group.css";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  sizeVariant?: "default" | "sm" | "lg";
  disabled?: boolean;
  error?: boolean;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      className,
      sizeVariant = "default",
      disabled = false,
      error = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={error ? "true" : undefined}
        className={cn(
          "cfui-input-group",
          sizeVariant !== "default" && `cfui-input-group--${sizeVariant}`,
          disabled && "cfui-input-group--disabled",
          error && "cfui-input-group--error",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputGroup.displayName = "InputGroup";

export type InputGroupAddonAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end"
  | "inline";

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: InputGroupAddonAlign;
  /** @deprecated Optional placement alias for backwards compatibility */
  placement?: "prefix" | "suffix" | "inline";
}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align, placement, children, ...props }, ref) => {
    const resolvedAlign: InputGroupAddonAlign =
      align ??
      (placement === "prefix"
        ? "inline-start"
        : placement === "suffix"
        ? "inline-end"
        : placement === "inline"
        ? "inline"
        : "inline-start");

    return (
      <div
        ref={ref}
        data-align={resolvedAlign}
        className={cn(
          "cfui-input-group-addon",
          `cfui-input-group-addon--${resolvedAlign}`,
          placement && `cfui-input-group-addon--${placement}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputGroupAddon.displayName = "InputGroupAddon";

export interface InputGroupTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const InputGroupText = React.forwardRef<HTMLSpanElement, InputGroupTextProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("cfui-input-group-text", className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
InputGroupText.displayName = "InputGroupText";

export interface InputGroupInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn("cfui-input-group-input", className)}
        {...props}
      />
    );
  }
);
InputGroupInput.displayName = "InputGroupInput";

export interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sizeVariant?: "default" | "sm" | "lg";
}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, type = "button", disabled, sizeVariant, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        "cfui-input-group-button",
        sizeVariant && `cfui-input-group-button--${sizeVariant}`,
        className
      )}
      {...props}
    />
  );
});
InputGroupButton.displayName = "InputGroupButton";

export interface InputGroupTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  InputGroupTextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn("cfui-input-group-textarea", className)}
      {...props}
    />
  );
});
InputGroupTextarea.displayName = "InputGroupTextarea";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
  InputGroupButton,
  InputGroupTextarea,
};
