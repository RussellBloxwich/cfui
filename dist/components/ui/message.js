import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                       
const MessageContext = React.createContext({
    align: "start",
});
export function useMessageContext() {
    return React.useContext(MessageContext);
}
export const Message = React.forwardRef(({ align = "start", asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    const contextValue = React.useMemo(() => ({ align }), [align]);
    return (_jsx(MessageContext.Provider, { value: contextValue, children: _jsx(Component, { ref: ref, "data-align": align, className: cn("cfui-message", `cfui-message--${align}`, className), ...props, children: children }) }));
});
Message.displayName = "Message";
export const MessageAvatar = React.forwardRef(({ src, alt = "", fallback, asChild = false, className, children, ...props }, ref) => {
    const context = useMessageContext();
    const Component = asChild ? Slot : "div";
    const [hasError, setHasError] = React.useState(false);
    return (_jsx(Component, { ref: ref, "data-align": context.align, className: cn("cfui-message-avatar", `cfui-message-avatar--${context.align}`, className), ...props, children: children ? (children) : src && !hasError ? (_jsx("img", { src: src, alt: alt, onError: () => setHasError(true), className: "cfui-message-avatar-image" })) : (_jsx("span", { className: "cfui-message-avatar-fallback", children: fallback ?? (alt ? alt.slice(0, 2).toUpperCase() : "?") })) }));
});
MessageAvatar.displayName = "MessageAvatar";
export const MessageContent = React.forwardRef(({ asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, className: cn("cfui-message-content", className), ...props, children: children }));
});
MessageContent.displayName = "MessageContent";
export const MessageHeader = React.forwardRef(({ align, asChild = false, className, children, ...props }, ref) => {
    const context = useMessageContext();
    const resolvedAlign = align ?? context.align;
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, "data-align": resolvedAlign, className: cn("cfui-message-header", `cfui-message-header--${resolvedAlign}`, className), ...props, children: children }));
});
MessageHeader.displayName = "MessageHeader";
export const MessageFooter = React.forwardRef(({ align, asChild = false, className, children, ...props }, ref) => {
    const context = useMessageContext();
    const resolvedAlign = align ?? context.align;
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, "data-align": resolvedAlign, className: cn("cfui-message-footer", `cfui-message-footer--${resolvedAlign}`, className), ...props, children: children }));
});
MessageFooter.displayName = "MessageFooter";
export const MessageGroup = React.forwardRef(({ align = "start", asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (_jsx(Component, { ref: ref, "data-align": align, className: cn("cfui-message-group", `cfui-message-group--${align}`, className), ...props, children: children }));
});
MessageGroup.displayName = "MessageGroup";
//# sourceMappingURL=message.js.map