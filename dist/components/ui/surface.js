import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                       
export const Surface = React.forwardRef(({ className, elevation = "base", bordered = true, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-surface", bordered && "cfui-surface--bordered", `cfui-surface--${elevation}`, className), ...props }));
});
Surface.displayName = "Surface";
export const SurfaceHeader = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-surface-header", className), ...props }));
});
SurfaceHeader.displayName = "SurfaceHeader";
export const SurfaceTitle = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-surface-title", className), ...props }));
});
SurfaceTitle.displayName = "SurfaceTitle";
export const SurfaceDescription = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-surface-description", className), ...props }));
});
SurfaceDescription.displayName = "SurfaceDescription";
export const SurfaceContent = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-surface-content", className), ...props }));
});
SurfaceContent.displayName = "SurfaceContent";
export const SurfaceBody = SurfaceContent;
export const SurfaceFooter = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-surface-footer", className), ...props }));
});
SurfaceFooter.displayName = "SurfaceFooter";
/* LayerCard Aliases */
export const LayerCard = Surface;
export const LayerCardHeader = SurfaceHeader;
export const LayerCardTitle = SurfaceTitle;
export const LayerCardDescription = SurfaceDescription;
export const LayerCardContent = SurfaceContent;
export const LayerCardBody = SurfaceBody;
export const LayerCardFooter = SurfaceFooter;
//# sourceMappingURL=surface.js.map