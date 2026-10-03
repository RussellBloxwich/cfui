import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                     
const badgeVariants = cva("cfui-badge", {
    variants: {
        variant: {
            default: "cfui-badge--default",
            secondary: "cfui-badge--secondary",
            destructive: "cfui-badge--destructive",
            outline: "cfui-badge--outline",
            success: "cfui-badge--success",
            warning: "cfui-badge--warning",
            info: "cfui-badge--info",
            neutral: "cfui-badge--neutral",
            orange: "cfui-badge--orange",
            teal: "cfui-badge--teal",
            purple: "cfui-badge--purple",
            blue: "cfui-badge--blue",
        },
        size: {
            default: "cfui-badge--size-default",
            sm: "cfui-badge--size-sm",
            lg: "cfui-badge--size-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
const Badge = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn(badgeVariants({ variant, size }), className), ...props }));
});
Badge.displayName = "Badge";
export { Badge, badgeVariants };
//# sourceMappingURL=badge.js.map