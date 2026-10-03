"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format, type Locale, subDays, startOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarBlankIcon, CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { Calendar, type CalendarProps } from "./calendar.js";
import "./date-range-picker.css";

export type { DateRange };

export type DateRangePickerCalendarProps = Omit<
  CalendarProps,
  "mode" | "selected" | "onSelect" | "required"
>;

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

interface DateRangePickerContextValue {
  value: DateRange | undefined;
  setValue: (range: DateRange | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  locale?: Locale;
  formatStr: string;
  placeholder: string;
  clearable: boolean;
  numberOfMonths: number;
  presets?: DateRangePreset[] | boolean;
  disabledDates?: CalendarProps["disabled"];
  calendarProps?: DateRangePickerCalendarProps;
}

const DateRangePickerContext = React.createContext<DateRangePickerContextValue | null>(null);

function useDateRangePickerContext() {
  const context = React.useContext(DateRangePickerContext);
  if (!context) {
    throw new Error(
      "DateRangePicker compound components must be used within <DateRangePicker />"
    );
  }
  return context;
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

export interface DateRangePickerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface DateRangePickerContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  calendarProps?: DateRangePickerCalendarProps;
}

function getDefaultPresets(): DateRangePreset[] {
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
const DateRangePickerTrigger = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerTriggerProps
>(({ className, children, asChild = false, onClick, ...props }, ref) => {
  const {
    value,
    setValue,
    open,
    disabled,
    locale,
    formatStr,
    placeholder,
    clearable,
  } = useDateRangePickerContext();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;
    setValue(undefined);
  };

  if (asChild) {
    return (
      <PopoverPrimitive.Trigger asChild ref={ref} {...props}>
        {React.isValidElement(children)
          ? React.cloneElement(
              children as React.ReactElement<{
                disabled?: boolean;
                "aria-disabled"?: boolean;
              }>,
              {
                disabled:
                  disabled ||
                  (children.props as { disabled?: boolean }).disabled,
                "aria-disabled":
                  disabled ||
                  (children.props as { "aria-disabled"?: boolean })[
                    "aria-disabled"
                  ],
              }
            )
          : children}
      </PopoverPrimitive.Trigger>
    );
  }

  let formattedValue: string | null = null;
  if (value?.from) {
    if (value.to) {
      formattedValue = `${format(value.from, formatStr, { locale })} – ${format(
        value.to,
        formatStr,
        { locale }
      )}`;
    } else {
      formattedValue = `${format(value.from, formatStr, { locale })} – ...`;
    }
  }

  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={onClick}
        className={cn(
          "cfui-date-range-picker-trigger",
          !formattedValue && "cfui-date-range-picker-trigger-placeholder",
          className
        )}
        {...props}
      >
        <div className="cfui-date-range-picker-trigger-label">
          <CalendarBlankIcon className="cfui-date-range-picker-icon" />
          <span>{formattedValue || placeholder}</span>
        </div>

        <div className="cfui-date-range-picker-actions">
          {clearable && (value?.from || value?.to) && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear date range"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              className="cfui-date-range-picker-clear-button"
            >
              <XIcon className="cfui-date-range-picker-clear-icon" />
            </span>
          )}
          <CaretDownIcon
            className={cn(
              "cfui-date-range-picker-caret",
              open && "cfui-date-range-picker-caret-open"
            )}
          />
        </div>
      </button>
    </PopoverPrimitive.Trigger>
  );
});
DateRangePickerTrigger.displayName = "DateRangePickerTrigger";

/**
 * Popover content container for DateRangePicker, rendering Calendar with range selection and optional presets.
 */
const DateRangePickerContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  DateRangePickerContentProps
>(({ className, align = "start", sideOffset = 4, calendarProps, ...props }, ref) => {
  const {
    value,
    setValue,
    numberOfMonths,
    presets,
    disabledDates,
    calendarProps: ctxCalProps,
  } = useDateRangePickerContext();

  const handleSelect = (range: DateRange | undefined) => {
    setValue(range);
  };

  const presetItems = React.useMemo(() => {
    if (!presets) return null;
    if (Array.isArray(presets)) return presets;
    return getDefaultPresets();
  }, [presets]);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn("cfui-date-range-picker-content", className)}
        {...props}
      >
        {presetItems && presetItems.length > 0 && (
          <div className="cfui-date-range-picker-presets">
            {presetItems.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setValue(preset.range)}
                className="cfui-date-range-picker-preset-button"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        <Calendar
          numberOfMonths={numberOfMonths}
          initialFocus
          {...ctxCalProps}
          {...calendarProps}
          mode="range"
          selected={value}
          onSelect={handleSelect}
          disabled={disabledDates ?? calendarProps?.disabled ?? ctxCalProps?.disabled}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
DateRangePickerContent.displayName = "DateRangePickerContent";

/**
 * DateRangePicker component for CFUI.
 * Composes Radix Popover and Calendar with controlled/uncontrolled range state,
 * formatting, presets, clear button, and accessible keyboard navigation.
 */
const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      onChange,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      disabledDates,
      placeholder = "Select date range",
      formatStr = "MMM d, yyyy",
      locale,
      clearable = true,
      numberOfMonths = 2,
      presets,
      className,
      triggerClassName,
      contentClassName,
      calendarProps,
      align = "start",
      sideOffset = 4,
      children,
      id,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
      DateRange | undefined
    >(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(defaultOpen);
    const isControlledOpen = controlledOpen !== undefined;
    const open = isControlledOpen ? controlledOpen : uncontrolledOpen;

    const handleValueChange = React.useCallback(
      (nextRange: DateRange | undefined) => {
        if (!isControlled) {
          setUncontrolledValue(nextRange);
        }
        onValueChange?.(nextRange);
        onChange?.(nextRange);
      },
      [isControlled, onValueChange, onChange]
    );

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (disabled) return;
        if (!isControlledOpen) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [disabled, isControlledOpen, onOpenChange]
    );

    const contextValue = React.useMemo<DateRangePickerContextValue>(
      () => ({
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
      }),
      [
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
      ]
    );

    return (
      <DateRangePickerContext.Provider value={contextValue}>
        <div ref={ref} className={cn("cfui-date-range-picker", className)}>
          <PopoverPrimitive.Root
            open={disabled ? false : open}
            onOpenChange={handleOpenChange}
          >
            {children ? (
              children
            ) : (
              <>
                <DateRangePickerTrigger
                  id={id}
                  aria-label={ariaLabel}
                  className={triggerClassName}
                />
                <DateRangePickerContent
                  align={align}
                  sideOffset={sideOffset}
                  className={contentClassName}
                />
              </>
            )}
          </PopoverPrimitive.Root>
        </div>
      </DateRangePickerContext.Provider>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent };
