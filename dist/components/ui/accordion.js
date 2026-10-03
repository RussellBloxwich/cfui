import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                         
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (_jsx(AccordionPrimitive.Item, { ref: ref, className: cn("cfui-accordion-item", className), ...props })));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, hideChevron = false, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
        const child = children;
        return (_jsx(AccordionPrimitive.Header, { className: "cfui-accordion-header", children: _jsx(AccordionPrimitive.Trigger, { ref: ref, asChild: true, className: cn("cfui-accordion-trigger", className), ...props, children: React.cloneElement(child, {
                    ...child.props,
                    className: cn(child.props.className),
                }, _jsxs(_Fragment, { children: [child.props.children, !hideChevron && (_jsx(CaretDownIcon, { size: 16, weight: "bold", className: "cfui-accordion-chevron", "aria-hidden": "true" }))] })) }) }));
    }
    return (_jsx(AccordionPrimitive.Header, { className: "cfui-accordion-header", children: _jsxs(AccordionPrimitive.Trigger, { ref: ref, asChild: asChild, className: cn("cfui-accordion-trigger", className), ...props, children: [children, !hideChevron && (_jsx(CaretDownIcon, { size: 16, weight: "bold", className: "cfui-accordion-chevron", "aria-hidden": "true" }))] }) }));
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (_jsx(AccordionPrimitive.Content, { ref: ref, className: cn("cfui-accordion-content", className), ...props, children: _jsx("div", { className: "cfui-accordion-content-inner", children: children }) })));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
//# sourceMappingURL=accordion.js.map