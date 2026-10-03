import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { MagnifyingGlassIcon, XCircleIcon, CircleNotchIcon, } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                            
const SearchField = React.forwardRef(({ className, value: controlledValue, defaultValue, onChange, onClear, loading = false, shortcut, sizeVariant = "default", disabled = false, error = false, placeholder = "Search...", id, name, required, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby, ...props }, ref) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
    const currentValue = isControlled ? controlledValue : uncontrolledValue;
    const hasValue = String(currentValue ?? "").length > 0;
    const inputRef = React.useRef(null);
    const handleRef = React.useCallback((node) => {
        inputRef.current = node;
        if (typeof ref === "function") {
            ref(node);
        }
        else if (ref) {
            ref.current = node;
        }
    }, [ref]);
    const handleChange = (e) => {
        if (!isControlled) {
            setUncontrolledValue(e.target.value);
        }
        onChange?.(e);
    };
    const handleClear = () => {
        // 1. Update internal value only when uncontrolled
        if (!isControlled) {
            setUncontrolledValue("");
        }
        // 2. Request clear through caller callbacks
        onClear?.();
        if (onChange) {
            let target;
            if (inputRef.current) {
                target = Object.create(inputRef.current, {
                    value: {
                        value: "",
                        writable: true,
                        configurable: true,
                        enumerable: true,
                    },
                });
            }
            else {
                target = { value: "", name, id };
            }
            const syntheticEvent = {
                target,
                currentTarget: target,
                type: "change",
                bubbles: true,
                cancelable: true,
                defaultPrevented: false,
                isTrusted: false,
                persist: () => { },
                preventDefault: () => { },
                stopPropagation: () => { },
                isDefaultPrevented: () => false,
                isPropagationStopped: () => false,
                nativeEvent: new Event("change"),
            };
            onChange(syntheticEvent);
        }
        // 3. Retain focus and native name/ref semantics
        inputRef.current?.focus();
    };
    const isInvalid = error || !!ariaInvalid;
    return (_jsxs("div", { "data-disabled": disabled ? "true" : undefined, "data-invalid": isInvalid ? "true" : undefined, className: cn("cfui-search-field", sizeVariant !== "default" && `cfui-search-field--${sizeVariant}`, disabled && "cfui-search-field--disabled", isInvalid && "cfui-search-field--error", className), children: [_jsx("span", { className: "cfui-search-field-icon", "aria-hidden": "true", children: _jsx(MagnifyingGlassIcon, { weight: "bold" }) }), _jsx("input", { ref: handleRef, type: "search", id: id, name: name, value: currentValue, disabled: disabled, required: required, "aria-invalid": isInvalid ? true : undefined, "aria-describedby": ariaDescribedby, placeholder: placeholder, onChange: handleChange, className: "cfui-search-field-input", ...props }), loading && (_jsx("span", { className: "cfui-search-field-spinner", "aria-label": "Loading", children: _jsx(CircleNotchIcon, { weight: "bold", className: "cfui-search-field-spin" }) })), !loading && hasValue && (_jsx("button", { type: "button", "aria-label": "Clear search", disabled: disabled, onClick: handleClear, className: "cfui-search-field-clear", children: _jsx(XCircleIcon, { weight: "fill" }) })), !loading && !hasValue && shortcut && (_jsx("kbd", { className: "cfui-search-field-shortcut", "aria-hidden": "true", children: shortcut }))] }));
});
SearchField.displayName = "SearchField";
const SearchFieldRoot = React.forwardRef(({ className, sizeVariant = "default", disabled, error, ...props }, ref) => (_jsx("div", { ref: ref, "data-disabled": disabled ? "true" : undefined, "data-invalid": error ? "true" : undefined, className: cn("cfui-search-field", sizeVariant !== "default" && `cfui-search-field--${sizeVariant}`, disabled && "cfui-search-field--disabled", error && "cfui-search-field--error", className), ...props })));
SearchFieldRoot.displayName = "SearchFieldRoot";
const SearchFieldInput = React.forwardRef(({ className, type = "search", ...props }, ref) => (_jsx("input", { ref: ref, type: type, className: cn("cfui-search-field-input", className), ...props })));
SearchFieldInput.displayName = "SearchFieldInput";
const SearchFieldClear = React.forwardRef(({ className, children, ...props }, ref) => (_jsx("button", { ref: ref, type: "button", className: cn("cfui-search-field-clear", className), ...props, children: children ?? _jsx(XCircleIcon, { weight: "fill" }) })));
SearchFieldClear.displayName = "SearchFieldClear";
const SearchFieldIcon = React.forwardRef(({ className, children, ...props }, ref) => (_jsx("span", { ref: ref, "aria-hidden": "true", className: cn("cfui-search-field-icon", className), ...props, children: children ?? _jsx(MagnifyingGlassIcon, { weight: "bold" }) })));
SearchFieldIcon.displayName = "SearchFieldIcon";
export { SearchField, SearchFieldRoot, SearchFieldInput, SearchFieldClear, SearchFieldIcon, };
//# sourceMappingURL=search-field.js.map