import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
                    
type TabsSize = "default" | "sm";
type TabsVariant = "default" | "line";
declare const Tabs: React.ForwardRefExoticComponent<TabsPrimitive.TabsProps & React.RefAttributes<HTMLDivElement>>;
declare const TabsList: React.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsListProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
    size?: TabsSize;
    variant?: TabsVariant;
} & React.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsTriggerProps & React.RefAttributes<HTMLButtonElement>, "ref"> & {
    size?: TabsSize;
    variant?: TabsVariant;
} & React.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsSize, TabsVariant };
//# sourceMappingURL=tabs.d.ts.map