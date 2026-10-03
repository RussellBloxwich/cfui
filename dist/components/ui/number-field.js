import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                            
const NumberFieldContext = React.createContext(null);
export function useNumberFieldContext() {
    const context = React.useContext(NumberFieldContext);
    if (!context) {
        throw new Error("NumberField compound subcomponents must be used within NumberField");
    }
    return context;
}
function clamp(value, min, max) {
    let res = value;
    if (min !== undefined && res < min)
        res = min;
    if (max !== undefined && res > max)
        res = max;
    return res;
}
function roundToStep(value, step) {
    const precision = (step.toString().split(".")[1] || "").length;
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
}
export const NumberField = React.forwardRef(({ className, value: controlledValue, defaultValue = 0, onChange, min, max, step = 1, disabled = false, readOnly = false, label, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, children, ...props }, ref) => {
    const generatedId = React.useId();
    const labelId = ariaLabelledBy ?? (label ? `${generatedId}-label` : undefined);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(clamp(defaultValue, min, max));
    const value = controlledValue !== undefined
        ? clamp(controlledValue, min, max)
        : uncontrolledValue;
    const isControlled = controlledValue !== undefined;
    const updateValue = React.useCallback((newVal) => {
        if (disabled || readOnly)
            return;
        const rounded = roundToStep(clamp(newVal, min, max), step);
        if (controlledValue === undefined) {
            setUncontrolledValue(rounded);
        }
        onChange?.(rounded);
    }, [disabled, readOnly, controlledValue, min, max, step, onChange]);
    const increment = React.useCallback((factor = 1) => {
        if (disabled || readOnly)
            return;
        updateValue(value + step * factor);
    }, [disabled, readOnly, updateValue, value, step]);
    const decrement = React.useCallback((factor = 1) => {
        if (disabled || readOnly)
            return;
        updateValue(value - step * factor);
    }, [disabled, readOnly, updateValue, value, step]);
    const canIncrement = !disabled && !readOnly && (max === undefined || value < max);
    const canDecrement = !disabled && !readOnly && (min === undefined || value > min);
    return (_jsx(NumberFieldContext.Provider, { value: {
            value,
            isControlled,
            min,
            max,
            step,
            disabled,
            readOnly,
            increment,
            decrement,
            setValue: updateValue,
            canIncrement,
            canDecrement,
            labelId,
            ariaLabel,
            ariaLabelledBy,
        }, children: _jsx("div", { ref: ref, className: cn("cfui-number-field", className), ...props, children: children ? (children) : (_jsxs(_Fragment, { children: [label && (_jsx(NumberFieldLabel, { id: labelId, children: label })), _jsxs(NumberFieldGroup, { children: [_jsx(NumberFieldDecrement, {}), _jsx(NumberFieldInput, {}), _jsx(NumberFieldIncrement, {})] })] })) }) }));
});
NumberField.displayName = "NumberField";
export const NumberFieldLabel = React.forwardRef(({ className, ...props }, ref) => {
    const { labelId } = useNumberFieldContext();
    return (_jsx("label", { ref: ref, id: labelId, className: cn("cfui-number-field-label", className), ...props }));
});
NumberFieldLabel.displayName = "NumberFieldLabel";
export const NumberFieldGroup = React.forwardRef(({ className, ...props }, ref) => {
    const { disabled } = useNumberFieldContext();
    return (_jsx("div", { ref: ref, className: cn("cfui-number-field-group", disabled && "cfui-number-field-group--disabled", className), ...props }));
});
NumberFieldGroup.displayName = "NumberFieldGroup";
export const NumberFieldInput = React.forwardRef(({ className, onChange: onNumericChange, onNativeChange, onKeyDown, onBlur, ...restProps }, ref) => {
    const { value, isControlled, min, max, step, disabled, readOnly, setValue, increment, decrement, labelId, ariaLabel, ariaLabelledBy, } = useNumberFieldContext();
    const [textValue, setTextValue] = React.useState(String(value));
    const isDraftingRef = React.useRef(false);
    const lastEmittedValueRef = React.useRef(null);
    React.useEffect(() => {
        if (isDraftingRef.current &&
            lastEmittedValueRef.current !== null &&
            value === lastEmittedValueRef.current) {
            return;
        }
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        setTextValue(String(value));
    }, [value]);
    const commit = () => {
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        if (disabled || readOnly) {
            setTextValue(String(value));
            return;
        }
        const trimmed = textValue.trim();
        if (trimmed === "" || isNaN(Number(trimmed)) || isNaN(parseFloat(trimmed))) {
            setTextValue(String(value));
            return;
        }
        const parsed = parseFloat(trimmed);
        const bounded = roundToStep(clamp(parsed, min, max), step);
        setValue(bounded);
        if (!isControlled) {
            setTextValue(String(bounded));
        }
        else {
            setTextValue(String(value));
        }
    };
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled || readOnly)
            return;
        if (e.key === "ArrowUp") {
            e.preventDefault();
            isDraftingRef.current = false;
            lastEmittedValueRef.current = null;
            increment(1);
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            isDraftingRef.current = false;
            lastEmittedValueRef.current = null;
            decrement(1);
        }
        else if (e.key === "PageUp") {
            e.preventDefault();
            isDraftingRef.current = false;
            lastEmittedValueRef.current = null;
            increment(10);
        }
        else if (e.key === "PageDown") {
            e.preventDefault();
            isDraftingRef.current = false;
            lastEmittedValueRef.current = null;
            decrement(10);
        }
        else if (e.key === "Home" && min !== undefined) {
            e.preventDefault();
            isDraftingRef.current = false;
            lastEmittedValueRef.current = null;
            setValue(min);
        }
        else if (e.key === "End" && max !== undefined) {
            e.preventDefault();
            isDraftingRef.current = false;
            lastEmittedValueRef.current = null;
            setValue(max);
        }
        else if (e.key === "Enter") {
            commit();
        }
        else if (e.key === "Escape") {
            isDraftingRef.current = false;
            lastEmittedValueRef.current = null;
            setTextValue(String(value));
        }
    };
    const handleBlur = (e) => {
        onBlur?.(e);
        if (e.defaultPrevented)
            return;
        commit();
    };
    const handleChange = (e) => {
        onNativeChange?.(e);
        if (disabled || readOnly)
            return;
        const nextText = e.target.value;
        setTextValue(nextText);
        isDraftingRef.current = true;
        const parsed = parseFloat(nextText);
        if (!isNaN(parsed)) {
            const clamped = roundToStep(clamp(parsed, min, max), step);
            lastEmittedValueRef.current = clamped;
            setValue(parsed);
            onNumericChange?.(parsed);
        }
        else {
            lastEmittedValueRef.current = null;
        }
    };
    return (_jsx("input", { ref: ref, type: "text", inputMode: "numeric", role: "spinbutton", "aria-valuenow": value, "aria-valuemin": min, "aria-valuemax": max, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy ?? labelId, disabled: disabled, readOnly: readOnly, value: textValue, onChange: handleChange, onKeyDown: handleKeyDown, onBlur: handleBlur, className: cn("cfui-number-field-input", className), ...restProps }));
});
NumberFieldInput.displayName = "NumberFieldInput";
export const NumberFieldDecrement = React.forwardRef(({ className, type = "button", onClick, children, ...props }, ref) => {
    const { decrement, canDecrement } = useNumberFieldContext();
    const handleClick = (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
            decrement(1);
        }
    };
    return (_jsx("button", { ref: ref, type: type, tabIndex: -1, disabled: !canDecrement, "aria-label": "Decrease value", onClick: handleClick, className: cn("cfui-number-field-decrement", className), ...props, children: children ?? _jsx(MinusIcon, { size: 12, weight: "bold" }) }));
});
NumberFieldDecrement.displayName = "NumberFieldDecrement";
export const NumberFieldIncrement = React.forwardRef(({ className, type = "button", onClick, children, ...props }, ref) => {
    const { increment, canIncrement } = useNumberFieldContext();
    const handleClick = (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
            increment(1);
        }
    };
    return (_jsx("button", { ref: ref, type: type, tabIndex: -1, disabled: !canIncrement, "aria-label": "Increase value", onClick: handleClick, className: cn("cfui-number-field-increment", className), ...props, children: children ?? _jsx(PlusIcon, { size: 12, weight: "bold" }) }));
});
NumberFieldIncrement.displayName = "NumberFieldIncrement";
//# sourceMappingURL=number-field.js.map