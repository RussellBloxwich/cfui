import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { type VariantProps } from "class-variance-authority";
                        
declare const progressVariants: (props?: ({
    variant?: "default" | "success" | "warning" | "danger" | "brand" | null | undefined;
    size?: "sm" | "lg" | "md" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, VariantProps<typeof progressVariants> {
    indicatorClassName?: string;
}
declare const ProgressTrack: React.ForwardRefExoticComponent<ProgressPrimitive.ProgressProps & React.RefAttributes<HTMLDivElement>>;
declare const ProgressIndicator: React.ForwardRefExoticComponent<ProgressPrimitive.ProgressIndicatorProps & React.RefAttributes<HTMLDivElement>>;
export declare const Progress: React.ForwardRefExoticComponent<ProgressProps & React.RefAttributes<HTMLDivElement>> & {
    Track: React.ForwardRefExoticComponent<ProgressPrimitive.ProgressProps & React.RefAttributes<HTMLDivElement>>;
    Indicator: React.ForwardRefExoticComponent<ProgressPrimitive.ProgressIndicatorProps & React.RefAttributes<HTMLDivElement>>;
};
export { ProgressTrack, ProgressIndicator, progressVariants };
//# sourceMappingURL=progress.d.ts.map