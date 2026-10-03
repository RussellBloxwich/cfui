import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./kbd.css";

const kbdVariants = cva("cfui-kbd", {
  variants: {
    variant: {
      default: "",
      outline: "cfui-kbd--outline",
      solid: "cfui-kbd--solid",
    },
    size: {
      xs: "cfui-kbd--xs",
      sm: "cfui-kbd--sm",
      md: "cfui-kbd--md",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  asChild?: boolean;
  keys?: string[];
}

const KbdRoot = React.forwardRef<HTMLElement, KbdProps>(
  (
    { className, variant, size, asChild = false, keys, children, ...props },
    ref
  ) => {
    if (keys && keys.length > 0) {
      return (
        <span className="cfui-kbd-group">
          {keys.map((k, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="cfui-kbd-separator">+</span>}
              <kbd
                className={cn(kbdVariants({ variant, size }), className)}
                {...props}
              >
                {k}
              </kbd>
            </React.Fragment>
          ))}
        </span>
      );
    }

    const Comp = asChild ? Slot : "kbd";
    return (
      <Comp
        ref={ref}
        className={cn(kbdVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
KbdRoot.displayName = "Kbd";

export interface KbdGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  separator?: React.ReactNode;
}

const KbdGroup = React.forwardRef<HTMLSpanElement, KbdGroupProps>(
  ({ className, asChild = false, separator = "+", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    const childArray = React.Children.toArray(children);

    return (
      <Comp ref={ref} className={cn("cfui-kbd-group", className)} {...props}>
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 && separator && (
              <span className="cfui-kbd-separator">{separator}</span>
            )}
            {child}
          </React.Fragment>
        ))}
      </Comp>
    );
  }
);
KbdGroup.displayName = "KbdGroup";

export const Kbd = Object.assign(KbdRoot, {
  Group: KbdGroup,
});

export { KbdGroup, kbdVariants };
