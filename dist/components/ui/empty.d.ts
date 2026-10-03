import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                     
declare const emptyVariants: (props?: ({
    variant?: "default" | "dashed" | "recessed" | "bordered" | null | undefined;
    size?: "sm" | "lg" | "md" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof emptyVariants> {
    asChild?: boolean;
    icon?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
}
export interface EmptyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const EmptyHeader: React.ForwardRefExoticComponent<EmptyHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface EmptyMediaProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const EmptyMedia: React.ForwardRefExoticComponent<EmptyMediaProps & React.RefAttributes<HTMLDivElement>>;
declare const EmptyIcon: React.ForwardRefExoticComponent<EmptyMediaProps & React.RefAttributes<HTMLDivElement>>;
export interface EmptyTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
}
declare const EmptyTitle: React.ForwardRefExoticComponent<EmptyTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface EmptyDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    asChild?: boolean;
}
declare const EmptyDescription: React.ForwardRefExoticComponent<EmptyDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface EmptyContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const EmptyContent: React.ForwardRefExoticComponent<EmptyContentProps & React.RefAttributes<HTMLDivElement>>;
export interface EmptyActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const EmptyActions: React.ForwardRefExoticComponent<EmptyActionsProps & React.RefAttributes<HTMLDivElement>>;
declare const EmptyAction: React.ForwardRefExoticComponent<EmptyActionsProps & React.RefAttributes<HTMLDivElement>>;
export declare const Empty: React.ForwardRefExoticComponent<EmptyProps & React.RefAttributes<HTMLDivElement>> & {
    Header: React.ForwardRefExoticComponent<EmptyHeaderProps & React.RefAttributes<HTMLDivElement>>;
    Media: React.ForwardRefExoticComponent<EmptyMediaProps & React.RefAttributes<HTMLDivElement>>;
    Icon: React.ForwardRefExoticComponent<EmptyMediaProps & React.RefAttributes<HTMLDivElement>>;
    Title: React.ForwardRefExoticComponent<EmptyTitleProps & React.RefAttributes<HTMLHeadingElement>>;
    Description: React.ForwardRefExoticComponent<EmptyDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
    Content: React.ForwardRefExoticComponent<EmptyContentProps & React.RefAttributes<HTMLDivElement>>;
    Actions: React.ForwardRefExoticComponent<EmptyActionsProps & React.RefAttributes<HTMLDivElement>>;
    Action: React.ForwardRefExoticComponent<EmptyActionsProps & React.RefAttributes<HTMLDivElement>>;
};
declare const EmptyState: React.ForwardRefExoticComponent<EmptyProps & React.RefAttributes<HTMLDivElement>> & {
    Header: React.ForwardRefExoticComponent<EmptyHeaderProps & React.RefAttributes<HTMLDivElement>>;
    Media: React.ForwardRefExoticComponent<EmptyMediaProps & React.RefAttributes<HTMLDivElement>>;
    Icon: React.ForwardRefExoticComponent<EmptyMediaProps & React.RefAttributes<HTMLDivElement>>;
    Title: React.ForwardRefExoticComponent<EmptyTitleProps & React.RefAttributes<HTMLHeadingElement>>;
    Description: React.ForwardRefExoticComponent<EmptyDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
    Content: React.ForwardRefExoticComponent<EmptyContentProps & React.RefAttributes<HTMLDivElement>>;
    Actions: React.ForwardRefExoticComponent<EmptyActionsProps & React.RefAttributes<HTMLDivElement>>;
    Action: React.ForwardRefExoticComponent<EmptyActionsProps & React.RefAttributes<HTMLDivElement>>;
};
export { EmptyState, EmptyHeader, EmptyMedia, EmptyIcon, EmptyTitle, EmptyDescription, EmptyContent, EmptyActions, EmptyAction, emptyVariants, };
//# sourceMappingURL=empty.d.ts.map