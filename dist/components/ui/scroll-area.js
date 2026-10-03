import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../../utils.js";
                           
const ScrollArea = React.forwardRef(({ className, children, orientation = "vertical", ...props }, ref) => (_jsxs(ScrollAreaPrimitive.Root, { ref: ref, className: cn("cfui-scroll-area", className), ...props, children: [_jsx(ScrollAreaPrimitive.Viewport, { className: "cfui-scroll-area-viewport", children: children }), (orientation === "vertical" || orientation === "both") && (_jsx(ScrollBar, { orientation: "vertical" })), (orientation === "horizontal" || orientation === "both") && (_jsx(ScrollBar, { orientation: "horizontal" })), _jsx(ScrollAreaPrimitive.Corner, { className: "cfui-scroll-area-corner" })] })));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (_jsx(ScrollAreaPrimitive.Scrollbar, { ref: ref, orientation: orientation, className: cn("cfui-scroll-area-scrollbar", orientation === "vertical"
        ? "cfui-scroll-area-scrollbar-vertical"
        : "cfui-scroll-area-scrollbar-horizontal", className), ...props, children: _jsx(ScrollAreaPrimitive.Thumb, { className: "cfui-scroll-area-thumb" }) })));
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;
export { ScrollArea, ScrollBar };
//# sourceMappingURL=scroll-area.js.map