import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../utils.js";
import "./tabs.css";

type TabsSize = "default" | "sm";
type TabsVariant = "default" | "line";

interface TabsContextValue {
  size?: TabsSize;
  variant?: TabsVariant;
}

const TabsContext = React.createContext<TabsContextValue>({
  size: "default",
  variant: "default",
});

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    size?: TabsSize;
    variant?: TabsVariant;
  }
>(({ className, size = "default", variant = "default", ...props }, ref) => (
  <TabsContext.Provider value={{ size, variant }}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "cfui-tabs-list",
        size === "sm" && "cfui-tabs-list--sm",
        variant === "line" && "cfui-tabs-list--line",
        className
      )}
      {...props}
    />
  </TabsContext.Provider>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    size?: TabsSize;
    variant?: TabsVariant;
  }
>(
  (
    { className, size: propSize, variant: propVariant, ...props },
    ref
  ) => {
    const context = React.useContext(TabsContext);
    const size = propSize ?? context.size ?? "default";
    const variant = propVariant ?? context.variant ?? "default";

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "cfui-tabs-trigger",
          size === "sm" && "cfui-tabs-trigger--sm",
          variant === "line" && "cfui-tabs-trigger--line",
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("cfui-tabs-content", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsSize, TabsVariant };
