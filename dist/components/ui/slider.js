import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../utils.js";
                      
const Slider = React.forwardRef(({ className, value, defaultValue, min = 0, ...props }, ref) => {
    const values = value ?? defaultValue ?? [min];
    const thumbCount = Array.isArray(values) ? Math.max(1, values.length) : 1;
    return (_jsxs(SliderPrimitive.Root, { ref: ref, className: cn("cfui-slider", className), value: value, defaultValue: defaultValue, min: min, ...props, children: [_jsx(SliderPrimitive.Track, { className: "cfui-slider-track", children: _jsx(SliderPrimitive.Range, { className: "cfui-slider-range" }) }), Array.from({ length: thumbCount }).map((_, i) => (_jsx(SliderPrimitive.Thumb, { className: "cfui-slider-thumb" }, i)))] }));
});
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };
//# sourceMappingURL=slider.js.map