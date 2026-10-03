"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format, type Locale } from "date-fns";
import { CalendarBlankIcon, CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { Calendar, type CalendarProps } from "./calendar.js";
import "./date-picker.css";

export type DatePickerCalendarProps = Omit<
  CalendarProps,
  "mode" | "selected" | "onSelect" | "required"
>;

interface DatePickerContextValue {
  value: Date | undefined;
  setValue: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  locale?: Locale;
  formatStr: string;
  placeholder: string;
  clearable: boolean;
  disabledDates?: CalendarProps["disabled"];
  calendarProps?: DatePickerCalendarProps;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
  const context = React.useContext(DatePickerContext);
  if (!context) {
    throw new Error("DatePicker compound components must be used within <DatePicker />");
  }
  return context;
}

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

export interface DatePickerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface DatePickerContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  calendarProps?: DatePickerCalendarProps;
}

/**
 * Trigger button for DatePicker.
 */
const DatePickerTrigger = React.forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  ({ className, children, asChild = false, onClick, ...props }, ref) => {
    const {
      value,
      setValue,
      open,
      disabled,
      locale,
      formatStr,
      placeholder,
      clearable,
    } = useDatePickerContext();

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

    const formattedValue = value ? format(value, formatStr, { locale }) : null;

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
            "cfui-date-picker-trigger",
            !formattedValue && "cfui-date-picker-trigger-placeholder",
            className
          )}
          {...props}
        >
          <div className="cfui-date-picker-trigger-label">
            <CalendarBlankIcon className="cfui-date-picker-icon" />
            <span>{formattedValue || placeholder}</span>
          </div>

          <div className="cfui-date-picker-actions">
            {clearable && value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear date"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                className="cfui-date-picker-clear-button"
              >
                <XIcon className="cfui-date-picker-clear-icon" />
              </span>
            )}
            <CaretDownIcon
              className={cn(
                "cfui-date-picker-caret",
                open && "cfui-date-picker-caret-open"
              )}
            />
          </div>
        </button>
      </PopoverPrimitive.Trigger>
    );
  }
);
DatePickerTrigger.displayName = "DatePickerTrigger";

/**
 * Popover content container for DatePicker, rendering Calendar inside.
 */
const DatePickerContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  DatePickerContentProps
>(({ className, align = "start", sideOffset = 4, calendarProps, ...props }, ref) => {
  const { value, setValue, setOpen, disabledDates, calendarProps: ctxCalProps } =
    useDatePickerContext();

  const handleSelect = (date: Date | undefined) => {
    setValue(date);
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn("cfui-date-picker-content", className)}
        {...props}
      >
        <Calendar
          initialFocus
          {...ctxCalProps}
          {...calendarProps}
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={disabledDates ?? calendarProps?.disabled ?? ctxCalProps?.disabled}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
DatePickerContent.displayName = "DatePickerContent";

/**
 * DatePicker component for CFUI.
 * Composes Radix Popover and Calendar with controlled/uncontrolled state,
 * formatting, clear button, and accessible keyboard navigation.
 */
const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
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
      placeholder = "Select date",
      formatStr = "PPP",
      locale,
      clearable = true,
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
    const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | undefined>(
      defaultValue
    );
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(defaultOpen);
    const isControlledOpen = controlledOpen !== undefined;
    const open = isControlledOpen ? controlledOpen : uncontrolledOpen;

    const handleValueChange = React.useCallback(
      (nextDate: Date | undefined) => {
        if (!isControlled) {
          setUncontrolledValue(nextDate);
        }
        onValueChange?.(nextDate);
        onChange?.(nextDate);
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

    const contextValue = React.useMemo<DatePickerContextValue>(
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
        disabledDates,
        calendarProps,
      ]
    );

    return (
      <DatePickerContext.Provider value={contextValue}>
        <div ref={ref} className={cn("cfui-date-picker", className)}>
          <PopoverPrimitive.Root
            open={disabled ? false : open}
            onOpenChange={handleOpenChange}
          >
            {children ? (
              children
            ) : (
              <>
                <DatePickerTrigger
                  id={id}
                  aria-label={ariaLabel}
                  className={triggerClassName}
                />
                <DatePickerContent
                  align={align}
                  sideOffset={sideOffset}
                  className={contentClassName}
                />
              </>
            )}
          </PopoverPrimitive.Root>
        </div>
      </DatePickerContext.Provider>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker, DatePickerTrigger, DatePickerContent };
