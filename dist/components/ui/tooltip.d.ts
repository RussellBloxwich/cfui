import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
                       
declare const TooltipProvider: React.FC<TooltipPrimitive.TooltipProviderProps>;
declare const Tooltip: React.FC<TooltipPrimitive.TooltipProps>;
declare const TooltipTrigger: React.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const TooltipArrow: React.ForwardRefExoticComponent<TooltipPrimitive.TooltipArrowProps & React.RefAttributes<SVGSVGElement>>;
interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
    showArrow?: boolean;
}
declare const TooltipContent: React.ForwardRefExoticComponent<TooltipContentProps & React.RefAttributes<HTMLDivElement>>;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow, };
//# sourceMappingURL=tooltip.d.ts.map