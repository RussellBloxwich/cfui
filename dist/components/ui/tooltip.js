import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils.js";
                       
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipArrow = TooltipPrimitive.Arrow;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, showArrow = false, children, ...props }, ref) => (_jsx(TooltipPrimitive.Portal, { children: _jsxs(TooltipPrimitive.Content, { ref: ref, sideOffset: sideOffset, className: cn("cfui-tooltip-content", className), ...props, children: [children, showArrow && _jsx(TooltipPrimitive.Arrow, { className: "cfui-tooltip-arrow" })] }) })));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow, };
//# sourceMappingURL=tooltip.js.map