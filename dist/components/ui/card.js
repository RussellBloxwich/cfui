import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                    
const cardVariants = cva("cfui-card", {
    variants: {
        variant: {
            default: "cfui-card--default",
            elevated: "cfui-card--elevated",
            recessed: "cfui-card--recessed",
            flat: "cfui-card--flat",
            interactive: "cfui-card--interactive",
        },
        density: {
            default: "",
            compact: "cfui-card--compact",
        },
    },
    defaultVariants: {
        variant: "default",
        density: "default",
    },
});
const CardRoot = React.forwardRef(({ className, variant, density, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn(cardVariants({ variant, density }), className), ...props }));
});
CardRoot.displayName = "Card";
const CardHeader = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-card-header", className), ...props }));
});
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-card-title", className), ...props }));
});
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-card-description", className), ...props }));
});
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-card-content", className), ...props }));
});
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-card-footer", className), ...props }));
});
CardFooter.displayName = "CardFooter";
const CardAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-card-action", className), ...props }));
});
CardAction.displayName = "CardAction";
export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Title: CardTitle,
    Description: CardDescription,
    Content: CardContent,
    Footer: CardFooter,
    Action: CardAction,
});
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction, cardVariants, };
//# sourceMappingURL=card.js.map