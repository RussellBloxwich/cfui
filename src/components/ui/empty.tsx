import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./empty.css";

const emptyVariants = cva("cfui-empty", {
  variants: {
    variant: {
      default: "",
      bordered: "cfui-empty--bordered",
      dashed: "cfui-empty--dashed",
      recessed: "cfui-empty--recessed",
    },
    size: {
      sm: "cfui-empty--sm",
      md: "cfui-empty--md",
      lg: "cfui-empty--lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface EmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof emptyVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyRoot = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      title,
      description,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    const hasShorthand = Boolean(icon || title || description || action);

    return (
      <Comp
        ref={ref}
        className={cn(emptyVariants({ variant, size }), className)}
        {...props}
      >
        {hasShorthand ? (
          <>
            {icon && <div className="cfui-empty-icon">{icon}</div>}
            {title && <h3 className="cfui-empty-title">{title}</h3>}
            {description && (
              <p className="cfui-empty-description">{description}</p>
            )}
            {action && <div className="cfui-empty-actions">{action}</div>}
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
EmptyRoot.displayName = "Empty";

export interface EmptyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const EmptyHeader = React.forwardRef<HTMLDivElement, EmptyHeaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-empty-header", className)}
        {...props}
      />
    );
  }
);
EmptyHeader.displayName = "EmptyHeader";

export interface EmptyMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-empty-media", className)}
        {...props}
      />
    );
  }
);
EmptyMedia.displayName = "EmptyMedia";

const EmptyIcon = EmptyMedia;

export interface EmptyTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

const EmptyTitle = React.forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-empty-title", className)}
        {...props}
      />
    );
  }
);
EmptyTitle.displayName = "EmptyTitle";

export interface EmptyDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyDescriptionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "p";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-empty-description", className)}
      {...props}
    />
  );
});
EmptyDescription.displayName = "EmptyDescription";

export interface EmptyContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const EmptyContent = React.forwardRef<HTMLDivElement, EmptyContentProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-empty-content", className)}
        {...props}
      />
    );
  }
);
EmptyContent.displayName = "EmptyContent";

export interface EmptyActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const EmptyActions = React.forwardRef<HTMLDivElement, EmptyActionsProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-empty-actions", className)}
        {...props}
      />
    );
  }
);
EmptyActions.displayName = "EmptyActions";

const EmptyAction = EmptyActions;

export const Empty = Object.assign(EmptyRoot, {
  Header: EmptyHeader,
  Media: EmptyMedia,
  Icon: EmptyIcon,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Content: EmptyContent,
  Actions: EmptyActions,
  Action: EmptyAction,
});

const EmptyState = Empty;

export {
  EmptyState,
  EmptyHeader,
  EmptyMedia,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyActions,
  EmptyAction,
  emptyVariants,
};
