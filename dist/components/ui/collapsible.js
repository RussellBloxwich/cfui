import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "../../utils.js";
                           
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = React.forwardRef(({ className, ...props }, ref) => (_jsx(CollapsiblePrimitive.CollapsibleTrigger, { ref: ref, className: cn("cfui-collapsible-trigger", className), ...props })));
CollapsibleTrigger.displayName =
    CollapsiblePrimitive.CollapsibleTrigger.displayName;
const CollapsibleContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(CollapsiblePrimitive.CollapsibleContent, { ref: ref, className: cn("cfui-collapsible-content", className), ...props })));
CollapsibleContent.displayName =
    CollapsiblePrimitive.CollapsibleContent.displayName;
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
//# sourceMappingURL=collapsible.js.map