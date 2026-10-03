import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "../../utils.js";
                          
const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (_jsx(HoverCardPrimitive.Portal, { children: _jsx(HoverCardPrimitive.Content, { ref: ref, align: align, sideOffset: sideOffset, className: cn("cfui-hover-card-content", className), ...props }) })));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;
export { HoverCard, HoverCardTrigger, HoverCardContent };
//# sourceMappingURL=hover-card.js.map