import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react";
import { Slottable } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                      
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, size = "default", asChild = false, ...props }, ref) => (_jsxs(SelectPrimitive.Trigger, { ref: ref, asChild: asChild, "data-cfui-component": "Select", "data-cfui-part": "trigger", "data-size": size, className: cn("cfui-select-trigger", size === "sm" && "cfui-select-trigger-sm", size === "lg" && "cfui-select-trigger-lg", className), ...props, children: [asChild ? _jsx(Slottable, { children: children }) : children, _jsx(SelectPrimitive.Icon, { asChild: true, children: _jsx("span", { "aria-hidden": "true", className: "cfui-select-icon", children: _jsx(CaretDownIcon, { className: "cfui-select-icon-svg" }) }) })] })));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.ScrollUpButton, { ref: ref, "data-cfui-component": "Select", "data-cfui-part": "scroll-up-button", className: cn("cfui-select-scroll-up-button", className), ...props, children: _jsx(CaretUpIcon, { className: "cfui-select-scroll-button-svg" }) })));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.ScrollDownButton, { ref: ref, "data-cfui-component": "Select", "data-cfui-part": "scroll-down-button", className: cn("cfui-select-scroll-down-button", className), ...props, children: _jsx(CaretDownIcon, { className: "cfui-select-scroll-button-svg" }) })));
SelectScrollDownButton.displayName =
    SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", sideOffset = 4, ...props }, ref) => (_jsx(SelectPrimitive.Portal, { children: _jsxs(SelectPrimitive.Content, { ref: ref, "data-cfui-component": "Select", "data-cfui-part": "content", className: cn("cfui-select-content", className), position: position, sideOffset: sideOffset, ...props, children: [_jsx(SelectScrollUpButton, {}), _jsx(SelectPrimitive.Viewport, { className: "cfui-select-viewport", children: children }), _jsx(SelectScrollDownButton, {})] }) })));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.Label, { ref: ref, "data-cfui-component": "Select", "data-cfui-part": "label", className: cn("cfui-select-label", className), ...props })));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, asChild = false, ...props }, ref) => (_jsxs(SelectPrimitive.Item, { ref: ref, asChild: asChild, "data-cfui-component": "Select", "data-cfui-part": "item", className: cn("cfui-select-item", className), ...props, children: [_jsx("span", { className: "cfui-select-item-indicator-wrapper", children: _jsx(SelectPrimitive.ItemIndicator, { children: _jsx(CheckIcon, { className: "cfui-select-item-indicator-svg", weight: "bold" }) }) }), asChild ? (_jsx(Slottable, { children: _jsx(SelectPrimitive.ItemText, { asChild: true, children: children }) })) : (_jsx(SelectPrimitive.ItemText, { children: children }))] })));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.Separator, { ref: ref, "data-cfui-component": "Select", "data-cfui-part": "separator", className: cn("cfui-select-separator", className), ...props })));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, };
//# sourceMappingURL=select.js.map