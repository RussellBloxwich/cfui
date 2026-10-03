"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "../../utils.js";
import "./chart.css";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function escapeCssIdentifier(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, "");
}

function sanitizeCssValue(str: string): string {
  return str.replace(/[;{}\n\r\\]/g, "").trim();
}

/**
 * Injects CSS variables for chart colors per chart instance.
 * Emits separate correctly themed, per-instance .cfui-chart selectors
 * and escapes instance IDs and config keys.
 */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  const escapedId = escapeCssIdentifier(id);

  const getVariablesForTheme = (theme: "light" | "dark") => {
    return colorConfig
      .map(([key, itemConfig]) => {
        const rawColor =
          itemConfig.theme?.[theme] || itemConfig.color;
        if (!rawColor) return null;
        const escapedKey = escapeCssIdentifier(key);
        const safeColor = sanitizeCssValue(rawColor);
        if (!escapedKey || !safeColor) return null;
        return `  --color-${escapedKey}: ${safeColor};`;
      })
      .filter(Boolean)
      .join("\n");
  };

  const lightVariables = getVariablesForTheme("light");
  const darkVariables = getVariablesForTheme("dark");

  const css = `
.cfui-chart[data-chart="${escapedId}"] {
${lightVariables}
}
.dark .cfui-chart[data-chart="${escapedId}"],
[data-cfui-theme="dark"] .cfui-chart[data-chart="${escapedId}"],
.dark.cfui-chart[data-chart="${escapedId}"],
[data-cfui-theme="dark"].cfui-chart[data-chart="${escapedId}"] {
${darkVariables}
}
`;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: css,
      }}
    />
  );
};

