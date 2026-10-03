import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "../../utils.js";
import { toggleVariants } from "./toggle.js";
                            
const ToggleGroupContext = React.createContext({
    variant: "default",
    size: "default",
});
const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (_jsx(ToggleGroupPrimitive.Root, { ref: ref, className: cn("cfui-toggle-group", props.orientation === "vertical"
        ? "cfui-toggle-group--vertical"
        : "cfui-toggle-group--horizontal", className), ...props, children: _jsx(ToggleGroupContext.Provider, { value: { variant, size }, children: children }) })));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    return (_jsx(ToggleGroupPrimitive.Item, { ref: ref, className: cn(toggleVariants({
            variant: variant ?? context.variant,
            size: size ?? context.size,
        }), "cfui-toggle-group-item", className), ...props, children: children }));
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
export { ToggleGroup, ToggleGroupItem };
//# sourceMappingURL=toggle-group.js.map