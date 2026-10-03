import * as React from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./native-select.css";

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  sizeVariant?: "default" | "sm" | "lg";
  wrapperClassName?: string;
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      className,
      wrapperClassName,
      error = false,
      sizeVariant = "default",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        data-disabled={disabled ? "true" : undefined}
        data-invalid={error ? "true" : undefined}
        className={cn(
          "cfui-native-select-wrapper",
          sizeVariant !== "default" && `cfui-native-select-wrapper--${sizeVariant}`,
          disabled && "cfui-native-select-wrapper--disabled",
          error && "cfui-native-select-wrapper--error",
          wrapperClassName
        )}
      >
        <select
          ref={ref}
          disabled={disabled}
          data-invalid={error ? "true" : undefined}
          aria-invalid={error ? true : props["aria-invalid"]}
          className={cn("cfui-native-select", className)}
          {...props}
        >
          {children}
        </select>
        <span className="cfui-native-select-icon" aria-hidden="true">
          <CaretDownIcon weight="bold" />
        </span>
      </div>
    );
  }
);
NativeSelect.displayName = "NativeSelect";

export interface NativeSelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const NativeSelectOption = React.forwardRef<
  HTMLOptionElement,
  NativeSelectOptionProps
>(({ className, ...props }, ref) => (
  <option
    ref={ref}
    className={cn("cfui-native-select-option", className)}
    {...props}
  />
));
NativeSelectOption.displayName = "NativeSelectOption";

export interface NativeSelectOptGroupProps
  extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {}

const NativeSelectOptGroup = React.forwardRef<
  HTMLOptGroupElement,
  NativeSelectOptGroupProps
>(({ className, ...props }, ref) => (
  <optgroup
    ref={ref}
    className={cn("cfui-native-select-optgroup", className)}
    {...props}
  />
));
NativeSelectOptGroup.displayName = "NativeSelectOptGroup";

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
