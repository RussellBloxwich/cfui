import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                     
const labelVariants = cva("cfui-label", {
    variants: {
        size: {
            default: "",
            sm: "cfui-label--sm",
            lg: "cfui-label--lg",
        },
    },
    defaultVariants: {
        size: "default",
    },
});
const Label = React.forwardRef(({ className, size, required, disabled, children, ...props }, ref) => (_jsxs(LabelPrimitive.Root, { ref: ref, className: cn(labelVariants({ size }), disabled && "cfui-label--disabled", className), ...props, children: [children, required && (_jsx("span", { className: "cfui-label-asterisk", "aria-hidden": "true", children: "*" }))] })));
Label.displayName = LabelPrimitive.Root.displayName;
export { Label, labelVariants };
//# sourceMappingURL=label.js.map