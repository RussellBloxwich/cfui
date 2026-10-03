import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                             
const NativeSelect = React.forwardRef(({ className, wrapperClassName, error = false, sizeVariant = "default", disabled = false, children, ...props }, ref) => {
    return (_jsxs("div", { "data-disabled": disabled ? "true" : undefined, "data-invalid": error ? "true" : undefined, className: cn("cfui-native-select-wrapper", sizeVariant !== "default" && `cfui-native-select-wrapper--${sizeVariant}`, disabled && "cfui-native-select-wrapper--disabled", error && "cfui-native-select-wrapper--error", wrapperClassName), children: [_jsx("select", { ref: ref, disabled: disabled, "data-invalid": error ? "true" : undefined, "aria-invalid": error ? true : props["aria-invalid"], className: cn("cfui-native-select", className), ...props, children: children }), _jsx("span", { className: "cfui-native-select-icon", "aria-hidden": "true", children: _jsx(CaretDownIcon, { weight: "bold" }) })] }));
});
NativeSelect.displayName = "NativeSelect";
const NativeSelectOption = React.forwardRef(({ className, ...props }, ref) => (_jsx("option", { ref: ref, className: cn("cfui-native-select-option", className), ...props })));
NativeSelectOption.displayName = "NativeSelectOption";
const NativeSelectOptGroup = React.forwardRef(({ className, ...props }, ref) => (_jsx("optgroup", { ref: ref, className: cn("cfui-native-select-optgroup", className), ...props })));
NativeSelectOptGroup.displayName = "NativeSelectOptGroup";
export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
//# sourceMappingURL=native-select.js.map