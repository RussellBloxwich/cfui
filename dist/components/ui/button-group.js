import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../utils.js";
                            
export const ButtonGroupContext = React.createContext({});
export const useButtonGroup = () => React.useContext(ButtonGroupContext);
const ButtonGroup = React.forwardRef(({ className, orientation = "horizontal", attached = true, size, variant, children, role = "group", ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ size, variant, orientation, attached }), [size, variant, orientation, attached]);
    return (_jsx(ButtonGroupContext.Provider, { value: contextValue, children: _jsx("div", { ref: ref, role: role, "data-orientation": orientation, "data-attached": attached ? "true" : "false", className: cn("cfui-button-group", orientation === "vertical"
                ? "cfui-button-group--vertical"
                : "cfui-button-group--horizontal", attached && "cfui-button-group--attached", className), ...props, children: children }) }));
});
ButtonGroup.displayName = "ButtonGroup";
const ButtonGroupSeparator = React.forwardRef(({ className, orientation, ...props }, ref) => {
    const context = useButtonGroup();
    const resolvedOrientation = orientation ?? context.orientation ?? "horizontal";
    return (_jsx("div", { ref: ref, role: "separator", "aria-orientation": resolvedOrientation, className: cn("cfui-button-group__separator", resolvedOrientation === "vertical"
            ? "cfui-button-group__separator--vertical"
            : "cfui-button-group__separator--horizontal", className), ...props }));
});
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";
const ButtonGroupText = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("span", { ref: ref, className: cn("cfui-button-group__text", className), ...props }));
});
ButtonGroupText.displayName = "ButtonGroupText";
export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
//# sourceMappingURL=button-group.js.map