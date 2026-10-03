import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils.js";
import { useButtonGroup } from "./button-group.js";
import "./button.css";

const buttonVariants = cva("cfui-button", {
  variants: {
    variant: {
      default: "cfui-button--default",
      secondary: "cfui-button--secondary",
      destructive: "cfui-button--destructive",
      outline: "cfui-button--outline",
      ghost: "cfui-button--ghost",
      link: "cfui-button--link",
    },
    size: {
      default: "cfui-button--size-default",
      sm: "cfui-button--size-sm",
      lg: "cfui-button--size-lg",
      icon: "cfui-button--size-icon",
      "icon-sm": "cfui-button--size-icon-sm",
      "icon-lg": "cfui-button--size-icon-lg",
      sidebar: "cfui-button--size-sidebar",
      tiny: "cfui-button--size-tiny",
      xs: "cfui-button--size-tiny",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      type = "button",
      children,
      onClick,
      onKeyDown,
      onClickCapture,
      onKeyDownCapture,
      ...props
    },
    ref
  ) => {
    const buttonGroup = useButtonGroup();
    const resolvedVariant = variant ?? buttonGroup.variant ?? "default";
    const resolvedSize = size ?? buttonGroup.size ?? "default";

    const isDisabled = Boolean(disabled || loading);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    const handleClickCapture = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
      }
      onClickCapture?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onKeyDown?.(e);
    };

    const handleKeyDownCapture = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        e.stopPropagation();
      }
      onKeyDownCapture?.(e);
    };

    const sharedClassName = cn(
      buttonVariants({
        variant: resolvedVariant,
        size: resolvedSize,
        className,
      })
    );

    if (asChild) {
      if (loading) {
        return (
          <Slot
            className={sharedClassName}
            ref={ref}
            aria-disabled={isDisabled ? true : props["aria-disabled"]}
            aria-busy={true}
            data-loading="true"
            data-disabled={isDisabled ? "true" : undefined}
            tabIndex={isDisabled ? -1 : props.tabIndex}
            {...props}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onClickCapture={handleClickCapture}
            onKeyDownCapture={handleKeyDownCapture}
          >
            <span className="cfui-button__spinner" aria-hidden="true" />
            <Slottable>{children}</Slottable>
          </Slot>
        );
      }

      return (
        <Slot
          className={sharedClassName}
          ref={ref}
          aria-disabled={isDisabled ? true : props["aria-disabled"]}
          aria-busy={undefined}
          data-loading={undefined}
          data-disabled={isDisabled ? "true" : undefined}
          tabIndex={isDisabled ? -1 : props.tabIndex}
          {...props}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onClickCapture={handleClickCapture}
          onKeyDownCapture={handleKeyDownCapture}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={sharedClassName}
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled ? true : props["aria-disabled"]}
        aria-busy={loading ? true : undefined}
        data-loading={loading ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        tabIndex={props.tabIndex}
        {...props}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onClickCapture={handleClickCapture}
        onKeyDownCapture={handleKeyDownCapture}
      >
        {loading && (
          <span className="cfui-button__spinner" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
