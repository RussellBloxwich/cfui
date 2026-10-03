import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../utils.js";
                        
const Textarea = React.forwardRef(({ className, error, sizeVariant = "default", ...props }, ref) => {
    return (_jsx("textarea", { ref: ref, "data-invalid": error ? "true" : undefined, "aria-invalid": error ? true : props["aria-invalid"], className: cn("cfui-textarea", sizeVariant !== "default" && `cfui-textarea--${sizeVariant}`, error && "cfui-textarea--error", className), ...props }));
});
Textarea.displayName = "Textarea";
export { Textarea };
//# sourceMappingURL=textarea.js.map