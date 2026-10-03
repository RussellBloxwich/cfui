import * as React from "react";
                                 
export interface TocItem {
    id: string;
    title: string;
    level?: number;
    href?: string;
    children?: TocItem[];
}
export interface TableOfContentsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    items?: TocItem[];
    activeId?: string;
    defaultActiveId?: string;
    onActiveIdChange?: (id: string) => void;
    onItemClick?: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
    title?: React.ReactNode;
    asChild?: boolean;
}
interface TocContextValue {
    activeId?: string;
    setActiveId: (id: string) => void;
    onItemClick?: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
}
export declare function useTocContext(): TocContextValue;
export declare const TableOfContents: React.ForwardRefExoticComponent<TableOfContentsProps & React.RefAttributes<HTMLElement>>;
export interface TableOfContentsTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
}
export declare const TableOfContentsTitle: React.ForwardRefExoticComponent<TableOfContentsTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export declare const TableOfContentsHeader: React.ForwardRefExoticComponent<TableOfContentsTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface TableOfContentsListProps extends React.HTMLAttributes<HTMLUListElement> {
    asChild?: boolean;
}
export declare const TableOfContentsList: React.ForwardRefExoticComponent<TableOfContentsListProps & React.RefAttributes<HTMLUListElement>>;
export interface TableOfContentsItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    level?: number;
    asChild?: boolean;
}
export declare const TableOfContentsItem: React.ForwardRefExoticComponent<TableOfContentsItemProps & React.RefAttributes<HTMLLIElement>>;
export interface TableOfContentsLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    id: string;
    level?: number;
    asChild?: boolean;
}
export declare const TableOfContentsLink: React.ForwardRefExoticComponent<TableOfContentsLinkProps & React.RefAttributes<HTMLAnchorElement>>;
export {};
//# sourceMappingURL=table-of-contents.d.ts.map