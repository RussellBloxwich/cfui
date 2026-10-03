import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                     
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (_jsx(DialogPrimitive.Overlay, { ref: ref, className: cn("cfui-sheet-overlay", className), ...props })));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva("cfui-sheet-content", {
    variants: {
        side: {
            top: "cfui-sheet-content-top",
            bottom: "cfui-sheet-content-bottom",
            left: "cfui-sheet-content-left",
            right: "cfui-sheet-content-right",
        },
    },
    defaultVariants: {
        side: "right",
    },
});
const SheetContent = React.forwardRef(({ side = "right", hideClose = false, className, children, ...props }, ref) => (_jsxs(SheetPortal, { children: [_jsx(SheetOverlay, {}), _jsxs(DialogPrimitive.Content, { ref: ref, className: cn(sheetVariants({ side }), className), ...props, children: [children, !hideClose && (_jsxs(DialogPrimitive.Close, { className: "cfui-sheet-close", "aria-label": "Close", children: [_jsx(XIcon, { className: "cfui-sheet-close-icon", "aria-hidden": "true" }), _jsx("span", { className: "cfui-sr-only", children: "Close" })] }))] })] })));
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => (_jsx("div", { className: cn("cfui-sheet-header", className), ...props }));
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({ className, ...props }) => (_jsx("div", { className: cn("cfui-sheet-footer", className), ...props }));
SheetFooter.displayName = "SheetFooter";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx(DialogPrimitive.Title, { ref: ref, className: cn("cfui-sheet-title", className), ...props })));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx(DialogPrimitive.Description, { ref: ref, className: cn("cfui-sheet-description", className), ...props })));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, sheetVariants, };
//# sourceMappingURL=sheet.js.map