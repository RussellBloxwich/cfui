import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                     
const alertVariants = cva("cfui-alert", {
    variants: {
        variant: {
            default: "cfui-alert--default",
            info: "cfui-alert--info",
            destructive: "cfui-alert--destructive",
            danger: "cfui-alert--danger",
            warning: "cfui-alert--warning",
            success: "cfui-alert--success",
            neutral: "cfui-alert--neutral",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const AlertRoot = React.forwardRef(({ className, variant, asChild = false, icon, action, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsxs(Comp, { ref: ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props, children: [icon && _jsx("div", { className: "cfui-alert-icon", children: icon }), _jsx("div", { className: "cfui-alert-body", children: children }), action && _jsx("div", { className: "cfui-alert-action", children: action })] }));
});
AlertRoot.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h5";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-alert-title", className), ...props }));
});
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-alert-description", className), ...props }));
});
AlertDescription.displayName = "AlertDescription";
const AlertIcon = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-alert-icon", className), ...props }));
});
AlertIcon.displayName = "AlertIcon";
const AlertAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-alert-action", className), ...props }));
});
AlertAction.displayName = "AlertAction";
export const Alert = Object.assign(AlertRoot, {
    Title: AlertTitle,
    Description: AlertDescription,
    Icon: AlertIcon,
    Action: AlertAction,
});
export { AlertTitle, AlertDescription, AlertIcon, AlertAction, alertVariants, };
//# sourceMappingURL=alert.js.map