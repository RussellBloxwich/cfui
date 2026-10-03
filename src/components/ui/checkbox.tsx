import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./checkbox.css";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, checked, ...props }, ref) => {
  const resolvedChecked = indeterminate ? "indeterminate" : checked;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={resolvedChecked}
      className={cn("cfui-checkbox", className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="cfui-checkbox-indicator">
        <CheckIcon className="cfui-checkbox-check" weight="bold" />
        <MinusIcon className="cfui-checkbox-minus" weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxIndicator = CheckboxPrimitive.Indicator;

export { Checkbox, CheckboxIndicator };
