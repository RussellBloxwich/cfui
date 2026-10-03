import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                      
const BubbleContext = React.createContext({
    variant: "default",
    align: "start",
});
export function useBubbleContext() {
    return React.useContext(BubbleContext);
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
export const Bubble = React.forwardRef(({ variant = "default", align = "start", asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    const contextValue = React.useMemo(() => ({ variant, align }), [variant, align]);
    return (_jsx(BubbleContext.Provider, { value: contextValue, children: _jsx(Component, { ref: ref, "data-variant": variant, "data-align": align, className: cn("cfui-bubble", `cfui-bubble--${variant}`, `cfui-bubble--${align}`, className), ...props, children: children }) }));
});
Bubble.displayName = "Bubble";
export const BubbleContent = React.forwardRef(({ variant: explicitVariant, align: explicitAlign, asChild = false, render, href, type, className, children, ...props }, ref) => {
    const context = useBubbleContext();
    const variant = explicitVariant ?? context.variant;
    const align = explicitAlign ?? context.align;
    const mergedProps = {
        ref,
        "data-variant": variant,
        "data-align": align,
        href,
        type,
        className: cn("cfui-bubble-content", `cfui-bubble-content--${variant}`, `cfui-bubble-content--${align}`, variant === "ghost"
            ? "cfui-bubble-content--full-width"
            : "cfui-bubble-content--fit-content", className),
        ...props,
    };
    if (asChild) {
        return _jsx(Slot, { ...mergedProps, children: children });
    }
    if (typeof render === "function") {
        return render(mergedProps, { variant, align });
    }
    if (React.isValidElement(render)) {
        const renderProps = (render.props || {});
        const merged = mergeElementProps(mergedProps, renderProps, ref);
        return React.cloneElement(render, merged);
    }
    if (href) {
        return (_jsx("a", { href: href, ...mergedProps, children: children }));
    }
    if (type) {
        return (_jsx("button", { type: type, ...mergedProps, children: children }));
    }
    return (_jsx("div", { ...mergedProps, children: children }));
});
BubbleContent.displayName = "BubbleContent";
export const BubbleReactions = React.forwardRef(({ side = "bottom", align, asChild = false, className, children, ...props }, ref) => {
    const context = useBubbleContext();
    const resolvedAlign = align ?? context.align;
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, "data-side": side, "data-align": resolvedAlign, className: cn("cfui-bubble-reactions", `cfui-bubble-reactions--${side}`, `cfui-bubble-reactions--${resolvedAlign}`, className), ...props, children: children }));
});
BubbleReactions.displayName = "BubbleReactions";
export const BubbleGroup = React.forwardRef(({ align = "start", asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, "data-align": align, className: cn("cfui-bubble-group", `cfui-bubble-group--${align}`, className), ...props, children: children }));
});
BubbleGroup.displayName = "BubbleGroup";
//# sourceMappingURL=bubble.js.map