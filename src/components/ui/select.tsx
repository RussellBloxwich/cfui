import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react";
import { Slottable } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./select.css";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  size?: "default" | "sm" | "lg";
}

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, size = "default", asChild = false, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    data-cfui-component="Select"
    data-cfui-part="trigger"
    data-size={size}
    className={cn(
      "cfui-select-trigger",
      size === "sm" && "cfui-select-trigger-sm",
      size === "lg" && "cfui-select-trigger-lg",
      className
    )}
    {...props}
  >
    {asChild ? <Slottable>{children}</Slottable> : children}
    <SelectPrimitive.Icon asChild>
      <span aria-hidden="true" className="cfui-select-icon">
        <CaretDownIcon className="cfui-select-icon-svg" />
      </span>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-cfui-component="Select"
    data-cfui-part="scroll-up-button"
    className={cn("cfui-select-scroll-up-button", className)}
    {...props}
  >
    <CaretUpIcon className="cfui-select-scroll-button-svg" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-cfui-component="Select"
    data-cfui-part="scroll-down-button"
    className={cn("cfui-select-scroll-down-button", className)}
    {...props}
  >
    <CaretDownIcon className="cfui-select-scroll-button-svg" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", sideOffset = 4, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-cfui-component="Select"
      data-cfui-part="content"
      className={cn("cfui-select-content", className)}
      position={position}
      sideOffset={sideOffset}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className="cfui-select-viewport">
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-cfui-component="Select"
    data-cfui-part="label"
    className={cn("cfui-select-label", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, asChild = false, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    asChild={asChild}
    data-cfui-component="Select"
    data-cfui-part="item"
    className={cn("cfui-select-item", className)}
    {...props}
  >
    <span className="cfui-select-item-indicator-wrapper">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="cfui-select-item-indicator-svg" weight="bold" />
      </SelectPrimitive.ItemIndicator>
    </span>
    {asChild ? (
      <Slottable>
        <SelectPrimitive.ItemText asChild>{children}</SelectPrimitive.ItemText>
      </Slottable>
    ) : (
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    )}
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-cfui-component="Select"
    data-cfui-part="separator"
    className={cn("cfui-select-separator", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
