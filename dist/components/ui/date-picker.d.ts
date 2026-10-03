import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type Locale } from "date-fns";
import { type CalendarProps } from "./calendar.js";
                           
export type DatePickerCalendarProps = Omit<CalendarProps, "mode" | "selected" | "onSelect" | "required">;
export interface DatePickerProps {
    value?: Date;
    defaultValue?: Date;
    onValueChange?: (date: Date | undefined) => void;
    onChange?: (date: Date | undefined) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    disabledDates?: CalendarProps["disabled"];
    placeholder?: string;
    formatStr?: string;
    locale?: Locale;
    clearable?: boolean;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    calendarProps?: DatePickerCalendarProps;
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: React.ReactNode;
    id?: string;
    "aria-label"?: string;
}
export interface DatePickerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export interface DatePickerContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
    calendarProps?: DatePickerCalendarProps;
}
/**
 * Trigger button for DatePicker.
 */
declare const DatePickerTrigger: React.ForwardRefExoticComponent<DatePickerTriggerProps & React.RefAttributes<HTMLButtonElement>>;
/**
 * Popover content container for DatePicker, rendering Calendar inside.
 */
declare const DatePickerContent: React.ForwardRefExoticComponent<DatePickerContentProps & React.RefAttributes<HTMLDivElement>>;
/**
 * DatePicker component for CFUI.
 * Composes Radix Popover and Calendar with controlled/uncontrolled state,
 * formatting, clear button, and accessible keyboard navigation.
 */
declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLDivElement>>;
export { DatePicker, DatePickerTrigger, DatePickerContent };
//# sourceMappingURL=date-picker.d.ts.map