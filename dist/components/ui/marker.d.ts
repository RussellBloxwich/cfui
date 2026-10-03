import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                      
export declare const markerVariants: (props?: ({
    variant?: "default" | "separator" | "border" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type MarkerVariant = "default" | "border" | "separator";
export interface MarkerProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof markerVariants> {
    variant?: MarkerVariant;
    asChild?: boolean;
    href?: string;
    type?: "button" | "submit" | "reset";
    render?: React.ReactElement<any> | ((props: React.HTMLAttributes<HTMLElement>, state: {
        variant: MarkerVariant;
    }) => React.ReactNode);
}
export declare const Marker: React.ForwardRefExoticComponent<MarkerProps & React.RefAttributes<HTMLElement>>;
export interface MarkerIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const MarkerIcon: React.ForwardRefExoticComponent<MarkerIconProps & React.RefAttributes<HTMLSpanElement>>;
export interface MarkerContentProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const MarkerContent: React.ForwardRefExoticComponent<MarkerContentProps & React.RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=marker.d.ts.map