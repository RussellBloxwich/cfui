import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                    
declare const cardVariants: (props?: ({
    variant?: "default" | "flat" | "elevated" | "recessed" | "interactive" | null | undefined;
    density?: "default" | "compact" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
    asChild?: boolean;
}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
}
declare const CardTitle: React.ForwardRefExoticComponent<CardTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    asChild?: boolean;
}
declare const CardDescription: React.ForwardRefExoticComponent<CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const CardContent: React.ForwardRefExoticComponent<CardContentProps & React.RefAttributes<HTMLDivElement>>;
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const CardFooter: React.ForwardRefExoticComponent<CardFooterProps & React.RefAttributes<HTMLDivElement>>;
export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const CardAction: React.ForwardRefExoticComponent<CardActionProps & React.RefAttributes<HTMLDivElement>>;
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> & {
    Header: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
    Title: React.ForwardRefExoticComponent<CardTitleProps & React.RefAttributes<HTMLHeadingElement>>;
    Description: React.ForwardRefExoticComponent<CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
    Content: React.ForwardRefExoticComponent<CardContentProps & React.RefAttributes<HTMLDivElement>>;
    Footer: React.ForwardRefExoticComponent<CardFooterProps & React.RefAttributes<HTMLDivElement>>;
    Action: React.ForwardRefExoticComponent<CardActionProps & React.RefAttributes<HTMLDivElement>>;
};
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction, cardVariants, };
//# sourceMappingURL=card.d.ts.map