import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                    
const itemVariants = cva("cfui-item", {
    variants: {
        variant: {
            default: "",
            danger: "cfui-item--danger",
        },
        size: {
            sm: "cfui-item--sm",
            md: "cfui-item--md",
            lg: "cfui-item--lg",
        },
        interactive: {
            true: "cfui-item--interactive",
            false: "",
        },
        selected: {
            true: "cfui-item--selected",
            false: "",
        },
        disabled: {
            true: "cfui-item--disabled",
            false: "",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
        interactive: true,
        selected: false,
        disabled: false,
    },
});
const ItemRoot = React.forwardRef(({ className, variant, size, interactive = true, selected = false, disabled = false, asChild = false, leading, title, description, trailing, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    const hasShorthand = Boolean(leading || title || description || trailing);
    return (_jsx(Comp, { ref: ref, "aria-selected": selected || undefined, "aria-disabled": disabled || undefined, className: cn(itemVariants({
            variant,
            size,
            interactive,
            selected,
            disabled,
        }), className), ...props, children: hasShorthand ? (_jsxs(_Fragment, { children: [leading && _jsx("div", { className: "cfui-item-leading", children: leading }), (title || description) && (_jsxs("div", { className: "cfui-item-content", children: [title && _jsx("div", { className: "cfui-item-title", children: title }), description && (_jsx("div", { className: "cfui-item-description", children: description }))] })), children, trailing && _jsx("div", { className: "cfui-item-trailing", children: trailing })] })) : (children) }));
});
ItemRoot.displayName = "Item";
const ItemGroup = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, role: "group", className: cn("cfui-item-group", className), ...props }));
});
ItemGroup.displayName = "ItemGroup";
const ItemSeparator = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, role: "separator", className: cn("cfui-item-separator", className), ...props }));
});
ItemSeparator.displayName = "ItemSeparator";
const ItemHeader = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-header", className), ...props }));
});
ItemHeader.displayName = "ItemHeader";
const ItemFooter = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-footer", className), ...props }));
});
ItemFooter.displayName = "ItemFooter";
const ItemMedia = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-media", className), ...props }));
});
ItemMedia.displayName = "ItemMedia";
const ItemLeading = ItemMedia;
const ItemContent = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-content", className), ...props }));
});
ItemContent.displayName = "ItemContent";
const ItemTitle = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-title", className), ...props }));
});
ItemTitle.displayName = "ItemTitle";
const ItemDescription = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-description", className), ...props }));
});
ItemDescription.displayName = "ItemDescription";
const ItemTrailing = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-trailing", className), ...props }));
});
ItemTrailing.displayName = "ItemTrailing";
const ItemAction = ItemTrailing;
const ItemActions = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-item-actions", className), ...props }));
});
ItemActions.displayName = "ItemActions";
export const Item = Object.assign(ItemRoot, {
    Group: ItemGroup,
    Separator: ItemSeparator,
    Header: ItemHeader,
    Footer: ItemFooter,
    Media: ItemMedia,
    Leading: ItemLeading,
    Content: ItemContent,
    Title: ItemTitle,
    Description: ItemDescription,
    Trailing: ItemTrailing,
    Actions: ItemActions,
    Action: ItemAction,
});
export { ItemGroup, ItemSeparator, ItemHeader, ItemFooter, ItemMedia, ItemLeading, ItemContent, ItemTitle, ItemDescription, ItemTrailing, ItemActions, ItemAction, itemVariants, };
//# sourceMappingURL=item.js.map