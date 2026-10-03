import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                       
const TopNavContext = React.createContext(null);
export function useTopNavContext() {
    return React.useContext(TopNavContext);
}
export const TopNav = React.forwardRef(({ className, brand, items, actions, activeId, onItemSelect, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "header";
    return (_jsx(TopNavContext.Provider, { value: { activeId, onItemSelect }, children: _jsx(Comp, { ref: ref, className: cn("cfui-top-nav", className), ...props, children: children ? (children) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-4 overflow-hidden", children: [brand && _jsx(TopNavBrand, { children: brand }), items && (_jsx(TopNavList, { children: items.map((item, idx) => {
                                    const isActive = Boolean(item.active ?? (item.id ? activeId === item.id : false));
                                    return (_jsx(TopNavItem, { href: item.href, active: isActive, disabled: item.disabled, onClick: (e) => {
                                            item.onClick?.(e);
                                            if (!e.defaultPrevented) {
                                                onItemSelect?.(item, e);
                                            }
                                        }, children: item.label }, item.id ?? idx));
                                }) }))] }), actions && _jsx(TopNavActions, { children: actions })] })) }) }));
});
TopNav.displayName = "TopNav";
export const TopNavBrand = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-top-nav-brand", className), ...props }));
});
TopNavBrand.displayName = "TopNavBrand";
export const TopNavMasthead = TopNavBrand;
export const TopNavList = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "nav";
    return (_jsx(Comp, { ref: ref, "aria-label": "Main Navigation", className: cn("cfui-top-nav-list", className), ...props }));
});
TopNavList.displayName = "TopNavList";
export const TopNavItem = React.forwardRef(({ className, active = false, disabled = false, href, onClick, asChild = false, children, type = "button", ...props }, ref) => {
    const itemClassName = cn("cfui-top-nav-item", active && "cfui-top-nav-item--active", disabled && "cfui-top-nav-item--disabled", className);
    if (asChild) {
        return (_jsx(Slot, { ref: ref, "aria-current": active ? "page" : undefined, "aria-disabled": disabled || undefined, onClick: disabled
                ? (e) => e.preventDefault()
                : onClick, className: itemClassName, ...props, children: children }));
    }
    if (href) {
        return (_jsx("a", { ref: ref, href: disabled ? undefined : href, "aria-current": active ? "page" : undefined, "aria-disabled": disabled || undefined, onClick: disabled
                ? (e) => e.preventDefault()
                : onClick, className: itemClassName, ...props, children: children }));
    }
    return (_jsx("button", { ref: ref, type: type, disabled: disabled, "aria-current": active ? "page" : undefined, onClick: disabled
            ? (e) => e.preventDefault()
            : onClick, className: itemClassName, ...props, children: children }));
});
TopNavItem.displayName = "TopNavItem";
export const TopNavActions = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-top-nav-actions", className), ...props }));
});
TopNavActions.displayName = "TopNavActions";
export const TopNavEnd = TopNavActions;
//# sourceMappingURL=top-nav.js.map