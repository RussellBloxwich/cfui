import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
                         
export interface ResizablePanelGroupProps extends Omit<React.ComponentProps<typeof Group>, "orientation"> {
    orientation?: "horizontal" | "vertical";
    direction?: "horizontal" | "vertical";
}
declare const ResizablePanelGroup: React.ForwardRefExoticComponent<ResizablePanelGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const ResizablePanel: typeof Panel;
export interface ResizableHandleProps extends React.ComponentProps<typeof Separator> {
    withHandle?: boolean;
}
declare const ResizableHandle: React.ForwardRefExoticComponent<ResizableHandleProps & React.RefAttributes<HTMLDivElement>>;
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
//# sourceMappingURL=resizable.d.ts.map