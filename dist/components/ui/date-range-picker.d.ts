import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type Locale } from "date-fns";
import type { DateRange } from "react-day-picker";
import { type CalendarProps } from "./calendar.js";
                                 
export type { DateRange };
export type DateRangePickerCalendarProps = Omit<CalendarProps, "mode" | "selected" | "onSelect" | "required">;
export interface DateRangePreset {
    label: string;
    range: DateRange;
}
export interface DateRangePickerProps {
    value?: DateRange;
    defaultValue?: DateRange;
    onValueChange?: (range: DateRange | undefined) => void;
    onChange?: (range: DateRange | undefined) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    disabledDates?: CalendarProps["disabled"];
    placeholder?: string;
    formatStr?: string;
    locale?: Locale;
    clearable?: boolean;
    numberOfMonths?: number;
    presets?: DateRangePreset[] | boolean;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    calendarProps?: DateRangePickerCalendarProps;
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: React.ReactNode;
    id?: string;
    "aria-label"?: string;
}
export interface DateRangePickerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export interface DateRangePickerContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
    calendarProps?: DateRangePickerCalendarProps;
}
/**
 * Trigger button for DateRangePicker.
 */
declare const DateRangePickerTrigger: React.ForwardRefExoticComponent<DateRangePickerTriggerProps & React.RefAttributes<HTMLButtonElement>>;
/**
 * Popover content container for DateRangePicker, rendering Calendar with range selection and optional presets.
 */
declare const DateRangePickerContent: React.ForwardRefExoticComponent<DateRangePickerContentProps & React.RefAttributes<HTMLDivElement>>;
/**
 * DateRangePicker component for CFUI.
 * Composes Radix Popover and Calendar with controlled/uncontrolled range state,
 * formatting, presets, clear button, and accessible keyboard navigation.
 */
declare const DateRangePicker: React.ForwardRefExoticComponent<DateRangePickerProps & React.RefAttributes<HTMLDivElement>>;
export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent };
//# sourceMappingURL=date-range-picker.d.ts.map