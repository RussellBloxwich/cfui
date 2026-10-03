import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../utils.js";
                      
const DrawerContext = React.createContext({
    direction: "bottom",
});
const Drawer = ({ direction = "bottom", children, ...props }) => (_jsx(DrawerContext.Provider, { value: { direction }, children: _jsx(DialogPrimitive.Root, { ...props, children: children }) }));
Drawer.displayName = "Drawer";
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerPortal = DialogPrimitive.Portal;
const DrawerClose = DialogPrimitive.Close;
const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (_jsx(DialogPrimitive.Overlay, { ref: ref, className: cn("cfui-drawer-overlay", className), ...props })));
DrawerOverlay.displayName = "DrawerOverlay";
const DrawerContent = React.forwardRef(({ className, children, direction: contentDirection, showHandle = true, ...props }, ref) => {
    const { direction: rootDirection } = React.useContext(DrawerContext);
    const direction = contentDirection ?? rootDirection;
    return (_jsxs(DrawerPortal, { children: [_jsx(DrawerOverlay, {}), _jsxs(DialogPrimitive.Content, { ref: ref, className: cn("cfui-drawer-content", `cfui-drawer-content-${direction}`, className), ...props, children: [showHandle && direction === "bottom" && (_jsx("div", { className: "cfui-drawer-handle", "aria-hidden": "true" })), children] })] }));
});
DrawerContent.displayName = "DrawerContent";
const DrawerHeader = ({ className, ...props }) => (_jsx("div", { className: cn("cfui-drawer-header", className), ...props }));
DrawerHeader.displayName = "DrawerHeader";
const DrawerFooter = ({ className, ...props }) => (_jsx("div", { className: cn("cfui-drawer-footer", className), ...props }));
DrawerFooter.displayName = "DrawerFooter";
const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx(DialogPrimitive.Title, { ref: ref, className: cn("cfui-drawer-title", className), ...props })));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;
const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx(DialogPrimitive.Description, { ref: ref, className: cn("cfui-drawer-description", className), ...props })));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, };
//# sourceMappingURL=drawer.js.map