import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                   
declare const kbdVariants: (props?: ({
    variant?: "default" | "outline" | "solid" | null | undefined;
    size?: "sm" | "xs" | "md" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface KbdProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof kbdVariants> {
    asChild?: boolean;
    keys?: string[];
}
export interface KbdGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
    separator?: React.ReactNode;
}
declare const KbdGroup: React.ForwardRefExoticComponent<KbdGroupProps & React.RefAttributes<HTMLSpanElement>>;
export declare const Kbd: React.ForwardRefExoticComponent<KbdProps & React.RefAttributes<HTMLElement>> & {
    Group: React.ForwardRefExoticComponent<KbdGroupProps & React.RefAttributes<HTMLSpanElement>>;
};
export { KbdGroup, kbdVariants };
//# sourceMappingURL=kbd.d.ts.map