/**
 * Chart container wrapping Recharts ResponsiveContainer with Cloudflare design tokens.
 */
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn("cfui-chart", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = RechartsPrimitive.Tooltip;

const VALID_DOM_ATTRIBUTES = new Set([
  "id",
  "role",
  "title",
  "tabIndex",
  "tabindex",
  "style",
  "dir",
  "lang",
  "hidden",
  "accessKey",
  "contentEditable",
  "spellCheck",
  "draggable",
  "autoFocus",
  "slot",
  "translate",
  "about",
  "datatype",
  "inlist",
  "prefix",
  "property",
  "resource",
  "typeof",
  "vocab",
  "itemProp",
  "itemScope",
  "itemType",
  "itemID",
  "itemRef",
]);

const COMMON_DOM_EVENTS = new Set([
  "onKeyDown",
  "onKeyUp",
  "onKeyPress",
  "onFocus",
  "onBlur",
  "onDoubleClick",
  "onContextMenu",
  "onMouseDown",
  "onMouseUp",
  "onMouseMove",
  "onMouseOver",
  "onMouseOut",
  "onPointerDown",
  "onPointerUp",
  "onPointerMove",
  "onPointerCancel",
  "onPointerEnter",
  "onPointerLeave",
  "onPointerOver",
  "onPointerOut",
  "onTouchStart",
  "onTouchMove",
  "onTouchEnd",
  "onTouchCancel",
  "onWheel",
  "onScroll",
  "onTransitionEnd",
  "onAnimationStart",
  "onAnimationEnd",
  "onAnimationIteration",
]);

const TOOLTIP_DOM_EVENTS = new Set([
  ...COMMON_DOM_EVENTS,
  "onClick",
  "onMouseEnter",
  "onMouseLeave",
]);

const LEGEND_DOM_EVENTS = COMMON_DOM_EVENTS;

const RECHARTS_LEGEND_NON_DOM_KEYS = new Set([
  "content",
  "layout",
  "align",
  "verticalAlign",
  "iconSize",
  "iconType",
  "inactiveColor",
  "itemSorter",
  "labelStyle",
  "chartWidth",
  "chartHeight",
  "margin",
  "payload",
  "payloadUniqBy",
  "formatter",
  "wrapperStyle",
  "width",
  "height",
  "position",
  "offset",
  "onBBoxUpdate",
  "portal",
  "hideIcon",
  "nameKey",
  "onClick",
  "onMouseEnter",
  "onMouseLeave",
]);

const RECHARTS_TOOLTIP_NON_DOM_KEYS = new Set([
  "active",
  "activeIndex",
  "accessibilityLayer",
  "payload",
  "coordinate",
  "label",
  "labelFormatter",
  "formatter",
  "allowEscapeViewBox",
  "animationDuration",
  "animationEasing",
  "axisId",
  "content",
  "contentStyle",
  "cursor",
  "filterNull",
  "includeHidden",
  "isAnimationActive",
  "itemSorter",
  "itemStyle",
  "labelStyle",
  "offset",
  "position",
  "reverseDirection",
  "separator",
  "shared",
  "trigger",
  "useTranslate3d",
  "viewBox",
  "wrapperStyle",
  "portal",
  "payloadUniqBy",
  "defaultIndex",
  "indicator",
  "hideLabel",
  "hideIndicator",
  "labelClassName",
  "color",
  "nameKey",
  "labelKey",
]);

function filterDomProps<P extends object>(
  props: P,
  excludedKeys: Set<string>,
  allowedEvents: Set<string>
): Partial<P> {
  const result: Partial<P> = {};

  for (const key of Object.keys(props)) {
    const propKey = key as keyof P;
    const value = props[propKey];
    if (value === undefined) continue;
    if (key === "key" || key === "ref" || key === "children") continue;
    if (excludedKeys.has(key)) continue;

    if (key.startsWith("data-") || key.startsWith("aria-")) {
      result[propKey] = value;
    } else if (VALID_DOM_ATTRIBUTES.has(key)) {
      result[propKey] = value;
    } else if (allowedEvents.has(key)) {
      result[propKey] = value;
    }
  }

  return result;
}

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

export interface TooltipContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "content"> {
  active?: boolean;
  payload?: readonly TooltipPayloadEntry[];
  label?: React.ReactNode;
  labelFormatter?: (
    label: React.ReactNode,
    payload: readonly TooltipPayloadEntry[]
  ) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: unknown,
    name: unknown,
    item: TooltipPayloadEntry,
    index: number,
    payload: unknown
  ) => React.ReactNode;
  color?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  // Recharts Tooltip injected options
  activeIndex?: number | string;
  accessibilityLayer?: boolean;
  coordinate?: { x?: number; y?: number };
  allowEscapeViewBox?: boolean | { x?: boolean; y?: boolean };
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
  position?: { x?: number; y?: number };
  reverseDirection?: boolean | { x?: boolean; y?: boolean };
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

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof (payload as { payload?: unknown }).payload === "object" &&
    (payload as { payload?: unknown }).payload !== null
      ? ((payload as { payload?: unknown }).payload as Record<string, unknown>)
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof (payload as Record<string, unknown>)[key] === "string"
  ) {
    configLabelKey = (payload as Record<string, unknown>)[key] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

/**
 * Tooltip content for Recharts matching Cloudflare design tokens and card styling.
 */
const ChartTooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (props, ref) => {
    const {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      // Recharts Tooltip non-DOM props (consumed and not forwarded to DOM)
      activeIndex: _activeIndex,
      accessibilityLayer: _accessibilityLayer,
      coordinate: _coordinate,
      allowEscapeViewBox: _allowEscapeViewBox,
      animationDuration: _animationDuration,
      animationEasing: _animationEasing,
      axisId: _axisId,
      content: _content,
      contentStyle: _contentStyle,
      cursor: _cursor,
      filterNull: _filterNull,
      includeHidden: _includeHidden,
      isAnimationActive: _isAnimationActive,
      itemSorter: _itemSorter,
      itemStyle: _itemStyle,
      labelStyle: _labelStyle,
      offset: _offset,
      position: _position,
      reverseDirection: _reverseDirection,
      separator: _separator,
      shared: _shared,
      trigger: _trigger,
      useTranslate3d: _useTranslate3d,
      viewBox: _viewBox,
      wrapperStyle: _wrapperStyle,
      portal: _portal,
      payloadUniqBy: _payloadUniqBy,
      defaultIndex: _defaultIndex,
      ...restProps
    } = props;

    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("cfui-chart-tooltip-label", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return (
        <div className={cn("cfui-chart-tooltip-label", labelClassName)}>
          {value}
        </div>
      );
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";
    const domProps = filterDomProps(
      restProps,
      RECHARTS_TOOLTIP_NON_DOM_KEYS,
      TOOLTIP_DOM_EVENTS
    );

    return (
      <div
        ref={ref}
        className={cn("cfui-chart-tooltip", className)}
        {...domProps}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="cfui-chart-tooltip-grid">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor =
              color ||
              (typeof item.payload === "object" &&
              item.payload !== null &&
              "fill" in item.payload &&
              typeof item.payload.fill === "string"
                ? item.payload.fill
                : undefined) ||
              (typeof item.fill === "string" ? item.fill : undefined) ||
              (typeof item.color === "string" ? item.color : undefined);

            return (
              <div
                key={item.dataKey !== undefined ? String(item.dataKey) : index}
                className={cn(
                  "cfui-chart-tooltip-entry",
                  indicator === "dot" && "cfui-chart-tooltip-entry-dot"
                )}
              >
                {formatter && item?.value !== undefined ? (
                  formatter(
                    item.value,
                    item.name ?? itemConfig?.label ?? key,
                    item,
                    index,
                    item.payload
                  )
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("cfui-chart-tooltip-indicator", {
                            "cfui-chart-tooltip-indicator-dot": indicator === "dot",
                            "cfui-chart-tooltip-indicator-line": indicator === "line",
                            "cfui-chart-tooltip-indicator-dashed": indicator === "dashed",
                            "cfui-chart-tooltip-indicator-nested":
                              nestLabel && indicator === "dashed",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "cfui-chart-tooltip-values",
                        nestLabel
                          ? "cfui-chart-tooltip-values-nested"
                          : "cfui-chart-tooltip-values-centered"
                      )}
                    >
                      <div className="cfui-chart-tooltip-name-wrapper">
                        {nestLabel ? tooltipLabel : null}
                        <span className="cfui-chart-tooltip-name">
                          {itemConfig?.label || (item.name !== undefined ? String(item.name) : null)}
                        </span>
                      </div>
                      {item.value !== undefined && (
                        <span className="cfui-chart-tooltip-value">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

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

export interface ChartLegendContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onClick" | "onMouseEnter" | "onMouseLeave" | "content"
  > {
  payload?: readonly LegendPayload[];
  verticalAlign?: "top" | "middle" | "bottom";
  hideIcon?: boolean;
  nameKey?: string;
  // Recharts Legend injected options and callbacks
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
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  payloadUniqBy?: unknown;
  formatter?: (
    value: any,
    entry: LegendPayload,
    index: number
  ) => React.ReactNode;
  wrapperStyle?: React.CSSProperties;
  width?: number;
  height?: number;
  position?: unknown;
  offset?: number;
  onBBoxUpdate?: unknown;
  portal?: HTMLElement | null;
  onClick?: (
    entry: LegendPayload,
    index: number,
    event: React.MouseEvent
  ) => void;
  onMouseEnter?: (
    entry: LegendPayload,
    index: number,
    event: React.MouseEvent
  ) => void;
  onMouseLeave?: (
    entry: LegendPayload,
    index: number,
    event: React.MouseEvent
  ) => void;
}

/**
 * Legend content for Recharts matching Cloudflare design tokens.
 */
const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  (props, ref) => {
    const {
      className,
      hideIcon = false,
      payload,
      verticalAlign = "bottom",
      nameKey,
      // Recharts Legend non-DOM props & callbacks
      content: _content,
      layout: _layout,
      align: _align,
      iconSize: _iconSize,
      iconType: _iconType,
      inactiveColor: _inactiveColor,
      itemSorter: _itemSorter,
      labelStyle: _labelStyle,
      chartWidth: _chartWidth,
      chartHeight: _chartHeight,
      margin: _margin,
      payloadUniqBy: _payloadUniqBy,
      formatter: legendFormatter,
      wrapperStyle: _wrapperStyle,
      width: _width,
      height: _height,
      position: _position,
      offset: _offset,
      onBBoxUpdate: _onBBoxUpdate,
      portal: _portal,
      onClick: onLegendItemClick,
      onMouseEnter: onLegendItemMouseEnter,
      onMouseLeave: onLegendItemMouseLeave,
      ...restProps
    } = props;

    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    const domProps = filterDomProps(
      restProps,
      RECHARTS_LEGEND_NON_DOM_KEYS,
      LEGEND_DOM_EVENTS
    );

    return (
      <div
        ref={ref}
        className={cn(
          "cfui-chart-legend",
          verticalAlign === "top" ? "cfui-chart-legend-top" : "cfui-chart-legend-bottom",
          className
        )}
        {...domProps}
      >
        {payload.map((item, index) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const defaultLabel =
            itemConfig?.label ||
            (item.value !== undefined ? String(item.value) : null);
          const formattedLabel = legendFormatter
            ? legendFormatter(defaultLabel, item, index)
            : defaultLabel;

          return (
            <div
              key={item.value !== undefined ? String(item.value) : index}
              className="cfui-chart-legend-item"
              onClick={
                onLegendItemClick
                  ? (event) => onLegendItemClick(item, index, event)
                  : undefined
              }
              onMouseEnter={
                onLegendItemMouseEnter
                  ? (event) => onLegendItemMouseEnter(item, index, event)
                  : undefined
              }
              onMouseLeave={
                onLegendItemMouseLeave
                  ? (event) => onLegendItemMouseLeave(item, index, event)
                  : undefined
              }
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="cfui-chart-legend-indicator"
                  style={{
                    backgroundColor: item.color || (typeof item.fill === "string" ? item.fill : undefined),
                  }}
                />
              )}
              <span className="cfui-chart-legend-label">
                {formattedLabel}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChart,
};
