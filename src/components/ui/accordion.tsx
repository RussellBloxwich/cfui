import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./accordion.css";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("cfui-accordion-item", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    hideChevron?: boolean;
  }
>(({ className, children, hideChevron = false, asChild = false, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return (
      <AccordionPrimitive.Header className="cfui-accordion-header">
        <AccordionPrimitive.Trigger
          ref={ref}
          asChild
          className={cn("cfui-accordion-trigger", className)}
          {...props}
        >
          {React.cloneElement(
            child,
            {
              ...child.props,
              className: cn(child.props.className),
            },
            <>
              {child.props.children}
              {!hideChevron && (
                <CaretDownIcon
                  size={16}
                  weight="bold"
                  className="cfui-accordion-chevron"
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  }

  return (
    <AccordionPrimitive.Header className="cfui-accordion-header">
      <AccordionPrimitive.Trigger
        ref={ref}
        asChild={asChild}
        className={cn("cfui-accordion-trigger", className)}
        {...props}
      >
        {children}
        {!hideChevron && (
          <CaretDownIcon
            size={16}
            weight="bold"
            className="cfui-accordion-chevron"
            aria-hidden="true"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn("cfui-accordion-content", className)}
    {...props}
  >
    <div className="cfui-accordion-content-inner">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
