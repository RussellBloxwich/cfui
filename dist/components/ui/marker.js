import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                      
export const markerVariants = cva("cfui-marker", {
    variants: {
        variant: {
            default: "cfui-marker--default",
            border: "cfui-marker--border",
            separator: "cfui-marker--separator",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
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
export const Marker = React.forwardRef(({ variant = "default", asChild = false, render, href, type, role, className, children, ...props }, ref) => {
    // Native role is caller-owned; labeled separators keep meaningful text exposed rather than assigning role=separator.
    const resolvedRole = role;
    const mergedProps = {
        ref,
        role: resolvedRole,
        "data-variant": variant,
        className: cn(markerVariants({ variant }), className),
        href,
        type,
        ...props,
    };
    if (asChild) {
        return _jsx(Slot, { ...mergedProps, children: children });
    }
    if (typeof render === "function") {
        return render(mergedProps, { variant });
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
Marker.displayName = "Marker";
export const MarkerIcon = React.forwardRef(({ asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "span";
    return (_jsx(Component, { ref: ref, "aria-hidden": "true", className: cn("cfui-marker-icon", className), ...props, children: children }));
});
MarkerIcon.displayName = "MarkerIcon";
export const MarkerContent = React.forwardRef(({ asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "span";
    return (_jsx(Component, { ref: ref, className: cn("cfui-marker-content", className), ...props, children: children }));
});
MarkerContent.displayName = "MarkerContent";
//# sourceMappingURL=marker.js.map