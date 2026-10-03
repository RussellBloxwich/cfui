import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./surface.css";

export type SurfaceElevation =
  | "base"
  | "elevated"
  | "recessed"
  | "canvas"
  | "overlay"
  | "interactive";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: SurfaceElevation;
  bordered?: boolean;
  asChild?: boolean;
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      className,
      elevation = "base",
      bordered = true,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "cfui-surface",
          bordered && "cfui-surface--bordered",
          `cfui-surface--${elevation}`,
          className
        )}
        {...props}
      />
    );
  }
);
Surface.displayName = "Surface";

export interface SurfaceHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SurfaceHeader = React.forwardRef<HTMLDivElement, SurfaceHeaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-surface-header", className)}
        {...props}
      />
    );
  }
);
SurfaceHeader.displayName = "SurfaceHeader";

export interface SurfaceTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export const SurfaceTitle = React.forwardRef<HTMLHeadingElement, SurfaceTitleProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-surface-title", className)}
        {...props}
      />
    );
  }
);
SurfaceTitle.displayName = "SurfaceTitle";

export interface SurfaceDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export const SurfaceDescription = React.forwardRef<
  HTMLParagraphElement,
  SurfaceDescriptionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "p";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-surface-description", className)}
      {...props}
    />
  );
});
SurfaceDescription.displayName = "SurfaceDescription";

export interface SurfaceContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SurfaceContent = React.forwardRef<
  HTMLDivElement,
  SurfaceContentProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-surface-content", className)}
      {...props}
    />
  );
});
SurfaceContent.displayName = "SurfaceContent";

export const SurfaceBody = SurfaceContent;

export interface SurfaceFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SurfaceFooter = React.forwardRef<HTMLDivElement, SurfaceFooterProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-surface-footer", className)}
        {...props}
      />
    );
  }
);
SurfaceFooter.displayName = "SurfaceFooter";

/* LayerCard Aliases */
export const LayerCard = Surface;
export const LayerCardHeader = SurfaceHeader;
export const LayerCardTitle = SurfaceTitle;
export const LayerCardDescription = SurfaceDescription;
export const LayerCardContent = SurfaceContent;
export const LayerCardBody = SurfaceBody;
export const LayerCardFooter = SurfaceFooter;

export type LayerCardProps = SurfaceProps;
export type LayerCardHeaderProps = SurfaceHeaderProps;
export type LayerCardTitleProps = SurfaceTitleProps;
export type LayerCardDescriptionProps = SurfaceDescriptionProps;
export type LayerCardContentProps = SurfaceContentProps;
export type LayerCardBodyProps = SurfaceContentProps;
export type LayerCardFooterProps = SurfaceFooterProps;
