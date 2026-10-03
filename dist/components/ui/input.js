import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../utils.js";
                     
const Input = React.forwardRef(({ className, type = "text", error, sizeVariant = "default", ...props }, ref) => {
    return (_jsx("input", { type: type, ref: ref, "data-invalid": error ? "true" : undefined, "aria-invalid": error ? true : props["aria-invalid"], className: cn("cfui-input", sizeVariant !== "default" && `cfui-input--${sizeVariant}`, error && "cfui-input--error", className), ...props }));
});
Input.displayName = "Input";
export { Input };
//# sourceMappingURL=input.js.map