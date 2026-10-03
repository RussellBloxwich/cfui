import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                     
declare const alertVariants: (props?: ({
    variant?: "default" | "destructive" | "success" | "warning" | "info" | "neutral" | "danger" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    asChild?: boolean;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}
export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
}
declare const AlertTitle: React.ForwardRefExoticComponent<AlertTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    asChild?: boolean;
}
declare const AlertDescription: React.ForwardRefExoticComponent<AlertDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface AlertIconProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const AlertIcon: React.ForwardRefExoticComponent<AlertIconProps & React.RefAttributes<HTMLDivElement>>;
export interface AlertActionProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const AlertAction: React.ForwardRefExoticComponent<AlertActionProps & React.RefAttributes<HTMLDivElement>>;
export declare const Alert: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>> & {
    Title: React.ForwardRefExoticComponent<AlertTitleProps & React.RefAttributes<HTMLHeadingElement>>;
    Description: React.ForwardRefExoticComponent<AlertDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
    Icon: React.ForwardRefExoticComponent<AlertIconProps & React.RefAttributes<HTMLDivElement>>;
    Action: React.ForwardRefExoticComponent<AlertActionProps & React.RefAttributes<HTMLDivElement>>;
};
export { AlertTitle, AlertDescription, AlertIcon, AlertAction, alertVariants, };
//# sourceMappingURL=alert.d.ts.map