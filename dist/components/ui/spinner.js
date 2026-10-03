import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                       
const spinnerVariants = cva("cfui-spinner", {
    variants: {
        size: {
            xs: "cfui-spinner--xs",
            sm: "cfui-spinner--sm",
            md: "cfui-spinner--md",
            lg: "cfui-spinner--lg",
            xl: "cfui-spinner--xl",
        },
        variant: {
            default: "cfui-spinner--default",
            brand: "cfui-spinner--brand",
            contrast: "cfui-spinner--contrast",
            current: "cfui-spinner--current",
        },
    },
    defaultVariants: {
        size: "md",
        variant: "default",
    },
});
const Spinner = React.forwardRef(({ className, size = "md", variant = "default", label = "Loading", strokeWidth = 3, ...props }, ref) => {
    return (_jsxs("span", { ref: ref, role: "status", "aria-label": label, className: cn(spinnerVariants({ size, variant }), className), ...props, children: [_jsxs("svg", { className: "cfui-spinner-svg", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", children: [_jsx("circle", { className: "cfui-spinner-track", cx: "12", cy: "12", r: "9.5", stroke: "currentColor", strokeWidth: strokeWidth }), _jsx("path", { className: "cfui-spinner-indicator", d: "M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12", stroke: "currentColor", strokeWidth: strokeWidth })] }), label && _jsx("span", { className: "cfui-spinner-sr", children: label })] }));
});
Spinner.displayName = "Spinner";
export { Spinner, spinnerVariants };
//# sourceMappingURL=spinner.js.map