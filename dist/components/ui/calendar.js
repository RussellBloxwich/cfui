"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                        
/**
 * Calendar component for CFUI.
 * Wraps react-day-picker v9 with Cloudflare design tokens, visible month navigation,
 * full keyboard navigation, external month control, and custom range/selected/disabled styling.
 */
function Calendar({ className, classNames, showOutsideDays = true, components, ...props }) {
    const mergedClassNames = React.useMemo(() => ({
        months: cn("cfui-calendar-months", classNames?.months),
        month: cn("cfui-calendar-month", classNames?.month),
        month_caption: cn("cfui-calendar-month-caption", classNames?.month_caption),
        caption_label: cn("cfui-calendar-caption-label", classNames?.caption_label),
        nav: cn("cfui-calendar-nav", classNames?.nav),
        button_previous: cn("cfui-calendar-nav-button cfui-calendar-button-previous", classNames?.button_previous),
        button_next: cn("cfui-calendar-nav-button cfui-calendar-button-next", classNames?.button_next),
        month_grid: cn("cfui-calendar-month-grid", classNames?.month_grid),
        weekdays: cn("cfui-calendar-weekdays", classNames?.weekdays),
        weekday: cn("cfui-calendar-weekday", classNames?.weekday),
        week: cn("cfui-calendar-week", classNames?.week),
        day: cn("cfui-calendar-day", classNames?.day),
        day_button: cn("cfui-calendar-day-button", classNames?.day_button),
        range_start: cn("cfui-calendar-range-start", classNames?.range_start),
        range_end: cn("cfui-calendar-range-end", classNames?.range_end),
        range_middle: cn("cfui-calendar-range-middle", classNames?.range_middle),
        selected: cn("cfui-calendar-selected", classNames?.selected),
        today: cn("cfui-calendar-today", classNames?.today),
        outside: cn("cfui-calendar-outside", classNames?.outside),
        disabled: cn("cfui-calendar-disabled", classNames?.disabled),
        hidden: cn("cfui-calendar-hidden", classNames?.hidden),
        ...classNames,
    }), [classNames]);
    return (_jsx(DayPicker, { showOutsideDays: showOutsideDays, className: cn("cfui-calendar", className), classNames: mergedClassNames, components: {
            Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
                if (orientation === "left") {
                    return (_jsx(CaretLeftIcon, { className: cn("cfui-calendar-nav-icon", chevronClassName), ...chevronProps }));
                }
                return (_jsx(CaretRightIcon, { className: cn("cfui-calendar-nav-icon", chevronClassName), ...chevronProps }));
            },
            ...components,
        }, ...props }));
}
Calendar.displayName = "Calendar";
export { Calendar };
//# sourceMappingURL=calendar.js.map