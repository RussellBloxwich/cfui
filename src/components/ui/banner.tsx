import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  InfoIcon,
  WarningIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  XIcon,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./banner.css";

export type BannerVariant = "info" | "warning" | "danger" | "success";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  asChild?: boolean;
}

const variantIcons: Record<BannerVariant, Icon> = {
  info: InfoIcon,
  warning: WarningIcon,
  danger: WarningCircleIcon,
  success: CheckCircleIcon,
};

const BannerContext = React.createContext<{
  variant: BannerVariant;
  onDismiss?: () => void;
}>({
  variant: "info",
});

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant = "info",
      open: controlledOpen,
      defaultOpen = true,
      onOpenChange,
      onDismiss,
      dismissible,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

    const handleDismiss = React.useCallback(() => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(false);
      }
      onOpenChange?.(false);
      onDismiss?.();
    }, [controlledOpen, onOpenChange, onDismiss]);

    if (!isOpen) {
      return null;
    }

    const Comp = asChild ? Slot : "div";

    return (
      <BannerContext.Provider value={{ variant, onDismiss: handleDismiss }}>
        <Comp
          ref={ref}
          role={variant === "danger" || variant === "warning" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "cfui-banner",
            `cfui-banner--${variant}`,
            className
          )}
          {...props}
        >
          {children}
          {(dismissible || onDismiss) &&
            !React.Children.toArray(children).some(
              (child) =>
                React.isValidElement(child) &&
                (child.type === BannerDismiss || child.type === BannerClose)
            ) && <BannerDismiss />}
        </Comp>
      </BannerContext.Provider>
    );
  }
);
Banner.displayName = "Banner";

export interface BannerIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const BannerIcon = React.forwardRef<HTMLSpanElement, BannerIconProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const { variant } = React.useContext(BannerContext);
    const Comp = asChild ? Slot : "span";
    const DefaultIcon = variantIcons[variant];

    return (
      <Comp
        ref={ref}
        className={cn(
          "cfui-banner-icon",
          `cfui-banner-icon--${variant}`,
          className
        )}
        {...props}
      >
        {children ?? <DefaultIcon size={18} weight="fill" />}
      </Comp>
    );
  }
);
BannerIcon.displayName = "BannerIcon";

export interface BannerTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export const BannerTitle = React.forwardRef<HTMLHeadingElement, BannerTitleProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h5";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-banner-title", className)}
        {...props}
      />
    );
  }
);
BannerTitle.displayName = "BannerTitle";

export interface BannerDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export const BannerDescription = React.forwardRef<
  HTMLParagraphElement,
  BannerDescriptionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-banner-description", className)}
      {...props}
    />
  );
});
BannerDescription.displayName = "BannerDescription";

export interface BannerActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const BannerAction = React.forwardRef<HTMLButtonElement, BannerActionProps>(
  ({ className, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={type}
        className={cn("cfui-banner-action", className)}
        {...props}
      />
    );
  }
);
BannerAction.displayName = "BannerAction";

export interface BannerDismissProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const BannerDismiss = React.forwardRef<
  HTMLButtonElement,
  BannerDismissProps
>(({ className, asChild = false, type = "button", onClick, children, ...props }, ref) => {
  const { onDismiss } = React.useContext(BannerContext);
  const Comp = asChild ? Slot : "button";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      onDismiss?.();
    }
  };

  return (
    <Comp
      ref={ref}
      type={type}
      aria-label="Dismiss banner"
      onClick={handleClick}
      className={cn("cfui-banner-dismiss", className)}
      {...props}
    >
      {children ?? <XIcon size={14} weight="bold" />}
    </Comp>
  );
});
BannerDismiss.displayName = "BannerDismiss";

export const BannerClose = BannerDismiss;
