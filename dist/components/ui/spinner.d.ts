import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                       
declare const spinnerVariants: (props?: ({
    size?: "sm" | "lg" | "xs" | "xl" | "md" | null | undefined;
    variant?: "default" | "current" | "brand" | "contrast" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
    label?: string;
    strokeWidth?: number;
}
declare const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<HTMLSpanElement>>;
export { Spinner, spinnerVariants };
//# sourceMappingURL=spinner.d.ts.map