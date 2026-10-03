import * as React from "react";
                      
export type BubbleVariant = "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive";
export type BubbleAlign = "start" | "end";
interface BubbleContextValue {
    variant: BubbleVariant;
    align: BubbleAlign;
}
export declare function useBubbleContext(): BubbleContextValue;
export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BubbleVariant;
    align?: BubbleAlign;
    asChild?: boolean;
}
export declare const Bubble: React.ForwardRefExoticComponent<BubbleProps & React.RefAttributes<HTMLDivElement>>;
export interface BubbleContentProps extends React.HTMLAttributes<HTMLElement> {
    variant?: BubbleVariant;
    align?: BubbleAlign;
    asChild?: boolean;
    href?: string;
    type?: "button" | "submit" | "reset";
    render?: React.ReactElement<any> | ((props: React.HTMLAttributes<HTMLElement>, context: BubbleContextValue) => React.ReactNode);
}
export declare const BubbleContent: React.ForwardRefExoticComponent<BubbleContentProps & React.RefAttributes<HTMLElement>>;
export interface BubbleReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: "top" | "bottom";
    align?: "start" | "end";
    asChild?: boolean;
}
export declare const BubbleReactions: React.ForwardRefExoticComponent<BubbleReactionsProps & React.RefAttributes<HTMLDivElement>>;
export interface BubbleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: BubbleAlign;
    asChild?: boolean;
}
export declare const BubbleGroup: React.ForwardRefExoticComponent<BubbleGroupProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=bubble.d.ts.map