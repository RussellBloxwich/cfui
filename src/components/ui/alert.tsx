import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./alert.css";

const alertVariants = cva("cfui-alert", {
  variants: {
    variant: {
      default: "cfui-alert--default",
      info: "cfui-alert--info",
      destructive: "cfui-alert--destructive",
      danger: "cfui-alert--danger",
      warning: "cfui-alert--warning",
      success: "cfui-alert--success",
      neutral: "cfui-alert--neutral",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const AlertRoot = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      asChild = false,
      icon,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && <div className="cfui-alert-icon">{icon}</div>}
        <div className="cfui-alert-body">{children}</div>
        {action && <div className="cfui-alert-action">{action}</div>}
      </Comp>
    );
  }
);
AlertRoot.displayName = "Alert";

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h5";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-alert-title", className)}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-alert-description", className)}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export interface AlertIconProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const AlertIcon = React.forwardRef<HTMLDivElement, AlertIconProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-alert-icon", className)}
        {...props}
      />
    );
  }
);
AlertIcon.displayName = "AlertIcon";

export interface AlertActionProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const AlertAction = React.forwardRef<HTMLDivElement, AlertActionProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-alert-action", className)}
        {...props}
      />
    );
  }
);
AlertAction.displayName = "AlertAction";

export const Alert = Object.assign(AlertRoot, {
  Title: AlertTitle,
  Description: AlertDescription,
  Icon: AlertIcon,
  Action: AlertAction,
});

export {
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AlertAction,
  alertVariants,
};
