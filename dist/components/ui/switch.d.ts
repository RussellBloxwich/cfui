import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
                      
export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
    sizeVariant?: "default" | "sm";
}
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>;
declare const SwitchThumb: React.ForwardRefExoticComponent<SwitchPrimitive.SwitchThumbProps & React.RefAttributes<HTMLSpanElement>>;
export { Switch, SwitchThumb };
//# sourceMappingURL=switch.d.ts.map