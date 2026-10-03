import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../utils.js";
                      
const Switch = React.forwardRef(({ className, sizeVariant = "default", ...props }, ref) => (_jsx(SwitchPrimitive.Root, { ref: ref, className: cn("cfui-switch", sizeVariant === "sm" && "cfui-switch--sm", className), ...props, children: _jsx(SwitchPrimitive.Thumb, { className: "cfui-switch-thumb" }) })));
Switch.displayName = SwitchPrimitive.Root.displayName;
const SwitchThumb = SwitchPrimitive.Thumb;
export { Switch, SwitchThumb };
//# sourceMappingURL=switch.js.map