import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../utils.js";
                           
const InputGroup = React.forwardRef(({ className, sizeVariant = "default", disabled = false, error = false, children, ...props }, ref) => {
    return (_jsx("div", { ref: ref, "data-disabled": disabled ? "true" : undefined, "data-invalid": error ? "true" : undefined, className: cn("cfui-input-group", sizeVariant !== "default" && `cfui-input-group--${sizeVariant}`, disabled && "cfui-input-group--disabled", error && "cfui-input-group--error", className), ...props, children: children }));
});
InputGroup.displayName = "InputGroup";
const InputGroupAddon = React.forwardRef(({ className, align, placement, children, ...props }, ref) => {
    const resolvedAlign = align ??
        (placement === "prefix"
            ? "inline-start"
            : placement === "suffix"
                ? "inline-end"
                : placement === "inline"
                    ? "inline"
                    : "inline-start");
    return (_jsx("div", { ref: ref, "data-align": resolvedAlign, className: cn("cfui-input-group-addon", `cfui-input-group-addon--${resolvedAlign}`, placement && `cfui-input-group-addon--${placement}`, className), ...props, children: children }));
});
InputGroupAddon.displayName = "InputGroupAddon";
const InputGroupText = React.forwardRef(({ className, children, ...props }, ref) => {
    return (_jsx("span", { ref: ref, className: cn("cfui-input-group-text", className), ...props, children: children }));
});
InputGroupText.displayName = "InputGroupText";
const InputGroupInput = React.forwardRef(({ className, type = "text", ...props }, ref) => {
    return (_jsx("input", { type: type, ref: ref, className: cn("cfui-input-group-input", className), ...props }));
});
InputGroupInput.displayName = "InputGroupInput";
const InputGroupButton = React.forwardRef(({ className, type = "button", disabled, sizeVariant, ...props }, ref) => {
    return (_jsx("button", { ref: ref, type: type, disabled: disabled, className: cn("cfui-input-group-button", sizeVariant && `cfui-input-group-button--${sizeVariant}`, className), ...props }));
});
InputGroupButton.displayName = "InputGroupButton";
const InputGroupTextarea = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("textarea", { ref: ref, className: cn("cfui-input-group-textarea", className), ...props }));
});
InputGroupTextarea.displayName = "InputGroupTextarea";
export { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput, InputGroupButton, InputGroupTextarea, };
//# sourceMappingURL=input-group.js.map