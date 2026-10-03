import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils.js";
import "./marker.css";

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

export type MarkerVariant = "default" | "border" | "separator";

export interface MarkerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof markerVariants> {
  variant?: MarkerVariant;
  asChild?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  render?:
    | React.ReactElement<any>
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        state: { variant: MarkerVariant }
      ) => React.ReactNode);
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

export const Marker = React.forwardRef<HTMLElement, MarkerProps>(
  (
    {
      variant = "default",
      asChild = false,
      render,
      href,
      type,
      role,
      className,
      children,
      ...props
    },
    ref
  ) => {
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
      return <Slot {...(mergedProps as any)}>{children}</Slot>;
    }

    if (typeof render === "function") {
      return render(mergedProps, { variant });
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
      <div {...(mergedProps as unknown as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }
);
Marker.displayName = "Marker";

/* ==========================================================================
   MarkerIcon
   Decorative MarkerIcon is aria-hidden
   ========================================================================== */

export interface MarkerIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const MarkerIcon = React.forwardRef<HTMLSpanElement, MarkerIconProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : "span";
    return (
      <Component
        ref={ref}
        aria-hidden="true"
        className={cn("cfui-marker-icon", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MarkerIcon.displayName = "MarkerIcon";

/* ==========================================================================
   MarkerContent
   ========================================================================== */

export interface MarkerContentProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const MarkerContent = React.forwardRef<
  HTMLSpanElement,
  MarkerContentProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const Component = asChild ? Slot : "span";
  return (
    <Component
      ref={ref}
      className={cn("cfui-marker-content", className)}
      {...props}
    >
      {children}
    </Component>
  );
});
MarkerContent.displayName = "MarkerContent";
