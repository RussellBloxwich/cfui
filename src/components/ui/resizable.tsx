import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "../../utils.js";
import "./resizable.css";

export interface ResizablePanelGroupProps
  extends Omit<React.ComponentProps<typeof Group>, "orientation"> {
  orientation?: "horizontal" | "vertical";
  direction?: "horizontal" | "vertical";
}

const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ className, orientation, direction, ...props }, ref) => {
  const resolvedOrientation = orientation ?? direction ?? "horizontal";
  return (
    <Group
      elementRef={ref}
      orientation={resolvedOrientation}
      className={cn(
        "cfui-resizable-group",
        resolvedOrientation === "vertical" && "cfui-resizable-group-vertical",
        className
      )}
      {...props}
    />
  );
});
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = Panel;

export interface ResizableHandleProps
  extends React.ComponentProps<typeof Separator> {
  withHandle?: boolean;
}

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  ResizableHandleProps
>(({ withHandle, className, ...props }, ref) => (
  <Separator
    elementRef={ref}
    className={cn("cfui-resizable-handle", className)}
    {...props}
  >
    {withHandle && (
      <div className="cfui-resizable-handle-icon-container">
        <svg
          className="cfui-resizable-handle-icon"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5" cy="4" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="11" cy="4" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="11" cy="12" r="1.5" />
        </svg>
      </div>
    )}
  </Separator>
));
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
