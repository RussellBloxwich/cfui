"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format, subDays, startOfMonth } from "date-fns";
import { CalendarBlankIcon, CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { Calendar } from "./calendar.js";
                                 
const DateRangePickerContext = React.createContext(null);
function useDateRangePickerContext() {
    const context = React.useContext(DateRangePickerContext);
    if (!context) {
        throw new Error("DateRangePicker compound components must be used within <DateRangePicker />");
    }
    return context;
}
function getDefaultPresets() {
    const now = new Date();
    return [
        {
            label: "Today",
            range: { from: now, to: now },
        },
        {
            label: "Last 7 days",
            range: { from: subDays(now, 6), to: now },
        },
        {
            label: "Last 30 days",
            range: { from: subDays(now, 29), to: now },
        },
        {
            label: "Month to date",
            range: { from: startOfMonth(now), to: now },
        },
    ];
}
/**
 * Trigger button for DateRangePicker.
 */
const DateRangePickerTrigger = React.forwardRef(({ className, children, asChild = false, onClick, ...props }, ref) => {
    const { value, setValue, open, disabled, locale, formatStr, placeholder, clearable, } = useDateRangePickerContext();
    const handleClear = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (disabled)
            return;
        setValue(undefined);
    };
    if (asChild) {
        return (_jsx(PopoverPrimitive.Trigger, { asChild: true, ref: ref, ...props, children: React.isValidElement(children)
                ? React.cloneElement(children, {
                    disabled: disabled ||
                        children.props.disabled,
                    "aria-disabled": disabled ||
                        children.props["aria-disabled"],
                })
                : children }));
    }
    let formattedValue = null;
    if (value?.from) {
        if (value.to) {
            formattedValue = `${format(value.from, formatStr, { locale })} – ${format(value.to, formatStr, { locale })}`;
        }
        else {
            formattedValue = `${format(value.from, formatStr, { locale })} – ...`;
        }
    }
    return (_jsx(PopoverPrimitive.Trigger, { asChild: true, children: _jsxs("button", { ref: ref, type: "button", disabled: disabled, "aria-haspopup": "dialog", "aria-expanded": open, onClick: onClick, className: cn("cfui-date-range-picker-trigger", !formattedValue && "cfui-date-range-picker-trigger-placeholder", className), ...props, children: [_jsxs("div", { className: "cfui-date-range-picker-trigger-label", children: [_jsx(CalendarBlankIcon, { className: "cfui-date-range-picker-icon" }), _jsx("span", { children: formattedValue || placeholder })] }), _jsxs("div", { className: "cfui-date-range-picker-actions", children: [clearable && (value?.from || value?.to) && !disabled && (_jsx("span", { role: "button", tabIndex: 0, "aria-label": "Clear date range", onClick: handleClear, onKeyDown: (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleClear(e);
                                }
                            }, className: "cfui-date-range-picker-clear-button", children: _jsx(XIcon, { className: "cfui-date-range-picker-clear-icon" }) })), _jsx(CaretDownIcon, { className: cn("cfui-date-range-picker-caret", open && "cfui-date-range-picker-caret-open") })] })] }) }));
});
DateRangePickerTrigger.displayName = "DateRangePickerTrigger";
/**
 * Popover content container for DateRangePicker, rendering Calendar with range selection and optional presets.
 */
const DateRangePickerContent = React.forwardRef(({ className, align = "start", sideOffset = 4, calendarProps, ...props }, ref) => {
    const { value, setValue, numberOfMonths, presets, disabledDates, calendarProps: ctxCalProps, } = useDateRangePickerContext();
    const handleSelect = (range) => {
        setValue(range);
    };
    const presetItems = React.useMemo(() => {
        if (!presets)
            return null;
        if (Array.isArray(presets))
            return presets;
        return getDefaultPresets();
    }, [presets]);
    return (_jsx(PopoverPrimitive.Portal, { children: _jsxs(PopoverPrimitive.Content, { ref: ref, align: align, sideOffset: sideOffset, className: cn("cfui-date-range-picker-content", className), ...props, children: [presetItems && presetItems.length > 0 && (_jsx("div", { className: "cfui-date-range-picker-presets", children: presetItems.map((preset) => (_jsx("button", { type: "button", onClick: () => setValue(preset.range), className: "cfui-date-range-picker-preset-button", children: preset.label }, preset.label))) })), _jsx(Calendar, { numberOfMonths: numberOfMonths, initialFocus: true, ...ctxCalProps, ...calendarProps, mode: "range", selected: value, onSelect: handleSelect, disabled: disabledDates ?? calendarProps?.disabled ?? ctxCalProps?.disabled })] }) }));
});
DateRangePickerContent.displayName = "DateRangePickerContent";
/**
 * DateRangePicker component for CFUI.
 * Composes Radix Popover and Calendar with controlled/uncontrolled range state,
 * formatting, presets, clear button, and accessible keyboard navigation.
 */
const DateRangePicker = React.forwardRef(({ value: controlledValue, defaultValue, onValueChange, onChange, open: controlledOpen, defaultOpen = false, onOpenChange, disabled = false, disabledDates, placeholder = "Select date range", formatStr = "MMM d, yyyy", locale, clearable = true, numberOfMonths = 2, presets, className, triggerClassName, contentClassName, calendarProps, align = "start", sideOffset = 4, children, id, "aria-label": ariaLabel, }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlledOpen = controlledOpen !== undefined;
    const open = isControlledOpen ? controlledOpen : uncontrolledOpen;
    const handleValueChange = React.useCallback((nextRange) => {
        if (!isControlled) {
            setUncontrolledValue(nextRange);
        }
        onValueChange?.(nextRange);
        onChange?.(nextRange);
    }, [isControlled, onValueChange, onChange]);
    const handleOpenChange = React.useCallback((nextOpen) => {
        if (disabled)
            return;
        if (!isControlledOpen) {
            setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    }, [disabled, isControlledOpen, onOpenChange]);
    const contextValue = React.useMemo(() => ({
        value,
        setValue: handleValueChange,
        open: disabled ? false : open,
        setOpen: handleOpenChange,
        disabled,
        locale,
        formatStr,
        placeholder,
        clearable,
        numberOfMonths,
        presets,
        disabledDates,
        calendarProps,
    }), [
        value,
        handleValueChange,
        open,
        handleOpenChange,
        disabled,
        locale,
        formatStr,
        placeholder,
        clearable,
        numberOfMonths,
        presets,
        disabledDates,
        calendarProps,
    ]);
    return (_jsx(DateRangePickerContext.Provider, { value: contextValue, children: _jsx("div", { ref: ref, className: cn("cfui-date-range-picker", className), children: _jsx(PopoverPrimitive.Root, { open: disabled ? false : open, onOpenChange: handleOpenChange, children: children ? (children) : (_jsxs(_Fragment, { children: [_jsx(DateRangePickerTrigger, { id: id, "aria-label": ariaLabel, className: triggerClassName }), _jsx(DateRangePickerContent, { align: align, sideOffset: sideOffset, className: contentClassName })] })) }) }) }));
});
DateRangePicker.displayName = "DateRangePicker";
export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent };
//# sourceMappingURL=date-range-picker.js.map