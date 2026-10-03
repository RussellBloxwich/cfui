import * as React from "react";
                      
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
export declare const Banner: React.ForwardRefExoticComponent<BannerProps & React.RefAttributes<HTMLDivElement>>;
export interface BannerIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const BannerIcon: React.ForwardRefExoticComponent<BannerIconProps & React.RefAttributes<HTMLSpanElement>>;
export interface BannerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
}
export declare const BannerTitle: React.ForwardRefExoticComponent<BannerTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface BannerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    asChild?: boolean;
}
export declare const BannerDescription: React.ForwardRefExoticComponent<BannerDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface BannerActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const BannerAction: React.ForwardRefExoticComponent<BannerActionProps & React.RefAttributes<HTMLButtonElement>>;
export interface BannerDismissProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const BannerDismiss: React.ForwardRefExoticComponent<BannerDismissProps & React.RefAttributes<HTMLButtonElement>>;
export declare const BannerClose: React.ForwardRefExoticComponent<BannerDismissProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=banner.d.ts.map