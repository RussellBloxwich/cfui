import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                     
const emptyVariants = cva("cfui-empty", {
    variants: {
        variant: {
            default: "",
            bordered: "cfui-empty--bordered",
            dashed: "cfui-empty--dashed",
            recessed: "cfui-empty--recessed",
        },
        size: {
            sm: "cfui-empty--sm",
            md: "cfui-empty--md",
            lg: "cfui-empty--lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
});
const EmptyRoot = React.forwardRef(({ className, variant, size, asChild = false, icon, title, description, action, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    const hasShorthand = Boolean(icon || title || description || action);
    return (_jsx(Comp, { ref: ref, className: cn(emptyVariants({ variant, size }), className), ...props, children: hasShorthand ? (_jsxs(_Fragment, { children: [icon && _jsx("div", { className: "cfui-empty-icon", children: icon }), title && _jsx("h3", { className: "cfui-empty-title", children: title }), description && (_jsx("p", { className: "cfui-empty-description", children: description })), action && _jsx("div", { className: "cfui-empty-actions", children: action }), children] })) : (children) }));
});
EmptyRoot.displayName = "Empty";
const EmptyHeader = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-empty-header", className), ...props }));
});
EmptyHeader.displayName = "EmptyHeader";
const EmptyMedia = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-empty-media", className), ...props }));
});
EmptyMedia.displayName = "EmptyMedia";
const EmptyIcon = EmptyMedia;
const EmptyTitle = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-empty-title", className), ...props }));
});
EmptyTitle.displayName = "EmptyTitle";
const EmptyDescription = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-empty-description", className), ...props }));
});
EmptyDescription.displayName = "EmptyDescription";
const EmptyContent = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-empty-content", className), ...props }));
});
EmptyContent.displayName = "EmptyContent";
const EmptyActions = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-empty-actions", className), ...props }));
});
EmptyActions.displayName = "EmptyActions";
const EmptyAction = EmptyActions;
export const Empty = Object.assign(EmptyRoot, {
    Header: EmptyHeader,
    Media: EmptyMedia,
    Icon: EmptyIcon,
    Title: EmptyTitle,
    Description: EmptyDescription,
    Content: EmptyContent,
    Actions: EmptyActions,
    Action: EmptyAction,
});
const EmptyState = Empty;
export { EmptyState, EmptyHeader, EmptyMedia, EmptyIcon, EmptyTitle, EmptyDescription, EmptyContent, EmptyActions, EmptyAction, emptyVariants, };
//# sourceMappingURL=empty.js.map