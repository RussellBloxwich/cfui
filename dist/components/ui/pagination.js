import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { CaretLeftIcon, CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                          
const Pagination = ({ className, ...props }) => (_jsx("nav", { role: "navigation", "aria-label": "pagination", className: cn("cfui-pagination", className), ...props }));
Pagination.displayName = "Pagination";
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (_jsx("ul", { ref: ref, className: cn("cfui-pagination-content", className), ...props })));
PaginationContent.displayName = "PaginationContent";
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (_jsx("li", { ref: ref, className: cn("cfui-pagination-item", className), ...props })));
PaginationItem.displayName = "PaginationItem";
const PaginationLink = React.forwardRef(({ className, isActive, size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (_jsx(Comp, { ref: ref, "aria-current": isActive ? "page" : undefined, className: cn("cfui-pagination-link", isActive && "cfui-pagination-link--active", size === "sm" && "cfui-pagination-link--sm", size === "icon" && "cfui-pagination-link--icon", className), ...props }));
});
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = React.forwardRef(({ className, children, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
        const child = children;
        return (_jsx(PaginationLink, { ref: ref, asChild: true, "aria-label": "Go to previous page", size: "default", className: cn("cfui-pagination-previous", className), ...props, children: React.cloneElement(child, {
                ...child.props,
                className: cn(child.props.className),
            }, _jsxs(_Fragment, { children: [_jsx(CaretLeftIcon, { size: 16, weight: "bold" }), _jsx("span", { children: child.props.children ?? "Previous" })] })) }));
    }
    return (_jsxs(PaginationLink, { ref: ref, asChild: asChild, "aria-label": "Go to previous page", size: "default", className: cn("cfui-pagination-previous", className), ...props, children: [_jsx(CaretLeftIcon, { size: 16, weight: "bold" }), _jsx("span", { children: children ?? "Previous" })] }));
});
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = React.forwardRef(({ className, children, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
        const child = children;
        return (_jsx(PaginationLink, { ref: ref, asChild: true, "aria-label": "Go to next page", size: "default", className: cn("cfui-pagination-next", className), ...props, children: React.cloneElement(child, {
                ...child.props,
                className: cn(child.props.className),
            }, _jsxs(_Fragment, { children: [_jsx("span", { children: child.props.children ?? "Next" }), _jsx(CaretRightIcon, { size: 16, weight: "bold" })] })) }));
    }
    return (_jsxs(PaginationLink, { ref: ref, asChild: asChild, "aria-label": "Go to next page", size: "default", className: cn("cfui-pagination-next", className), ...props, children: [_jsx("span", { children: children ?? "Next" }), _jsx(CaretRightIcon, { size: 16, weight: "bold" })] }));
});
PaginationNext.displayName = "PaginationNext";
const PaginationEllipsis = ({ className, ...props }) => (_jsxs("span", { "aria-hidden": "true", className: cn("cfui-pagination-ellipsis", className), ...props, children: [_jsx(DotsThreeIcon, { size: 16, weight: "bold", className: "cfui-pagination-ellipsis-icon" }), _jsx("span", { className: "sr-only", style: {
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                borderWidth: 0,
            }, children: "More pages" })] }));
PaginationEllipsis.displayName = "PaginationEllipsis";
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, };
//# sourceMappingURL=pagination.js.map