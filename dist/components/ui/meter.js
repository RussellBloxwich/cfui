import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                     
const MeterContext = React.createContext(null);
export function useMeterContext() {
    const context = React.useContext(MeterContext);
    if (!context) {
        throw new Error("Meter compound components must be used within a Meter");
    }
    return context;
}
function resolveVariant(explicitVariant, value, low, high, optimum) {
    if (explicitVariant)
        return explicitVariant;
    if (low !== undefined && high !== undefined) {
        if (optimum !== undefined) {
            if (optimum >= high) {
                if (value >= high)
                    return "success";
                if (value >= low)
                    return "warning";
                return "danger";
            }
            else if (optimum <= low) {
                if (value <= low)
                    return "success";
                if (value <= high)
                    return "warning";
                return "danger";
            }
        }
        if (value > high)
            return "danger";
        if (value > low)
            return "warning";
        return "success";
    }
    return "brand";
}
export const Meter = React.forwardRef(({ className, value, min = 0, max = 100, low, high, optimum, variant: explicitVariant, size = "md", label, formatValue = (val) => `${Math.round(val)}%`, showValue = true, asChild = false, children, ...props }, ref) => {
    const clampedValue = Math.min(Math.max(value, min), max);
    const range = max - min;
    const percentage = range > 0 ? ((clampedValue - min) / range) * 100 : 0;
    const variant = resolveVariant(explicitVariant, clampedValue, low, high, optimum);
    const contextValue = React.useMemo(() => ({
        value: clampedValue,
        min,
        max,
        percentage,
        variant,
        size,
        low,
        high,
        optimum,
    }), [clampedValue, min, max, percentage, variant, size, low, high, optimum]);
    const Comp = asChild ? Slot : "div";
    return (_jsx(MeterContext.Provider, { value: contextValue, children: _jsx(Comp, { ref: ref, role: "meter", "aria-valuenow": clampedValue, "aria-valuemin": min, "aria-valuemax": max, "aria-valuetext": typeof formatValue === "function"
                ? String(formatValue(clampedValue, min, max))
                : `${clampedValue}`, className: cn("cfui-meter", className), ...props, children: children ? (children) : (_jsxs(_Fragment, { children: [(label || showValue) && (_jsxs("div", { className: "cfui-meter-header", children: [label && _jsx(MeterLabel, { children: label }), showValue && (_jsx(MeterValue, { children: formatValue(clampedValue, min, max) }))] })), _jsx(MeterTrack, { children: _jsx(MeterIndicator, {}) }), _jsx("meter", { className: "cfui-meter-native-sr-only", value: clampedValue, min: min, max: max, low: low, high: high, optimum: optimum })] })) }) }));
});
Meter.displayName = "Meter";
export const MeterLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-meter-label", className), ...props }));
});
MeterLabel.displayName = "MeterLabel";
export const MeterValue = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
    const { value, min, max } = useMeterContext();
    const Comp = asChild ? Slot : "span";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-meter-value", className), ...props, children: children ?? `${Math.round(((value - min) / (max - min || 1)) * 100)}%` }));
});
MeterValue.displayName = "MeterValue";
export const MeterTrack = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
    const { size } = useMeterContext();
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-meter-track", `cfui-meter-track--${size}`, className), ...props, children: children ?? _jsx(MeterIndicator, {}) }));
});
MeterTrack.displayName = "MeterTrack";
export const MeterIndicator = React.forwardRef(({ className, asChild = false, style, ...props }, ref) => {
    const { percentage, variant } = useMeterContext();
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, style: { width: `${percentage}%`, ...style }, className: cn("cfui-meter-indicator", `cfui-meter-indicator--${variant}`, className), ...props }));
});
MeterIndicator.displayName = "MeterIndicator";
//# sourceMappingURL=meter.js.map