import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../utils.js";
                           
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx(RadioGroupPrimitive.Root, { className: cn("cfui-radio-group", className), ...props, ref: ref }));
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, children, ...props }, ref) => {
    return (_jsxs(RadioGroupPrimitive.Item, { ref: ref, className: cn("cfui-radio-group-item", className), ...props, children: [_jsx(RadioGroupPrimitive.Indicator, { className: "cfui-radio-group-indicator", children: _jsx("span", { className: "cfui-radio-group-dot" }) }), children] }));
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
const RadioGroupIndicator = RadioGroupPrimitive.Indicator;
export { RadioGroup, RadioGroupItem, RadioGroupIndicator };
//# sourceMappingURL=radio-group.js.map