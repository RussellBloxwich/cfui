import * as React from "react";
                       
export interface TopNavItemData {
    id?: string;
    label: React.ReactNode;
    href?: string;
    active?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    external?: boolean;
}
export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
    brand?: React.ReactNode;
    items?: TopNavItemData[];
    actions?: React.ReactNode;
    activeId?: string;
    onItemSelect?: (item: TopNavItemData, event: React.MouseEvent<HTMLElement>) => void;
    asChild?: boolean;
}
interface TopNavContextValue {
    activeId?: string;
    onItemSelect?: (item: TopNavItemData, event: React.MouseEvent<HTMLElement>) => void;
}
export declare function useTopNavContext(): TopNavContextValue | null;
export declare const TopNav: React.ForwardRefExoticComponent<TopNavProps & React.RefAttributes<HTMLElement>>;
export interface TopNavBrandProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const TopNavBrand: React.ForwardRefExoticComponent<TopNavBrandProps & React.RefAttributes<HTMLDivElement>>;
export declare const TopNavMasthead: React.ForwardRefExoticComponent<TopNavBrandProps & React.RefAttributes<HTMLDivElement>>;
export interface TopNavListProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
}
export declare const TopNavList: React.ForwardRefExoticComponent<TopNavListProps & React.RefAttributes<HTMLElement>>;
export interface TopNavItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> {
    active?: boolean;
    disabled?: boolean;
    asChild?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
export declare const TopNavItem: React.ForwardRefExoticComponent<TopNavItemProps & React.RefAttributes<HTMLElement>>;
export interface TopNavActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const TopNavActions: React.ForwardRefExoticComponent<TopNavActionsProps & React.RefAttributes<HTMLDivElement>>;
export declare const TopNavEnd: React.ForwardRefExoticComponent<TopNavActionsProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=top-nav.d.ts.map