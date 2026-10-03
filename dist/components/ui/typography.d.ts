import * as React from "react";
import { type VariantProps } from "class-variance-authority";
                          
declare const typographyVariants: (props?: ({
    variant?: "small" | "h2" | "h3" | "p" | "blockquote" | "code" | "h1" | "h4" | "large" | "lead" | "muted" | "h1-r2" | "h1-workers" | "h2-measured" | "h2-form" | "h3-measured" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
    asChild?: boolean;
}
declare const TypographyRoot: React.ForwardRefExoticComponent<TypographyProps & React.RefAttributes<HTMLElement>>;
export interface TypographyH1Props extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
    appearance?: "inferred" | "r2" | "workers";
}
export declare const TypographyH1: React.ForwardRefExoticComponent<TypographyH1Props & React.RefAttributes<HTMLHeadingElement>>;
export interface TypographyH2Props extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
    appearance?: "inferred" | "measured" | "form";
}
export declare const TypographyH2: React.ForwardRefExoticComponent<TypographyH2Props & React.RefAttributes<HTMLHeadingElement>>;
export interface TypographyH3Props extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
    appearance?: "inferred" | "measured";
}
export declare const TypographyH3: React.ForwardRefExoticComponent<TypographyH3Props & React.RefAttributes<HTMLHeadingElement>>;
export declare const TypographyH4: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLHeadingElement>>;
export declare const TypographyP: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLParagraphElement>>;
export declare const TypographyLead: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLParagraphElement>>;
export declare const TypographyLarge: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLDivElement>>;
export declare const TypographySmall: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLElement>>;
export declare const TypographyMuted: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLParagraphElement>>;
export declare const TypographyInlineCode: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLElement>>;
export declare const TypographyBlockquote: React.ForwardRefExoticComponent<React.BlockquoteHTMLAttributes<HTMLQuoteElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLQuoteElement>>;
export interface TypographyListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
    ordered?: boolean;
    asChild?: boolean;
}
export declare const TypographyList: React.ForwardRefExoticComponent<TypographyListProps & React.RefAttributes<HTMLOListElement | HTMLUListElement>>;
export declare const TypographyListItem: React.ForwardRefExoticComponent<React.LiHTMLAttributes<HTMLLIElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLLIElement>>;
export declare const H1: React.ForwardRefExoticComponent<TypographyH1Props & React.RefAttributes<HTMLHeadingElement>>;
export declare const H2: React.ForwardRefExoticComponent<TypographyH2Props & React.RefAttributes<HTMLHeadingElement>>;
export declare const H3: React.ForwardRefExoticComponent<TypographyH3Props & React.RefAttributes<HTMLHeadingElement>>;
export declare const H4: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLHeadingElement>>;
export declare const P: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLParagraphElement>>;
export declare const Lead: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLParagraphElement>>;
export declare const Large: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLDivElement>>;
export declare const Small: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLElement>>;
export declare const Muted: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLParagraphElement>>;
export declare const InlineCode: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLElement>>;
export declare const Blockquote: React.ForwardRefExoticComponent<React.BlockquoteHTMLAttributes<HTMLQuoteElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLQuoteElement>>;
export declare const List: React.ForwardRefExoticComponent<TypographyListProps & React.RefAttributes<HTMLOListElement | HTMLUListElement>>;
export declare const ListItem: React.ForwardRefExoticComponent<React.LiHTMLAttributes<HTMLLIElement> & {
    asChild?: boolean;
} & React.RefAttributes<HTMLLIElement>>;
export declare const Typography: React.ForwardRefExoticComponent<TypographyProps & React.RefAttributes<HTMLElement>> & {
    H1: React.ForwardRefExoticComponent<TypographyH1Props & React.RefAttributes<HTMLHeadingElement>>;
    H2: React.ForwardRefExoticComponent<TypographyH2Props & React.RefAttributes<HTMLHeadingElement>>;
    H3: React.ForwardRefExoticComponent<TypographyH3Props & React.RefAttributes<HTMLHeadingElement>>;
    H4: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLHeadingElement>>;
    P: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLParagraphElement>>;
    Lead: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLParagraphElement>>;
    Large: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLDivElement>>;
    Small: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLElement>>;
    Muted: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLParagraphElement>>;
    Code: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLElement>>;
    InlineCode: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLElement>>;
    Blockquote: React.ForwardRefExoticComponent<React.BlockquoteHTMLAttributes<HTMLQuoteElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLQuoteElement>>;
    List: React.ForwardRefExoticComponent<TypographyListProps & React.RefAttributes<HTMLOListElement | HTMLUListElement>>;
    ListItem: React.ForwardRefExoticComponent<React.LiHTMLAttributes<HTMLLIElement> & {
        asChild?: boolean;
    } & React.RefAttributes<HTMLLIElement>>;
};
export { typographyVariants, TypographyRoot };
//# sourceMappingURL=typography.d.ts.map