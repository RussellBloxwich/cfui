import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./skeleton.css";

const skeletonVariants = cva("cfui-skeleton", {
  variants: {
    variant: {
      default: "",
      circle: "cfui-skeleton--circle",
      text: "cfui-skeleton--text",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  asChild?: boolean;
}

const SkeletonRoot = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
SkeletonRoot.displayName = "Skeleton";

const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>((props, ref) => <SkeletonRoot ref={ref} variant="circle" {...props} />);
SkeletonCircle.displayName = "SkeletonCircle";

const SkeletonText = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>((props, ref) => <SkeletonRoot ref={ref} variant="text" {...props} />);
SkeletonText.displayName = "SkeletonText";

export const Skeleton = Object.assign(SkeletonRoot, {
  Circle: SkeletonCircle,
  Text: SkeletonText,
});

export { SkeletonCircle, SkeletonText, skeletonVariants };
