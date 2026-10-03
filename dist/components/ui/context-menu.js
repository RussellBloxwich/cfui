import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, CaretRightIcon, CircleIcon } from "@phosphor-icons/react";
import { Slottable } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                            
const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (_jsxs(ContextMenuPrimitive.SubTrigger, { ref: ref, "data-inset": inset, className: cn("cfui-context-menu-sub-trigger", inset && "cfui-context-menu-sub-trigger--inset", className), ...props, children: [_jsx(Slottable, { children: children }), _jsx(CaretRightIcon, { className: "cfui-context-menu-sub-trigger-icon" })] })));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;
const ContextMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(ContextMenuPrimitive.SubContent, { ref: ref, className: cn("cfui-context-menu-sub-content", className), ...props })));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;
const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(ContextMenuPrimitive.Portal, { children: _jsx(ContextMenuPrimitive.Content, { ref: ref, className: cn("cfui-context-menu-content", className), ...props }) })));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;
const ContextMenuItem = React.forwardRef(({ className, inset, variant = "default", ...props }, ref) => (_jsx(ContextMenuPrimitive.Item, { ref: ref, "data-inset": inset, className: cn("cfui-context-menu-item", variant === "destructive" && "cfui-context-menu-item--destructive", inset && "cfui-context-menu-item--inset", className), ...props })));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;
const ContextMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (_jsxs(ContextMenuPrimitive.CheckboxItem, { ref: ref, className: cn("cfui-context-menu-checkbox-item", className), checked: checked, ...props, children: [_jsx("span", { className: "cfui-context-menu-item-indicator", children: _jsx(ContextMenuPrimitive.ItemIndicator, { children: _jsx(CheckIcon, { weight: "bold", className: "cfui-context-menu-indicator-icon" }) }) }), _jsx(Slottable, { children: children })] })));
ContextMenuCheckboxItem.displayName =
    ContextMenuPrimitive.CheckboxItem.displayName;
const ContextMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (_jsxs(ContextMenuPrimitive.RadioItem, { ref: ref, className: cn("cfui-context-menu-radio-item", className), ...props, children: [_jsx("span", { className: "cfui-context-menu-item-indicator", children: _jsx(ContextMenuPrimitive.ItemIndicator, { children: _jsx(CircleIcon, { weight: "fill", className: "cfui-context-menu-indicator-dot" }) }) }), _jsx(Slottable, { children: children })] })));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;
const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (_jsx(ContextMenuPrimitive.Label, { ref: ref, "data-inset": inset, className: cn("cfui-context-menu-label", inset && "cfui-context-menu-label--inset", className), ...props })));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;
const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx(ContextMenuPrimitive.Separator, { ref: ref, className: cn("cfui-context-menu-separator", className), ...props })));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;
const ContextMenuShortcut = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("span", { ref: ref, className: cn("cfui-context-menu-shortcut", className), ...props }));
});
ContextMenuShortcut.displayName = "ContextMenuShortcut";
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup, };
//# sourceMappingURL=context-menu.js.map