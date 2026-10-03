import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                        
const progressVariants = cva("cfui-progress", {
    variants: {
        variant: {
            default: "cfui-progress--default",
            brand: "cfui-progress--brand",
            success: "cfui-progress--success",
            warning: "cfui-progress--warning",
            danger: "cfui-progress--danger",
        },
        size: {
            sm: "cfui-progress--sm",
            md: "cfui-progress--md",
            lg: "cfui-progress--lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
});
const ProgressRoot = React.forwardRef(({ className, value, max = 100, variant, size, indicatorClassName, ...props }, ref) => {
    const isIndeterminate = value === undefined || value === null;
    const percentage = isIndeterminate
        ? undefined
        : Math.min(Math.max((value / max) * 100, 0), 100);
    return (_jsx(ProgressPrimitive.Root, { ref: ref, value: value, max: max, className: cn(progressVariants({ variant, size }), isIndeterminate && "cfui-progress--indeterminate", className), ...props, children: _jsx(ProgressPrimitive.Indicator, { className: cn("cfui-progress-indicator", indicatorClassName), style: percentage !== undefined
                ? { transform: `translateX(-${100 - percentage}%)` }
                : undefined }) }));
});
ProgressRoot.displayName = ProgressPrimitive.Root.displayName;
const ProgressTrack = ProgressPrimitive.Root;
const ProgressIndicator = ProgressPrimitive.Indicator;
export const Progress = Object.assign(ProgressRoot, {
    Track: ProgressTrack,
    Indicator: ProgressIndicator,
});
export { ProgressTrack, ProgressIndicator, progressVariants };
//# sourceMappingURL=progress.js.map