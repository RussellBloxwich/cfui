import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "../../utils.js";
                         
const ResizablePanelGroup = React.forwardRef(({ className, orientation, direction, ...props }, ref) => {
    const resolvedOrientation = orientation ?? direction ?? "horizontal";
    return (_jsx(Group, { elementRef: ref, orientation: resolvedOrientation, className: cn("cfui-resizable-group", resolvedOrientation === "vertical" && "cfui-resizable-group-vertical", className), ...props }));
});
ResizablePanelGroup.displayName = "ResizablePanelGroup";
const ResizablePanel = Panel;
const ResizableHandle = React.forwardRef(({ withHandle, className, ...props }, ref) => (_jsx(Separator, { elementRef: ref, className: cn("cfui-resizable-handle", className), ...props, children: withHandle && (_jsx("div", { className: "cfui-resizable-handle-icon-container", children: _jsxs("svg", { className: "cfui-resizable-handle-icon", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { cx: "5", cy: "4", r: "1.5" }), _jsx("circle", { cx: "5", cy: "8", r: "1.5" }), _jsx("circle", { cx: "5", cy: "12", r: "1.5" }), _jsx("circle", { cx: "11", cy: "4", r: "1.5" }), _jsx("circle", { cx: "11", cy: "8", r: "1.5" }), _jsx("circle", { cx: "11", cy: "12", r: "1.5" })] }) })) })));
ResizableHandle.displayName = "ResizableHandle";
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
//# sourceMappingURL=resizable.js.map