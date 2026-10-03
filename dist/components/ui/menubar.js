import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, CaretRightIcon, CircleIcon } from "@phosphor-icons/react";
import { Slottable } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                       
const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const Menubar = React.forwardRef(({ className, ...props }, ref) => (_jsx(MenubarPrimitive.Root, { ref: ref, className: cn("cfui-menubar", className), ...props })));
Menubar.displayName = MenubarPrimitive.Root.displayName;
const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (_jsx(MenubarPrimitive.Trigger, { ref: ref, className: cn("cfui-menubar-trigger", className), ...props })));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;
const MenubarSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (_jsxs(MenubarPrimitive.SubTrigger, { ref: ref, "data-inset": inset, className: cn("cfui-menubar-sub-trigger", inset && "cfui-menubar-sub-trigger--inset", className), ...props, children: [_jsx(Slottable, { children: children }), _jsx(CaretRightIcon, { className: "cfui-menubar-sub-trigger-icon" })] })));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;
const MenubarSubContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(MenubarPrimitive.SubContent, { ref: ref, className: cn("cfui-menubar-sub-content", className), ...props })));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;
const MenubarContent = React.forwardRef(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (_jsx(MenubarPrimitive.Portal, { children: _jsx(MenubarPrimitive.Content, { ref: ref, align: align, alignOffset: alignOffset, sideOffset: sideOffset, className: cn("cfui-menubar-content", className), ...props }) })));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;
const MenubarItem = React.forwardRef(({ className, inset, variant = "default", ...props }, ref) => (_jsx(MenubarPrimitive.Item, { ref: ref, "data-inset": inset, className: cn("cfui-menubar-item", variant === "destructive" && "cfui-menubar-item--destructive", inset && "cfui-menubar-item--inset", className), ...props })));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;
const MenubarCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (_jsxs(MenubarPrimitive.CheckboxItem, { ref: ref, className: cn("cfui-menubar-checkbox-item", className), checked: checked, ...props, children: [_jsx("span", { className: "cfui-menubar-item-indicator", children: _jsx(MenubarPrimitive.ItemIndicator, { children: _jsx(CheckIcon, { weight: "bold", className: "cfui-menubar-indicator-icon" }) }) }), _jsx(Slottable, { children: children })] })));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;
const MenubarRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (_jsxs(MenubarPrimitive.RadioItem, { ref: ref, className: cn("cfui-menubar-radio-item", className), ...props, children: [_jsx("span", { className: "cfui-menubar-item-indicator", children: _jsx(MenubarPrimitive.ItemIndicator, { children: _jsx(CircleIcon, { weight: "fill", className: "cfui-menubar-indicator-dot" }) }) }), _jsx(Slottable, { children: children })] })));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;
const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => (_jsx(MenubarPrimitive.Label, { ref: ref, "data-inset": inset, className: cn("cfui-menubar-label", inset && "cfui-menubar-label--inset", className), ...props })));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;
const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx(MenubarPrimitive.Separator, { ref: ref, className: cn("cfui-menubar-separator", className), ...props })));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;
const MenubarShortcut = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("span", { ref: ref, className: cn("cfui-menubar-shortcut", className), ...props }));
});
MenubarShortcut.displayName = "MenubarShortcut";
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub, MenubarShortcut, };
//# sourceMappingURL=menubar.js.map