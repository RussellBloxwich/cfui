import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./attachment.css";

export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";
export type AttachmentSize = "default" | "sm" | "xs";
export type AttachmentOrientation = "horizontal" | "vertical";

export interface AttachmentContextValue {
  state: AttachmentState;
  size: AttachmentSize;
  orientation: AttachmentOrientation;
  disabled?: boolean;
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: "done",
  size: "default",
  orientation: "horizontal",
  disabled: false,
});

export function useAttachmentContext() {
  return React.useContext(AttachmentContext);
}

function composeRefs<T>(...refs: (React.Ref<T> | undefined | null)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

function mergeElementProps(
  ours: Record<string, any>,
  theirs: Record<string, any>,
  forwardedRef: React.Ref<any>
) {
  const theirsRef = (theirs as any)?.ref ?? (theirs as any)?.props?.ref;
  const merged: Record<string, any> = { ...theirs, ...ours };

  const allKeys = new Set([...Object.keys(ours), ...Object.keys(theirs)]);
  for (const key of allKeys) {
    if (/^on[A-Z]/.test(key)) {
      const ourHandler = ours[key];
      const theirHandler = theirs[key];
      if (typeof ourHandler === "function" && typeof theirHandler === "function") {
        merged[key] = (event: any) => {
          theirHandler(event);
          if (!event?.defaultPrevented) {
            ourHandler(event);
          }
        };
      } else {
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

/* ==========================================================================
   Attachment (Root)
   ========================================================================== */

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: AttachmentState;
  size?: AttachmentSize;
  orientation?: AttachmentOrientation;
  disabled?: boolean;
  asChild?: boolean;
}

export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      state = "done",
      size = "default",
      orientation = "horizontal",
      disabled = false,
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : "div";
    const contextValue = React.useMemo(
      () => ({ state, size, orientation, disabled }),
      [state, size, orientation, disabled]
    );

    return (
      <AttachmentContext.Provider value={contextValue}>
        <Component
          ref={ref}
          data-state={state}
          data-size={size}
          data-orientation={orientation}
          data-disabled={disabled ? "true" : undefined}
          aria-disabled={disabled ? true : undefined}
          className={cn(
            "cfui-attachment",
            `cfui-attachment--${size}`,
            `cfui-attachment--${orientation}`,
            `cfui-attachment--${state}`,
            disabled && "cfui-attachment--disabled",
            className
          )}
          {...props}
        >
          {children}
        </Component>
      </AttachmentContext.Provider>
    );
  }
);
Attachment.displayName = "Attachment";

/* ==========================================================================
   AttachmentTrigger
   Full-card native button or polymorphic link behind independent actions.
   Composes refs, event handlers, and classes.
   Disabled links expose aria-disabled and block activation.
   Root disabled cannot be overridden by child defaults.
   ========================================================================== */

export interface AttachmentTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  render?:
    | React.ReactElement<any>
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        context: AttachmentContextValue
      ) => React.ReactNode);
}

export const AttachmentTrigger = React.forwardRef<
  HTMLElement,
  AttachmentTriggerProps
