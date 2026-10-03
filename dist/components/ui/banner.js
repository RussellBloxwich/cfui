import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { InfoIcon, WarningIcon, WarningCircleIcon, CheckCircleIcon, XIcon, } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                      
const variantIcons = {
    info: InfoIcon,
    warning: WarningIcon,
    danger: WarningCircleIcon,
    success: CheckCircleIcon,
};
const BannerContext = React.createContext({
    variant: "info",
});
export const Banner = React.forwardRef(({ className, variant = "info", open: controlledOpen, defaultOpen = true, onOpenChange, onDismiss, dismissible, asChild = false, children, ...props }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const handleDismiss = React.useCallback(() => {
        if (controlledOpen === undefined) {
            setUncontrolledOpen(false);
        }
        onOpenChange?.(false);
        onDismiss?.();
    }, [controlledOpen, onOpenChange, onDismiss]);
    if (!isOpen) {
        return null;
    }
    const Comp = asChild ? Slot : "div";
    return (_jsx(BannerContext.Provider, { value: { variant, onDismiss: handleDismiss }, children: _jsxs(Comp, { ref: ref, role: variant === "danger" || variant === "warning" ? "alert" : "status", "aria-live": "polite", className: cn("cfui-banner", `cfui-banner--${variant}`, className), ...props, children: [children, (dismissible || onDismiss) &&
                    !React.Children.toArray(children).some((child) => React.isValidElement(child) &&
                        (child.type === BannerDismiss || child.type === BannerClose)) && _jsx(BannerDismiss, {})] }) }));
});
Banner.displayName = "Banner";
export const BannerIcon = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
    const { variant } = React.useContext(BannerContext);
    const Comp = asChild ? Slot : "span";
    const DefaultIcon = variantIcons[variant];
    return (_jsx(Comp, { ref: ref, className: cn("cfui-banner-icon", `cfui-banner-icon--${variant}`, className), ...props, children: children ?? _jsx(DefaultIcon, { size: 18, weight: "fill" }) }));
});
BannerIcon.displayName = "BannerIcon";
export const BannerTitle = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h5";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-banner-title", className), ...props }));
});
BannerTitle.displayName = "BannerTitle";
export const BannerDescription = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-banner-description", className), ...props }));
});
BannerDescription.displayName = "BannerDescription";
export const BannerAction = React.forwardRef(({ className, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (_jsx(Comp, { ref: ref, type: type, className: cn("cfui-banner-action", className), ...props }));
});
BannerAction.displayName = "BannerAction";
export const BannerDismiss = React.forwardRef(({ className, asChild = false, type = "button", onClick, children, ...props }, ref) => {
    const { onDismiss } = React.useContext(BannerContext);
    const Comp = asChild ? Slot : "button";
    const handleClick = (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
            onDismiss?.();
        }
    };
    return (_jsx(Comp, { ref: ref, type: type, "aria-label": "Dismiss banner", onClick: handleClick, className: cn("cfui-banner-dismiss", className), ...props, children: children ?? _jsx(XIcon, { size: 14, weight: "bold" }) }));
});
BannerDismiss.displayName = "BannerDismiss";
export const BannerClose = BannerDismiss;
//# sourceMappingURL=banner.js.map