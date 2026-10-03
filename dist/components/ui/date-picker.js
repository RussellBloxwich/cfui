"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarBlankIcon, CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { Calendar } from "./calendar.js";
                           
const DatePickerContext = React.createContext(null);
function useDatePickerContext() {
    const context = React.useContext(DatePickerContext);
    if (!context) {
        throw new Error("DatePicker compound components must be used within <DatePicker />");
    }
    return context;
}
/**
 * Trigger button for DatePicker.
 */
const DatePickerTrigger = React.forwardRef(({ className, children, asChild = false, onClick, ...props }, ref) => {
    const { value, setValue, open, disabled, locale, formatStr, placeholder, clearable, } = useDatePickerContext();
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
    const formattedValue = value ? format(value, formatStr, { locale }) : null;
    return (_jsx(PopoverPrimitive.Trigger, { asChild: true, children: _jsxs("button", { ref: ref, type: "button", disabled: disabled, "aria-haspopup": "dialog", "aria-expanded": open, onClick: onClick, className: cn("cfui-date-picker-trigger", !formattedValue && "cfui-date-picker-trigger-placeholder", className), ...props, children: [_jsxs("div", { className: "cfui-date-picker-trigger-label", children: [_jsx(CalendarBlankIcon, { className: "cfui-date-picker-icon" }), _jsx("span", { children: formattedValue || placeholder })] }), _jsxs("div", { className: "cfui-date-picker-actions", children: [clearable && value && !disabled && (_jsx("span", { role: "button", tabIndex: 0, "aria-label": "Clear date", onClick: handleClear, onKeyDown: (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleClear(e);
                                }
                            }, className: "cfui-date-picker-clear-button", children: _jsx(XIcon, { className: "cfui-date-picker-clear-icon" }) })), _jsx(CaretDownIcon, { className: cn("cfui-date-picker-caret", open && "cfui-date-picker-caret-open") })] })] }) }));
});
DatePickerTrigger.displayName = "DatePickerTrigger";
/**
 * Popover content container for DatePicker, rendering Calendar inside.
 */
const DatePickerContent = React.forwardRef(({ className, align = "start", sideOffset = 4, calendarProps, ...props }, ref) => {
    const { value, setValue, setOpen, disabledDates, calendarProps: ctxCalProps } = useDatePickerContext();
    const handleSelect = (date) => {
        setValue(date);
        setOpen(false);
    };
    return (_jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Content, { ref: ref, align: align, sideOffset: sideOffset, className: cn("cfui-date-picker-content", className), ...props, children: _jsx(Calendar, { initialFocus: true, ...ctxCalProps, ...calendarProps, mode: "single", selected: value, onSelect: handleSelect, disabled: disabledDates ?? calendarProps?.disabled ?? ctxCalProps?.disabled }) }) }));
});
DatePickerContent.displayName = "DatePickerContent";
/**
 * DatePicker component for CFUI.
 * Composes Radix Popover and Calendar with controlled/uncontrolled state,
 * formatting, clear button, and accessible keyboard navigation.
 */
const DatePicker = React.forwardRef(({ value: controlledValue, defaultValue, onValueChange, onChange, open: controlledOpen, defaultOpen = false, onOpenChange, disabled = false, disabledDates, placeholder = "Select date", formatStr = "PPP", locale, clearable = true, className, triggerClassName, contentClassName, calendarProps, align = "start", sideOffset = 4, children, id, "aria-label": ariaLabel, }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlledOpen = controlledOpen !== undefined;
    const open = isControlledOpen ? controlledOpen : uncontrolledOpen;
    const handleValueChange = React.useCallback((nextDate) => {
        if (!isControlled) {
            setUncontrolledValue(nextDate);
        }
        onValueChange?.(nextDate);
        onChange?.(nextDate);
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
        disabledDates,
        calendarProps,
    ]);
    return (_jsx(DatePickerContext.Provider, { value: contextValue, children: _jsx("div", { ref: ref, className: cn("cfui-date-picker", className), children: _jsx(PopoverPrimitive.Root, { open: disabled ? false : open, onOpenChange: handleOpenChange, children: children ? (children) : (_jsxs(_Fragment, { children: [_jsx(DatePickerTrigger, { id: id, "aria-label": ariaLabel, className: triggerClassName }), _jsx(DatePickerContent, { align: align, sideOffset: sideOffset, className: contentClassName })] })) }) }) }));
});
DatePicker.displayName = "DatePicker";
export { DatePicker, DatePickerTrigger, DatePickerContent };
//# sourceMappingURL=date-picker.js.map