>(
  (
    {
      asChild = false,
      render,
      href,
      type = "button",
      className,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const context = useAttachmentContext();
    // Root disabled cannot be overridden accidentally by false child defaults
    const isDisabled = Boolean(context.disabled || props.disabled);

    const handleClick = (e: React.MouseEvent<any>) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<any>) => {
      if (isDisabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onKeyDown?.(e);
    };

    const mergedProps = {
      ref,
      className: cn(
        "cfui-attachment-trigger",
        isDisabled && "cfui-attachment-trigger--disabled",
        className
      ),
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
      return (
        <Slot {...(mergedProps as any)}>
          {children}
        </Slot>
      );
    }

    if (typeof render === "function") {
      return render(mergedProps as any, context);
    }

    if (React.isValidElement(render)) {
      const renderProps = (render.props || {}) as Record<string, any>;
      const merged = mergeElementProps(mergedProps, renderProps, ref);
      if (isDisabled) {
        merged["aria-disabled"] = true;
        merged["data-disabled"] = "true";
        merged.tabIndex = -1;
      }
      return React.cloneElement(render as React.ReactElement<any>, merged);
    }

    if (href) {
      return (
        <a
          href={href}
          {...(mergedProps as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        type={type}
        disabled={isDisabled}
        {...(mergedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);
AttachmentTrigger.displayName = "AttachmentTrigger";

/* ==========================================================================
   AttachmentMedia
   ========================================================================== */

export interface AttachmentMediaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "icon" | "image";
  src?: string;
  alt?: string;
  asChild?: boolean;
}

export const AttachmentMedia = React.forwardRef<
  HTMLDivElement,
  AttachmentMediaProps
>(
  (
    {
      variant = "icon",
      src,
      alt = "",
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useAttachmentContext();
    const Component = asChild ? Slot : "div";

    return (
      <Component
        ref={ref}
        data-variant={variant}
        data-size={context.size}
        className={cn(
          "cfui-attachment-media",
          `cfui-attachment-media--${variant}`,
          className
        )}
        {...props}
      >
        {children ? (
          children
        ) : src ? (
          <img
            src={src}
            alt={alt}
            className="cfui-attachment-media-image"
          />
        ) : null}
      </Component>
    );
  }
);
AttachmentMedia.displayName = "AttachmentMedia";

/* ==========================================================================
   AttachmentContent
   ========================================================================== */

export interface AttachmentContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const AttachmentContent = React.forwardRef<
  HTMLDivElement,
  AttachmentContentProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      className={cn("cfui-attachment-content", className)}
      {...props}
    >
      {children}
    </Component>
  );
});
AttachmentContent.displayName = "AttachmentContent";

/* ==========================================================================
   AttachmentTitle
   ========================================================================== */

export interface AttachmentTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  progress?: number;
  asChild?: boolean;
}

export const AttachmentTitle = React.forwardRef<
  HTMLHeadingElement,
  AttachmentTitleProps
>(({ progress, asChild = false, className, children, ...props }, ref) => {
  const context = useAttachmentContext();
  const Component = asChild ? Slot : "h4";

  return (
    <div className="cfui-attachment-title-wrapper">
      <Component
        ref={ref}
        data-state={context.state}
        className={cn("cfui-attachment-title", className)}
        {...props}
      >
        {children}
      </Component>
      {(progress !== undefined || context.state === "uploading") && (
        <div
          role="progressbar"
          aria-valuenow={progress ?? 0}
          aria-valuemin={0}
          aria-valuemax={100}
          className="cfui-attachment-progress-track"
        >
          <div
            className="cfui-attachment-progress-bar"
            style={{ width: `${Math.min(Math.max(progress ?? 0, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
});
AttachmentTitle.displayName = "AttachmentTitle";

/* ==========================================================================
   AttachmentDescription
   ========================================================================== */

export interface AttachmentDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export const AttachmentDescription = React.forwardRef<
  HTMLParagraphElement,
  AttachmentDescriptionProps
>(({ asChild = false, className, ...props }, ref) => {
  const Component = asChild ? Slot : "p";
  return (
    <Component
      ref={ref}
      className={cn("cfui-attachment-description", className)}
      {...props}
    />
  );
});
AttachmentDescription.displayName = "AttachmentDescription";

/* ==========================================================================
   AttachmentActions
   ========================================================================== */

export interface AttachmentActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const AttachmentActions = React.forwardRef<
  HTMLDivElement,
  AttachmentActionsProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      className={cn("cfui-attachment-actions", className)}
      {...props}
    >
      {children}
    </Component>
  );
});
AttachmentActions.displayName = "AttachmentActions";

/* ==========================================================================
   AttachmentAction
   Uses shared button props (variant=link, sizes lg/icon-sm/icon-lg, loading)
   Stops propagation to avoid activating trigger
   ========================================================================== */

export interface AttachmentActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "secondary"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "xs" | "lg" | "icon" | "icon-sm" | "icon-lg";
  loading?: boolean;
  href?: string;
  asChild?: boolean;
}

export const AttachmentAction = React.forwardRef<
  HTMLButtonElement,
  AttachmentActionProps
>(
  (
    {
      variant = "ghost",
      size = "xs",
      loading = false,
      href,
      asChild = false,
      className,
      onClick,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const context = useAttachmentContext();
    const isActionDisabled = Boolean(context.disabled || props.disabled || loading);

    const handleClick = (e: React.MouseEvent<any>) => {
      e.stopPropagation();
      if (isActionDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    if (href) {
      return (
        <a
          ref={ref as any}
          href={href}
          aria-disabled={isActionDisabled ? true : undefined}
          data-disabled={isActionDisabled ? "true" : undefined}
          data-loading={loading ? "true" : undefined}
          aria-busy={loading ? true : undefined}
          tabIndex={isActionDisabled ? -1 : props.tabIndex}
          onClick={handleClick}
          className={cn(
            "cfui-attachment-action",
            `cfui-attachment-action--${variant}`,
            `cfui-attachment-action--${size}`,
            loading && "cfui-attachment-action--loading",
            isActionDisabled && "cfui-attachment-action--disabled",
            className
          )}
          {...(props as any)}
        >
          {children}
        </a>
      );
    }

    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : type}
        disabled={isActionDisabled}
        data-disabled={isActionDisabled ? "true" : undefined}
        data-loading={loading ? "true" : undefined}
        aria-busy={loading ? true : undefined}
        onClick={handleClick}
        className={cn(
          "cfui-attachment-action",
          `cfui-attachment-action--${variant}`,
          `cfui-attachment-action--${size}`,
          loading && "cfui-attachment-action--loading",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
AttachmentAction.displayName = "AttachmentAction";

/* ==========================================================================
   AttachmentGroup
   Horizontally scrollable row with reachable off-screen content
   ========================================================================== */

export interface AttachmentGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const AttachmentGroup = React.forwardRef<
  HTMLDivElement,
  AttachmentGroupProps
>(({ asChild = false, className, role = "region", "aria-label": ariaLabel = "Attachments", tabIndex = 0, ...props }, ref) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      className={cn("cfui-attachment-group", className)}
      {...props}
    />
  );
});
AttachmentGroup.displayName = "AttachmentGroup";
