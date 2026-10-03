import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                     
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToastPrimitives.Viewport, { ref: ref, className: cn("cfui-toast-viewport", className), ...props })));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva("cfui-toast", {
    variants: {
        variant: {
            default: "cfui-toast-default",
            destructive: "cfui-toast-destructive",
            success: "cfui-toast-success",
            warning: "cfui-toast-warning",
            info: "cfui-toast-info",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
    return (_jsx(ToastPrimitives.Root, { ref: ref, className: cn(toastVariants({ variant }), className), ...props }));
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToastPrimitives.Action, { ref: ref, className: cn("cfui-toast-action", className), ...props })));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (_jsxs(ToastPrimitives.Close, { ref: ref, className: cn("cfui-toast-close", className), "toast-close": "", "aria-label": "Close notification", ...props, children: [_jsx("svg", { className: "cfui-toast-icon", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: _jsx("path", { d: "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" }) }), _jsx("span", { className: "cfui-toast-sr-only", children: "Close" })] })));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToastPrimitives.Title, { ref: ref, className: cn("cfui-toast-title", className), ...props })));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx(ToastPrimitives.Description, { ref: ref, className: cn("cfui-toast-description", className), ...props })));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction, toastVariants, };
//# sourceMappingURL=toast.js.map