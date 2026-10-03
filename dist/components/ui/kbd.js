import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                   
const kbdVariants = cva("cfui-kbd", {
    variants: {
        variant: {
            default: "",
            outline: "cfui-kbd--outline",
            solid: "cfui-kbd--solid",
        },
        size: {
            xs: "cfui-kbd--xs",
            sm: "cfui-kbd--sm",
            md: "cfui-kbd--md",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "sm",
    },
});
const KbdRoot = React.forwardRef(({ className, variant, size, asChild = false, keys, children, ...props }, ref) => {
    if (keys && keys.length > 0) {
        return (_jsx("span", { className: "cfui-kbd-group", children: keys.map((k, index) => (_jsxs(React.Fragment, { children: [index > 0 && _jsx("span", { className: "cfui-kbd-separator", children: "+" }), _jsx("kbd", { className: cn(kbdVariants({ variant, size }), className), ...props, children: k })] }, index))) }));
    }
    const Comp = asChild ? Slot : "kbd";
    return (_jsx(Comp, { ref: ref, className: cn(kbdVariants({ variant, size }), className), ...props, children: children }));
});
KbdRoot.displayName = "Kbd";
const KbdGroup = React.forwardRef(({ className, asChild = false, separator = "+", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    const childArray = React.Children.toArray(children);
    return (_jsx(Comp, { ref: ref, className: cn("cfui-kbd-group", className), ...props, children: childArray.map((child, index) => (_jsxs(React.Fragment, { children: [index > 0 && separator && (_jsx("span", { className: "cfui-kbd-separator", children: separator })), child] }, index))) }));
});
KbdGroup.displayName = "KbdGroup";
export const Kbd = Object.assign(KbdRoot, {
    Group: KbdGroup,
});
export { KbdGroup, kbdVariants };
//# sourceMappingURL=kbd.js.map