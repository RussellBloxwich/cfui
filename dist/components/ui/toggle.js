import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                      
const toggleVariants = cva("cfui-toggle", {
    variants: {
        variant: {
            default: "cfui-toggle--default",
            outline: "cfui-toggle--outline",
        },
        size: {
            default: "cfui-toggle--size-default",
            sm: "cfui-toggle--size-sm",
            lg: "cfui-toggle--size-lg",
            sidebar: "cfui-toggle--size-sidebar",
            tiny: "cfui-toggle--size-tiny",
            xs: "cfui-toggle--size-tiny",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (_jsx(TogglePrimitive.Root, { ref: ref, className: cn(toggleVariants({ variant, size, className })), ...props })));
Toggle.displayName = TogglePrimitive.Root.displayName;
export { Toggle, toggleVariants };
//# sourceMappingURL=toggle.js.map