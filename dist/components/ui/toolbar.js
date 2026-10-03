import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { cn } from "../../utils.js";
                       
const Toolbar = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToolbarPrimitive.Root, { ref: ref, className: cn("cfui-toolbar", className), ...props })));
Toolbar.displayName = ToolbarPrimitive.Root.displayName;
const ToolbarButton = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToolbarPrimitive.Button, { ref: ref, className: cn("cfui-toolbar-button", className), ...props })));
ToolbarButton.displayName = ToolbarPrimitive.Button.displayName;
const ToolbarSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToolbarPrimitive.Separator, { ref: ref, className: cn("cfui-toolbar-separator", className), ...props })));
ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;
const ToolbarLink = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToolbarPrimitive.Link, { ref: ref, className: cn("cfui-toolbar-link", className), ...props })));
ToolbarLink.displayName = ToolbarPrimitive.Link.displayName;
const ToolbarToggleGroup = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToolbarPrimitive.ToggleGroup, { ref: ref, className: cn("cfui-toolbar-toggle-group", className), ...props })));
ToolbarToggleGroup.displayName = ToolbarPrimitive.ToggleGroup.displayName;
const ToolbarToggleItem = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToolbarPrimitive.ToggleItem, { ref: ref, className: cn("cfui-toolbar-toggle-item", className), ...props })));
ToolbarToggleItem.displayName = ToolbarPrimitive.ToggleItem.displayName;
export { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarLink, ToolbarToggleGroup, ToolbarToggleItem, };
//# sourceMappingURL=toolbar.js.map