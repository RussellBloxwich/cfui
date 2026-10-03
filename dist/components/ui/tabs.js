import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../utils.js";
                    
const TabsContext = React.createContext({
    size: "default",
    variant: "default",
});
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, size = "default", variant = "default", ...props }, ref) => (_jsx(TabsContext.Provider, { value: { size, variant }, children: _jsx(TabsPrimitive.List, { ref: ref, className: cn("cfui-tabs-list", size === "sm" && "cfui-tabs-list--sm", variant === "line" && "cfui-tabs-list--line", className), ...props }) })));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, size: propSize, variant: propVariant, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const size = propSize ?? context.size ?? "default";
    const variant = propVariant ?? context.variant ?? "default";
    return (_jsx(TabsPrimitive.Trigger, { ref: ref, className: cn("cfui-tabs-trigger", size === "sm" && "cfui-tabs-trigger--sm", variant === "line" && "cfui-tabs-trigger--line", className), ...props }));
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(TabsPrimitive.Content, { ref: ref, className: cn("cfui-tabs-content", className), ...props })));
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
//# sourceMappingURL=tabs.js.map