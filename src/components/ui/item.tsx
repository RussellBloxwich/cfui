import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./item.css";

const itemVariants = cva("cfui-item", {
  variants: {
    variant: {
      default: "",
      danger: "cfui-item--danger",
    },
    size: {
      sm: "cfui-item--sm",
      md: "cfui-item--md",
      lg: "cfui-item--lg",
    },
    interactive: {
      true: "cfui-item--interactive",
      false: "",
    },
    selected: {
      true: "cfui-item--selected",
      false: "",
    },
    disabled: {
      true: "cfui-item--disabled",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    interactive: true,
    selected: false,
    disabled: false,
  },
});

export interface ItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof itemVariants> {
  asChild?: boolean;
  selected?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  leading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
}

const ItemRoot = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      variant,
      size,
      interactive = true,
      selected = false,
      disabled = false,
      asChild = false,
      leading,
      title,
      description,
      trailing,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    const hasShorthand = Boolean(leading || title || description || trailing);

    return (
      <Comp
        ref={ref}
        aria-selected={selected || undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          itemVariants({
            variant,
            size,
            interactive,
            selected,
            disabled,
          }),
          className
        )}
        {...props}
      >
        {hasShorthand ? (
          <>
            {leading && <div className="cfui-item-leading">{leading}</div>}
            {(title || description) && (
              <div className="cfui-item-content">
                {title && <div className="cfui-item-title">{title}</div>}
                {description && (
                  <div className="cfui-item-description">{description}</div>
                )}
              </div>
            )}
            {children}
            {trailing && <div className="cfui-item-trailing">{trailing}</div>}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
ItemRoot.displayName = "Item";

export interface ItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        role="group"
        className={cn("cfui-item-group", className)}
        {...props}
      />
    );
  }
);
ItemGroup.displayName = "ItemGroup";

export interface ItemSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemSeparator = React.forwardRef<HTMLDivElement, ItemSeparatorProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        role="separator"
        className={cn("cfui-item-separator", className)}
        {...props}
      />
    );
  }
);
ItemSeparator.displayName = "ItemSeparator";

export interface ItemHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-header", className)}
        {...props}
      />
    );
  }
);
ItemHeader.displayName = "ItemHeader";

export interface ItemFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-footer", className)}
        {...props}
      />
    );
  }
);
ItemFooter.displayName = "ItemFooter";

export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-media", className)}
        {...props}
      />
    );
  }
);
ItemMedia.displayName = "ItemMedia";

const ItemLeading = ItemMedia;

export interface ItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-content", className)}
        {...props}
      />
    );
  }
);
ItemContent.displayName = "ItemContent";

export interface ItemTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemTitle = React.forwardRef<HTMLDivElement, ItemTitleProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-title", className)}
        {...props}
      />
    );
  }
);
ItemTitle.displayName = "ItemTitle";

export interface ItemDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemDescription = React.forwardRef<HTMLDivElement, ItemDescriptionProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-description", className)}
        {...props}
      />
    );
  }
);
ItemDescription.displayName = "ItemDescription";

export interface ItemTrailingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemTrailing = React.forwardRef<HTMLDivElement, ItemTrailingProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-trailing", className)}
        {...props}
      />
    );
  }
);
ItemTrailing.displayName = "ItemTrailing";

const ItemAction = ItemTrailing;

export interface ItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-item-actions", className)}
        {...props}
      />
    );
  }
);
ItemActions.displayName = "ItemActions";

export const Item = Object.assign(ItemRoot, {
  Group: ItemGroup,
  Separator: ItemSeparator,
  Header: ItemHeader,
  Footer: ItemFooter,
  Media: ItemMedia,
  Leading: ItemLeading,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Trailing: ItemTrailing,
  Actions: ItemActions,
  Action: ItemAction,
});

export {
  ItemGroup,
  ItemSeparator,
  ItemHeader,
  ItemFooter,
  ItemMedia,
  ItemLeading,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemTrailing,
  ItemActions,
  ItemAction,
  itemVariants,
};
