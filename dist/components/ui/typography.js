import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                          
const typographyVariants = cva("", {
    variants: {
        variant: {
            h1: "cfui-typography-h1",
            h2: "cfui-typography-h2",
            h3: "cfui-typography-h3",
            h4: "cfui-typography-h4",
            p: "cfui-typography-p",
            lead: "cfui-typography-lead",
            large: "cfui-typography-large",
            small: "cfui-typography-small",
            muted: "cfui-typography-muted",
            code: "cfui-typography-code",
            blockquote: "cfui-typography-blockquote",
            "h1-r2": "cfui-typography-h1 cfui-typography-h1--r2",
            "h1-workers": "cfui-typography-h1 cfui-typography-h1--workers",
            "h2-measured": "cfui-typography-h2 cfui-typography-h2--measured",
            "h2-form": "cfui-typography-h2 cfui-typography-h2--form",
            "h3-measured": "cfui-typography-h3 cfui-typography-h3--measured",
        },
    },
    defaultVariants: {
        variant: "p",
    },
});
const defaultElementMap = {
    h1: "h1",
    "h1-r2": "h1",
    "h1-workers": "h1",
    h2: "h2",
    "h2-measured": "h2",
    "h2-form": "h2",
    h3: "h3",
    "h3-measured": "h3",
    h4: "h4",
    p: "p",
    lead: "p",
    large: "div",
    small: "small",
    muted: "p",
    code: "code",
    blockquote: "blockquote",
};
const TypographyRoot = React.forwardRef(({ className, variant = "p", asChild = false, ...props }, ref) => {
    const Tag = (asChild ? Slot : defaultElementMap[variant ?? "p"] || "div");
    return (_jsx(Tag, { ref: ref, className: cn(typographyVariants({ variant }), className), ...props }));
});
TypographyRoot.displayName = "Typography";
export const TypographyH1 = React.forwardRef(({ className, appearance = "inferred", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h1";
    return (_jsx(Comp, { ref: ref, "data-appearance": appearance, className: cn("cfui-typography-h1", appearance === "r2" && "cfui-typography-h1--r2", appearance === "workers" && "cfui-typography-h1--workers", className), ...props }));
});
TypographyH1.displayName = "TypographyH1";
export const TypographyH2 = React.forwardRef(({ className, appearance = "inferred", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h2";
    return (_jsx(Comp, { ref: ref, "data-appearance": appearance, className: cn("cfui-typography-h2", appearance === "measured" && "cfui-typography-h2--measured", appearance === "form" && "cfui-typography-h2--form", className), ...props }));
});
TypographyH2.displayName = "TypographyH2";
export const TypographyH3 = React.forwardRef(({ className, appearance = "inferred", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";
    return (_jsx(Comp, { ref: ref, "data-appearance": appearance, className: cn("cfui-typography-h3", appearance === "measured" && "cfui-typography-h3--measured", className), ...props }));
});
TypographyH3.displayName = "TypographyH3";
export const TypographyH4 = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h4";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-h4", className), ...props }));
});
TypographyH4.displayName = "TypographyH4";
export const TypographyP = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-p", className), ...props }));
});
TypographyP.displayName = "TypographyP";
export const TypographyLead = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-lead", className), ...props }));
});
TypographyLead.displayName = "TypographyLead";
export const TypographyLarge = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-large", className), ...props }));
});
TypographyLarge.displayName = "TypographyLarge";
export const TypographySmall = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "small";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-small", className), ...props }));
});
TypographySmall.displayName = "TypographySmall";
export const TypographyMuted = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-muted", className), ...props }));
});
TypographyMuted.displayName = "TypographyMuted";
export const TypographyInlineCode = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "code";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-code", className), ...props }));
});
TypographyInlineCode.displayName = "TypographyInlineCode";
export const TypographyBlockquote = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "blockquote";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-blockquote", className), ...props }));
});
TypographyBlockquote.displayName = "TypographyBlockquote";
export const TypographyList = React.forwardRef(({ className, ordered = false, asChild = false, ...props }, ref) => {
    if (asChild) {
        return (_jsx(Slot, { ref: ref, className: cn("cfui-typography-list", ordered && "cfui-typography-list--ordered", className), ...props }));
    }
    if (ordered) {
        return (_jsx("ol", { ref: ref, className: cn("cfui-typography-list cfui-typography-list--ordered", className), ...props }));
    }
    return (_jsx("ul", { ref: ref, className: cn("cfui-typography-list", className), ...props }));
});
TypographyList.displayName = "TypographyList";
export const TypographyListItem = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "li";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-typography-list-item", className), ...props }));
});
TypographyListItem.displayName = "TypographyListItem";
// Short aliases
export const H1 = TypographyH1;
export const H2 = TypographyH2;
export const H3 = TypographyH3;
export const H4 = TypographyH4;
export const P = TypographyP;
export const Lead = TypographyLead;
export const Large = TypographyLarge;
export const Small = TypographySmall;
export const Muted = TypographyMuted;
export const InlineCode = TypographyInlineCode;
export const Blockquote = TypographyBlockquote;
export const List = TypographyList;
export const ListItem = TypographyListItem;
// Attach compounds to Typography root
export const Typography = Object.assign(TypographyRoot, {
    H1: TypographyH1,
    H2: TypographyH2,
    H3: TypographyH3,
    H4: TypographyH4,
    P: TypographyP,
    Lead: TypographyLead,
    Large: TypographyLarge,
    Small: TypographySmall,
    Muted: TypographyMuted,
    Code: TypographyInlineCode,
    InlineCode: TypographyInlineCode,
    Blockquote: TypographyBlockquote,
    List: TypographyList,
    ListItem: TypographyListItem,
});
export { typographyVariants, TypographyRoot };
//# sourceMappingURL=typography.js.map