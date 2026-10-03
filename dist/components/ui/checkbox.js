import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                        
const Checkbox = React.forwardRef(({ className, indeterminate, checked, ...props }, ref) => {
    const resolvedChecked = indeterminate ? "indeterminate" : checked;
    return (_jsx(CheckboxPrimitive.Root, { ref: ref, checked: resolvedChecked, className: cn("cfui-checkbox", className), ...props, children: _jsxs(CheckboxPrimitive.Indicator, { className: "cfui-checkbox-indicator", children: [_jsx(CheckIcon, { className: "cfui-checkbox-check", weight: "bold" }), _jsx(MinusIcon, { className: "cfui-checkbox-minus", weight: "bold" })] }) }));
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const CheckboxIndicator = CheckboxPrimitive.Indicator;
export { Checkbox, CheckboxIndicator };
//# sourceMappingURL=checkbox.js.map