import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                        
const skeletonVariants = cva("cfui-skeleton", {
    variants: {
        variant: {
            default: "",
            circle: "cfui-skeleton--circle",
            text: "cfui-skeleton--text",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const SkeletonRoot = React.forwardRef(({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, "aria-hidden": "true", className: cn(skeletonVariants({ variant }), className), ...props }));
});
SkeletonRoot.displayName = "Skeleton";
const SkeletonCircle = React.forwardRef((props, ref) => _jsx(SkeletonRoot, { ref: ref, variant: "circle", ...props }));
SkeletonCircle.displayName = "SkeletonCircle";
const SkeletonText = React.forwardRef((props, ref) => _jsx(SkeletonRoot, { ref: ref, variant: "text", ...props }));
SkeletonText.displayName = "SkeletonText";
export const Skeleton = Object.assign(SkeletonRoot, {
    Circle: SkeletonCircle,
    Text: SkeletonText,
});
export { SkeletonCircle, SkeletonText, skeletonVariants };
//# sourceMappingURL=skeleton.js.map