import * as React from "react";
import { DayPicker } from "react-day-picker";
                        
export type CalendarProps = React.ComponentProps<typeof DayPicker>;
/**
 * Calendar component for CFUI.
 * Wraps react-day-picker v9 with Cloudflare design tokens, visible month navigation,
 * full keyboard navigation, external month control, and custom range/selected/disabled styling.
 */
declare function Calendar({ className, classNames, showOutsideDays, components, ...props }: CalendarProps): React.JSX.Element;
declare namespace Calendar {
    var displayName: string;
}
export { Calendar };
//# sourceMappingURL=calendar.d.ts.map