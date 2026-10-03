import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../utils.js";
import "./switch.css";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  sizeVariant?: "default" | "sm";
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, sizeVariant = "default", ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "cfui-switch",
      sizeVariant === "sm" && "cfui-switch--sm",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="cfui-switch-thumb" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

const SwitchThumb = SwitchPrimitive.Thumb;

export { Switch, SwitchThumb };
