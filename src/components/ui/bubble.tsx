import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./bubble.css";

export type BubbleVariant =
  | "default"
  | "secondary"
  | "muted"
  | "tinted"
  | "outline"
  | "ghost"
  | "destructive";

export type BubbleAlign = "start" | "end";

interface BubbleContextValue {
  variant: BubbleVariant;
  align: BubbleAlign;
}

const BubbleContext = React.createContext<BubbleContextValue>({
  variant: "default",
  align: "start",
});

export function useBubbleContext() {
  return React.useContext(BubbleContext);
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
   Bubble (Root)
   ========================================================================== */

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BubbleVariant;
  align?: BubbleAlign;
  asChild?: boolean;
}

export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  (
    {
      variant = "default",
      align = "start",
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : "div";
    const contextValue = React.useMemo(
      () => ({ variant, align }),
      [variant, align]
    );

    return (
      <BubbleContext.Provider value={contextValue}>
        <Component
          ref={ref}
          data-variant={variant}
          data-align={align}
          className={cn(
            "cfui-bubble",
            `cfui-bubble--${variant}`,
            `cfui-bubble--${align}`,
            className
          )}
          {...props}
        >
          {children}
        </Component>
      </BubbleContext.Provider>
    );
  }
);
Bubble.displayName = "Bubble";

/* ==========================================================================
   BubbleContent
   Ghost permits full width; other bubbles fit their content.
   Supports render function/element, asChild via Slot, and real button/link.
   ========================================================================== */

export interface BubbleContentProps
  extends React.HTMLAttributes<HTMLElement> {
  variant?: BubbleVariant;
  align?: BubbleAlign;
  asChild?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  render?:
    | React.ReactElement<any>
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        context: BubbleContextValue
      ) => React.ReactNode);
}

export const BubbleContent = React.forwardRef<HTMLElement, BubbleContentProps>(
  (
    {
      variant: explicitVariant,
      align: explicitAlign,
      asChild = false,
      render,
      href,
      type,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useBubbleContext();
    const variant = explicitVariant ?? context.variant;
    const align = explicitAlign ?? context.align;

    const mergedProps = {
      ref,
      "data-variant": variant,
      "data-align": align,
      href,
      type,
      className: cn(
        "cfui-bubble-content",
        `cfui-bubble-content--${variant}`,
        `cfui-bubble-content--${align}`,
        variant === "ghost"
          ? "cfui-bubble-content--full-width"
          : "cfui-bubble-content--fit-content",
        className
      ),
      ...props,
    };

    if (asChild) {
      return <Slot {...(mergedProps as any)}>{children}</Slot>;
    }

    if (typeof render === "function") {
      return render(mergedProps as any, { variant, align });
    }

    if (React.isValidElement(render)) {
      const renderProps = (render.props || {}) as Record<string, any>;
      const merged = mergeElementProps(mergedProps, renderProps, ref);
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

    if (type) {
      return (
        <button
          type={type}
          {...(mergedProps as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <div {...(mergedProps as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }
);
BubbleContent.displayName = "BubbleContent";

/* ==========================================================================
   BubbleReactions
   Container for semantically operable reaction buttons/links
   ========================================================================== */

export interface BubbleReactionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom";
  align?: "start" | "end";
  asChild?: boolean;
}

export const BubbleReactions = React.forwardRef<
  HTMLDivElement,
  BubbleReactionsProps
>(
  (
    {
      side = "bottom",
      align,
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useBubbleContext();
    const resolvedAlign = align ?? context.align;
    const Component = asChild ? Slot : "div";

    return (
      <Component
        ref={ref}
        data-side={side}
        data-align={resolvedAlign}
        className={cn(
          "cfui-bubble-reactions",
          `cfui-bubble-reactions--${side}`,
          `cfui-bubble-reactions--${resolvedAlign}`,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
BubbleReactions.displayName = "BubbleReactions";

/* ==========================================================================
   BubbleGroup
   ========================================================================== */

export interface BubbleGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: BubbleAlign;
  asChild?: boolean;
}

export const BubbleGroup = React.forwardRef<HTMLDivElement, BubbleGroupProps>(
  ({ align = "start", asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    return (
      <Component
        ref={ref}
        data-align={align}
        className={cn(
          "cfui-bubble-group",
          `cfui-bubble-group--${align}`,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
BubbleGroup.displayName = "BubbleGroup";
