import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                          
const AttachmentContext = React.createContext({
    state: "done",
    size: "default",
    orientation: "horizontal",
    disabled: false,
});
export function useAttachmentContext() {
    return React.useContext(AttachmentContext);
}
function composeRefs(...refs) {
    return (node) => {
        for (const ref of refs) {
            if (!ref)
                continue;
            if (typeof ref === "function") {
                ref(node);
            }
            else if (typeof ref === "object" && "current" in ref) {
                ref.current = node;
            }
        }
    };
}
function mergeElementProps(ours, theirs, forwardedRef) {
    const theirsRef = theirs?.ref ?? theirs?.props?.ref;
    const merged = { ...theirs, ...ours };
    const allKeys = new Set([...Object.keys(ours), ...Object.keys(theirs)]);
    for (const key of allKeys) {
        if (/^on[A-Z]/.test(key)) {
            const ourHandler = ours[key];
            const theirHandler = theirs[key];
            if (typeof ourHandler === "function" && typeof theirHandler === "function") {
                merged[key] = (event) => {
                    theirHandler(event);
                    if (!event?.defaultPrevented) {
                        ourHandler(event);
                    }
                };
            }
            else {
                merged[key] = ourHandler ?? theirHandler;
            }
        }
    }
    merged.className = cn(ours.className, theirs.className);
    if (ours.style || theirs.style) {
        merged.style = { ...theirs.style, ...ours.style };
    }
    if (ours.href !== undefined || theirs.href !== undefined) {
        merged.href = ours.href ?? theirs.href;
    }
    if (ours.type !== undefined || theirs.type !== undefined) {
        merged.type = ours.type ?? theirs.type;
    }
    merged.ref = composeRefs(forwardedRef, theirsRef);
    merged.children = ours.children ?? theirs.children;
    return merged;
}
export const Attachment = React.forwardRef(({ state = "done", size = "default", orientation = "horizontal", disabled = false, asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    const contextValue = React.useMemo(() => ({ state, size, orientation, disabled }), [state, size, orientation, disabled]);
    return (_jsx(AttachmentContext.Provider, { value: contextValue, children: _jsx(Component, { ref: ref, "data-state": state, "data-size": size, "data-orientation": orientation, "data-disabled": disabled ? "true" : undefined, "aria-disabled": disabled ? true : undefined, className: cn("cfui-attachment", `cfui-attachment--${size}`, `cfui-attachment--${orientation}`, `cfui-attachment--${state}`, disabled && "cfui-attachment--disabled", className), ...props, children: children }) }));
});
Attachment.displayName = "Attachment";
export const AttachmentTrigger = React.forwardRef(({ asChild = false, render, href, type = "button", className, children, onClick, onKeyDown, ...props }, ref) => {
    const context = useAttachmentContext();
    // Root disabled cannot be overridden accidentally by false child defaults
    const isDisabled = Boolean(context.disabled || props.disabled);
    const handleClick = (e) => {
        if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onClick?.(e);
    };
    const handleKeyDown = (e) => {
        if (isDisabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onKeyDown?.(e);
    };
    const mergedProps = {
        ref,
        className: cn("cfui-attachment-trigger", isDisabled && "cfui-attachment-trigger--disabled", className),
        "data-state": context.state,
        "data-size": context.size,
        "data-orientation": context.orientation,
        "data-disabled": isDisabled ? "true" : undefined,
        "aria-disabled": isDisabled ? true : undefined,
        tabIndex: isDisabled ? -1 : props.tabIndex,
        href,
        type,
        ...props,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
    };
    if (asChild) {
        return (_jsx(Slot, { ...mergedProps, children: children }));
    }
    if (typeof render === "function") {
        return render(mergedProps, context);
    }
    if (React.isValidElement(render)) {
        const renderProps = (render.props || {});
        const merged = mergeElementProps(mergedProps, renderProps, ref);
        if (isDisabled) {
            merged["aria-disabled"] = true;
            merged["data-disabled"] = "true";
            merged.tabIndex = -1;
        }
        return React.cloneElement(render, merged);
    }
    if (href) {
        return (_jsx("a", { href: href, ...mergedProps, children: children }));
    }
    return (_jsx("button", { type: type, disabled: isDisabled, ...mergedProps, children: children }));
});
AttachmentTrigger.displayName = "AttachmentTrigger";
export const AttachmentMedia = React.forwardRef(({ variant = "icon", src, alt = "", asChild = false, className, children, ...props }, ref) => {
    const context = useAttachmentContext();
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, "data-variant": variant, "data-size": context.size, className: cn("cfui-attachment-media", `cfui-attachment-media--${variant}`, className), ...props, children: children ? (children) : src ? (_jsx("img", { src: src, alt: alt, className: "cfui-attachment-media-image" })) : null }));
});
AttachmentMedia.displayName = "AttachmentMedia";
export const AttachmentContent = React.forwardRef(({ asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, className: cn("cfui-attachment-content", className), ...props, children: children }));
});
AttachmentContent.displayName = "AttachmentContent";
export const AttachmentTitle = React.forwardRef(({ progress, asChild = false, className, children, ...props }, ref) => {
    const context = useAttachmentContext();
    const Component = asChild ? Slot : "h4";
    return (_jsxs("div", { className: "cfui-attachment-title-wrapper", children: [_jsx(Component, { ref: ref, "data-state": context.state, className: cn("cfui-attachment-title", className), ...props, children: children }), (progress !== undefined || context.state === "uploading") && (_jsx("div", { role: "progressbar", "aria-valuenow": progress ?? 0, "aria-valuemin": 0, "aria-valuemax": 100, className: "cfui-attachment-progress-track", children: _jsx("div", { className: "cfui-attachment-progress-bar", style: { width: `${Math.min(Math.max(progress ?? 0, 0), 100)}%` } }) }))] }));
});
AttachmentTitle.displayName = "AttachmentTitle";
export const AttachmentDescription = React.forwardRef(({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot : "p";
    return (_jsx(Component, { ref: ref, className: cn("cfui-attachment-description", className), ...props }));
});
AttachmentDescription.displayName = "AttachmentDescription";
export const AttachmentActions = React.forwardRef(({ asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, className: cn("cfui-attachment-actions", className), ...props, children: children }));
});
AttachmentActions.displayName = "AttachmentActions";
export const AttachmentAction = React.forwardRef(({ variant = "ghost", size = "xs", loading = false, href, asChild = false, className, onClick, children, type = "button", ...props }, ref) => {
    const context = useAttachmentContext();
    const isActionDisabled = Boolean(context.disabled || props.disabled || loading);
    const handleClick = (e) => {
        e.stopPropagation();
        if (isActionDisabled) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };
    if (href) {
        return (_jsx("a", { ref: ref, href: href, "aria-disabled": isActionDisabled ? true : undefined, "data-disabled": isActionDisabled ? "true" : undefined, "data-loading": loading ? "true" : undefined, "aria-busy": loading ? true : undefined, tabIndex: isActionDisabled ? -1 : props.tabIndex, onClick: handleClick, className: cn("cfui-attachment-action", `cfui-attachment-action--${variant}`, `cfui-attachment-action--${size}`, loading && "cfui-attachment-action--loading", isActionDisabled && "cfui-attachment-action--disabled", className), ...props, children: children }));
    }
    const Component = asChild ? Slot : "button";
    return (_jsx(Component, { ref: ref, type: asChild ? undefined : type, disabled: isActionDisabled, "data-disabled": isActionDisabled ? "true" : undefined, "data-loading": loading ? "true" : undefined, "aria-busy": loading ? true : undefined, onClick: handleClick, className: cn("cfui-attachment-action", `cfui-attachment-action--${variant}`, `cfui-attachment-action--${size}`, loading && "cfui-attachment-action--loading", className), ...props, children: children }));
});
AttachmentAction.displayName = "AttachmentAction";
export const AttachmentGroup = React.forwardRef(({ asChild = false, className, role = "region", "aria-label": ariaLabel = "Attachments", tabIndex = 0, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, role: role, "aria-label": ariaLabel, tabIndex: tabIndex, className: cn("cfui-attachment-group", className), ...props }));
});
AttachmentGroup.displayName = "AttachmentGroup";
//# sourceMappingURL=attachment.js.map