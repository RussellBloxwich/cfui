import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./message.css";

export type MessageAlign = "start" | "end";

interface MessageContextValue {
  align: MessageAlign;
}

const MessageContext = React.createContext<MessageContextValue>({
  align: "start",
});

export function useMessageContext() {
  return React.useContext(MessageContext);
}

/* ==========================================================================
   Message (Root)
   ========================================================================== */

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: MessageAlign;
  asChild?: boolean;
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ align = "start", asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    const contextValue = React.useMemo(() => ({ align }), [align]);

    return (
      <MessageContext.Provider value={contextValue}>
        <Component
          ref={ref}
          data-align={align}
          className={cn(
            "cfui-message",
            `cfui-message--${align}`,
            className
          )}
          {...props}
        >
          {children}
        </Component>
      </MessageContext.Provider>
    );
  }
);
Message.displayName = "Message";

/* ==========================================================================
   MessageAvatar
   Avatar alignment clears footer metadata
   ========================================================================== */

export interface MessageAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  asChild?: boolean;
}

export const MessageAvatar = React.forwardRef<
  HTMLDivElement,
  MessageAvatarProps
>(
  (
    {
      src,
      alt = "",
      fallback,
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useMessageContext();
    const Component = asChild ? Slot : "div";
    const [hasError, setHasError] = React.useState(false);

    return (
      <Component
        ref={ref}
        data-align={context.align}
        className={cn(
          "cfui-message-avatar",
          `cfui-message-avatar--${context.align}`,
          className
        )}
        {...props}
      >
        {children ? (
          children
        ) : src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="cfui-message-avatar-image"
          />
        ) : (
          <span className="cfui-message-avatar-fallback">
            {fallback ?? (alt ? alt.slice(0, 2).toUpperCase() : "?")}
          </span>
        )}
      </Component>
    );
  }
);
MessageAvatar.displayName = "MessageAvatar";

/* ==========================================================================
   MessageContent
   ========================================================================== */

export interface MessageContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const MessageContent = React.forwardRef<
  HTMLDivElement,
  MessageContentProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      className={cn("cfui-message-content", className)}
      {...props}
    >
      {children}
    </Component>
  );
});
MessageContent.displayName = "MessageContent";

/* ==========================================================================
   MessageHeader
   ========================================================================== */

export interface MessageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: MessageAlign;
  asChild?: boolean;
}

export const MessageHeader = React.forwardRef<
  HTMLDivElement,
  MessageHeaderProps
>(({ align, asChild = false, className, children, ...props }, ref) => {
  const context = useMessageContext();
  const resolvedAlign = align ?? context.align;
  const Component = asChild ? Slot : "div";

  return (
    <Component
      ref={ref}
      data-align={resolvedAlign}
      className={cn(
        "cfui-message-header",
        `cfui-message-header--${resolvedAlign}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
MessageHeader.displayName = "MessageHeader";

/* ==========================================================================
   MessageFooter
   ========================================================================== */

export interface MessageFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: MessageAlign;
  asChild?: boolean;
}

export const MessageFooter = React.forwardRef<
  HTMLDivElement,
  MessageFooterProps
>(({ align, asChild = false, className, children, ...props }, ref) => {
  const context = useMessageContext();
  const resolvedAlign = align ?? context.align;
  const Component = asChild ? Slot : "div";

  return (
    <Component
      ref={ref}
      data-align={resolvedAlign}
      className={cn(
        "cfui-message-footer",
        `cfui-message-footer--${resolvedAlign}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
MessageFooter.displayName = "MessageFooter";

/* ==========================================================================
   MessageGroup
   ========================================================================== */

export interface MessageGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: MessageAlign;
  asChild?: boolean;
}

export const MessageGroup = React.forwardRef<HTMLDivElement, MessageGroupProps>(
  ({ align = "start", asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (
      <Component
        ref={ref}
        data-align={align}
        className={cn(
          "cfui-message-group",
          `cfui-message-group--${align}`,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MessageGroup.displayName = "MessageGroup";
