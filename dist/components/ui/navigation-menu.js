import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Slottable } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                               
const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { className: "cfui-navigation-menu-viewport-wrapper", children: _jsx(NavigationMenuPrimitive.Viewport, { className: cn("cfui-navigation-menu-viewport", className), ref: ref, ...props }) })));
NavigationMenuViewport.displayName =
    NavigationMenuPrimitive.Viewport.displayName;
const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => (_jsx(NavigationMenuPrimitive.Root, { ref: ref, className: cn("cfui-navigation-menu", className), ...props, children: props.asChild ? (children) : (_jsxs(_Fragment, { children: [children, _jsx(NavigationMenuViewport, {})] })) })));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (_jsx(NavigationMenuPrimitive.List, { ref: ref, className: cn("cfui-navigation-menu-list", className), ...props })));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const navigationMenuTriggerStyle = cva("cfui-navigation-menu-trigger");
const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => (_jsxs(NavigationMenuPrimitive.Trigger, { ref: ref, className: cn(navigationMenuTriggerStyle(), className), ...props, children: [_jsx(Slottable, { children: children }), _jsx(CaretDownIcon, { className: "cfui-navigation-menu-trigger-icon", "aria-hidden": "true" })] })));
NavigationMenuTrigger.displayName =
    NavigationMenuPrimitive.Trigger.displayName;
const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(NavigationMenuPrimitive.Content, { ref: ref, className: cn("cfui-navigation-menu-content", className), ...props })));
NavigationMenuContent.displayName =
    NavigationMenuPrimitive.Content.displayName;
const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuIndicator = React.forwardRef(({ className, children, ...props }, ref) => (_jsxs(NavigationMenuPrimitive.Indicator, { ref: ref, className: cn("cfui-navigation-menu-indicator", className), ...props, children: [_jsx(Slottable, { children: children }), _jsx("div", { className: "cfui-navigation-menu-indicator-arrow" })] })));
NavigationMenuIndicator.displayName =
    NavigationMenuPrimitive.Indicator.displayName;
export { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, };
//# sourceMappingURL=navigation-menu.js.map