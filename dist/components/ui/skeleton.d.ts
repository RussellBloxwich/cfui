import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                        
declare const skeletonVariants: (props?: ({
    variant?: "default" | "text" | "circle" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {
    asChild?: boolean;
}
declare const SkeletonCircle: React.ForwardRefExoticComponent<Omit<SkeletonProps, "variant"> & React.RefAttributes<HTMLDivElement>>;
declare const SkeletonText: React.ForwardRefExoticComponent<Omit<SkeletonProps, "variant"> & React.RefAttributes<HTMLDivElement>>;
export declare const Skeleton: React.ForwardRefExoticComponent<SkeletonProps & React.RefAttributes<HTMLDivElement>> & {
    Circle: React.ForwardRefExoticComponent<Omit<SkeletonProps, "variant"> & React.RefAttributes<HTMLDivElement>>;
    Text: React.ForwardRefExoticComponent<Omit<SkeletonProps, "variant"> & React.RefAttributes<HTMLDivElement>>;
};
export { SkeletonCircle, SkeletonText, skeletonVariants };
//# sourceMappingURL=skeleton.d.ts.map