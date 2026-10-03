import * as React from "react";
import * as RechartsPrimitive from "recharts";
                     
export type ChartConfig = {
    [k in string]: {
        label?: React.ReactNode;
        icon?: React.ComponentType;
    } & ({
        color?: string;
        theme?: never;
    } | {
        color?: never;
        theme: Record<string, string>;
    });
};
type ChartContextProps = {
    config: ChartConfig;
};
declare function useChart(): ChartContextProps;
/**
 * Injects CSS variables for chart colors per chart instance.
 * Emits separate correctly themed, per-instance .cfui-chart selectors
 * and escapes instance IDs and config keys.
 */
declare const ChartStyle: ({ id, config }: {
    id: string;
    config: ChartConfig;
}) => React.JSX.Element | null;
/**
 * Chart container wrapping Recharts ResponsiveContainer with Cloudflare design tokens.
 */
declare const ChartContainer: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartTooltip: typeof RechartsPrimitive.Tooltip;
export type TooltipPayloadEntry = {
    name?: string | number;
    value?: number | string | Array<number | string>;
    dataKey?: string | number;
    payload?: Record<string, unknown>;
    color?: string;
    fill?: string;
    stroke?: string;
    [key: string]: unknown;
};
export interface TooltipContentProps extends Omit<React.ComponentPropsWithoutRef<"div">, "content"> {
    active?: boolean;
    payload?: readonly TooltipPayloadEntry[];
    label?: React.ReactNode;
    labelFormatter?: (label: React.ReactNode, payload: readonly TooltipPayloadEntry[]) => React.ReactNode;
    labelClassName?: string;
    formatter?: (value: unknown, name: unknown, item: TooltipPayloadEntry, index: number, payload: unknown) => React.ReactNode;
    color?: string;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    activeIndex?: number | string;
    accessibilityLayer?: boolean;
    coordinate?: {
        x?: number;
        y?: number;
    };
    allowEscapeViewBox?: boolean | {
        x?: boolean;
        y?: boolean;
    };
    animationDuration?: number;
    animationEasing?: string;
    axisId?: string | number;
    content?: unknown;
    contentStyle?: React.CSSProperties;
    cursor?: unknown;
    filterNull?: boolean;
    includeHidden?: boolean;
    isAnimationActive?: boolean | "auto";
    itemSorter?: unknown;
    itemStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    offset?: number;
    position?: {
        x?: number;
        y?: number;
    };
    reverseDirection?: boolean | {
        x?: boolean;
        y?: boolean;
    };
    separator?: string;
    shared?: boolean;
    trigger?: "hover" | "click";
    useTranslate3d?: boolean;
    viewBox?: unknown;
    wrapperStyle?: React.CSSProperties;
    portal?: HTMLElement | null;
    payloadUniqBy?: unknown;
    defaultIndex?: number;
}
export type ChartTooltipContentProps = TooltipContentProps;
/**
 * Tooltip content for Recharts matching Cloudflare design tokens and card styling.
 */
declare const ChartTooltipContent: React.ForwardRefExoticComponent<TooltipContentProps & React.RefAttributes<HTMLDivElement>>;
declare const ChartLegend: React.MemoExoticComponent<(outsideProps: RechartsPrimitive.LegendProps) => React.ReactPortal | null>;
export type LegendPayload = {
    value?: string | number;
    id?: string;
    type?: string;
    color?: string;
    dataKey?: string | number;
    payload?: Record<string, unknown>;
    inactive?: boolean;
    [key: string]: unknown;
};
export interface ChartLegendContentProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onClick" | "onMouseEnter" | "onMouseLeave" | "content"> {
    payload?: readonly LegendPayload[];
    verticalAlign?: "top" | "middle" | "bottom";
    hideIcon?: boolean;
    nameKey?: string;
    content?: unknown;
    layout?: "horizontal" | "vertical";
    align?: "left" | "center" | "right";
    iconSize?: number;
    iconType?: string;
    inactiveColor?: string;
    itemSorter?: unknown;
    labelStyle?: React.CSSProperties;
    chartWidth?: number;
    chartHeight?: number;
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    payloadUniqBy?: unknown;
    formatter?: (value: any, entry: LegendPayload, index: number) => React.ReactNode;
    wrapperStyle?: React.CSSProperties;
    width?: number;
    height?: number;
    position?: unknown;
    offset?: number;
    onBBoxUpdate?: unknown;
    portal?: HTMLElement | null;
    onClick?: (entry: LegendPayload, index: number, event: React.MouseEvent) => void;
    onMouseEnter?: (entry: LegendPayload, index: number, event: React.MouseEvent) => void;
    onMouseLeave?: (entry: LegendPayload, index: number, event: React.MouseEvent) => void;
}
/**
 * Legend content for Recharts matching Cloudflare design tokens.
 */
declare const ChartLegendContent: React.ForwardRefExoticComponent<ChartLegendContentProps & React.RefAttributes<HTMLDivElement>>;
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, useChart, };
//# sourceMappingURL=chart.d.ts.map