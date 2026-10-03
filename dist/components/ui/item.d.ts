import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                    
declare const itemVariants: (props?: ({
    variant?: "default" | "danger" | null | undefined;
    size?: "sm" | "lg" | "md" | null | undefined;
    interactive?: boolean | null | undefined;
    selected?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof itemVariants> {
    asChild?: boolean;
    selected?: boolean;
    disabled?: boolean;
    interactive?: boolean;
    leading?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    trailing?: React.ReactNode;
}
export interface ItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemGroup: React.ForwardRefExoticComponent<ItemGroupProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemSeparator: React.ForwardRefExoticComponent<ItemSeparatorProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemHeader: React.ForwardRefExoticComponent<ItemHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemFooter: React.ForwardRefExoticComponent<ItemFooterProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemMedia: React.ForwardRefExoticComponent<ItemMediaProps & React.RefAttributes<HTMLDivElement>>;
declare const ItemLeading: React.ForwardRefExoticComponent<ItemMediaProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemContent: React.ForwardRefExoticComponent<ItemContentProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemTitle: React.ForwardRefExoticComponent<ItemTitleProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemDescription: React.ForwardRefExoticComponent<ItemDescriptionProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemTrailingProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemTrailing: React.ForwardRefExoticComponent<ItemTrailingProps & React.RefAttributes<HTMLDivElement>>;
declare const ItemAction: React.ForwardRefExoticComponent<ItemTrailingProps & React.RefAttributes<HTMLDivElement>>;
export interface ItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const ItemActions: React.ForwardRefExoticComponent<ItemActionsProps & React.RefAttributes<HTMLDivElement>>;
export declare const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<HTMLDivElement>> & {
    Group: React.ForwardRefExoticComponent<ItemGroupProps & React.RefAttributes<HTMLDivElement>>;
    Separator: React.ForwardRefExoticComponent<ItemSeparatorProps & React.RefAttributes<HTMLDivElement>>;
    Header: React.ForwardRefExoticComponent<ItemHeaderProps & React.RefAttributes<HTMLDivElement>>;
    Footer: React.ForwardRefExoticComponent<ItemFooterProps & React.RefAttributes<HTMLDivElement>>;
    Media: React.ForwardRefExoticComponent<ItemMediaProps & React.RefAttributes<HTMLDivElement>>;
    Leading: React.ForwardRefExoticComponent<ItemMediaProps & React.RefAttributes<HTMLDivElement>>;
    Content: React.ForwardRefExoticComponent<ItemContentProps & React.RefAttributes<HTMLDivElement>>;
    Title: React.ForwardRefExoticComponent<ItemTitleProps & React.RefAttributes<HTMLDivElement>>;
    Description: React.ForwardRefExoticComponent<ItemDescriptionProps & React.RefAttributes<HTMLDivElement>>;
    Trailing: React.ForwardRefExoticComponent<ItemTrailingProps & React.RefAttributes<HTMLDivElement>>;
    Actions: React.ForwardRefExoticComponent<ItemActionsProps & React.RefAttributes<HTMLDivElement>>;
    Action: React.ForwardRefExoticComponent<ItemTrailingProps & React.RefAttributes<HTMLDivElement>>;
};
export { ItemGroup, ItemSeparator, ItemHeader, ItemFooter, ItemMedia, ItemLeading, ItemContent, ItemTitle, ItemDescription, ItemTrailing, ItemActions, ItemAction, itemVariants, };
//# sourceMappingURL=item.d.ts.map