import * as React from "react";
                       
export type SurfaceElevation = "base" | "elevated" | "recessed" | "canvas" | "overlay" | "interactive";
export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
    elevation?: SurfaceElevation;
    bordered?: boolean;
    asChild?: boolean;
}
export declare const Surface: React.ForwardRefExoticComponent<SurfaceProps & React.RefAttributes<HTMLDivElement>>;
export interface SurfaceHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const SurfaceHeader: React.ForwardRefExoticComponent<SurfaceHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface SurfaceTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
}
export declare const SurfaceTitle: React.ForwardRefExoticComponent<SurfaceTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface SurfaceDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    asChild?: boolean;
}
export declare const SurfaceDescription: React.ForwardRefExoticComponent<SurfaceDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface SurfaceContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const SurfaceContent: React.ForwardRefExoticComponent<SurfaceContentProps & React.RefAttributes<HTMLDivElement>>;
export declare const SurfaceBody: React.ForwardRefExoticComponent<SurfaceContentProps & React.RefAttributes<HTMLDivElement>>;
export interface SurfaceFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const SurfaceFooter: React.ForwardRefExoticComponent<SurfaceFooterProps & React.RefAttributes<HTMLDivElement>>;
export declare const LayerCard: React.ForwardRefExoticComponent<SurfaceProps & React.RefAttributes<HTMLDivElement>>;
export declare const LayerCardHeader: React.ForwardRefExoticComponent<SurfaceHeaderProps & React.RefAttributes<HTMLDivElement>>;
export declare const LayerCardTitle: React.ForwardRefExoticComponent<SurfaceTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export declare const LayerCardDescription: React.ForwardRefExoticComponent<SurfaceDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export declare const LayerCardContent: React.ForwardRefExoticComponent<SurfaceContentProps & React.RefAttributes<HTMLDivElement>>;
export declare const LayerCardBody: React.ForwardRefExoticComponent<SurfaceContentProps & React.RefAttributes<HTMLDivElement>>;
export declare const LayerCardFooter: React.ForwardRefExoticComponent<SurfaceFooterProps & React.RefAttributes<HTMLDivElement>>;
export type LayerCardProps = SurfaceProps;
export type LayerCardHeaderProps = SurfaceHeaderProps;
export type LayerCardTitleProps = SurfaceTitleProps;
export type LayerCardDescriptionProps = SurfaceDescriptionProps;
export type LayerCardContentProps = SurfaceContentProps;
export type LayerCardBodyProps = SurfaceContentProps;
export type LayerCardFooterProps = SurfaceFooterProps;
//# sourceMappingURL=surface.d.ts.map