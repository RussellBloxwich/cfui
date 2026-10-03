"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "../../utils.js";
                     
const ChartContext = React.createContext(null);
function useChart() {
    const context = React.useContext(ChartContext);
    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />");
    }
    return context;
}
function escapeCssIdentifier(str) {
    return str.replace(/[^a-zA-Z0-9_-]/g, "");
}
function sanitizeCssValue(str) {
    return str.replace(/[;{}\n\r\\]/g, "").trim();
}
/**
 * Injects CSS variables for chart colors per chart instance.
 * Emits separate correctly themed, per-instance .cfui-chart selectors
 * and escapes instance IDs and config keys.
 */
const ChartStyle = ({ id, config }) => {
    const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.theme || itemConfig.color);
    if (!colorConfig.length) {
        return null;
    }
    const escapedId = escapeCssIdentifier(id);
    const getVariablesForTheme = (theme) => {
        return colorConfig
            .map(([key, itemConfig]) => {
            const rawColor = itemConfig.theme?.[theme] || itemConfig.color;
            if (!rawColor)
                return null;
            const escapedKey = escapeCssIdentifier(key);
            const safeColor = sanitizeCssValue(rawColor);
            if (!escapedKey || !safeColor)
                return null;
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
    return (_jsx("style", { dangerouslySetInnerHTML: {
            __html: css,
        } }));
};
/**
 * Chart container wrapping Recharts ResponsiveContainer with Cloudflare design tokens.
 */
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
    return (_jsx(ChartContext.Provider, { value: { config }, children: _jsxs("div", { "data-chart": chartId, ref: ref, className: cn("cfui-chart", className), ...props, children: [_jsx(ChartStyle, { id: chartId, config: config }), _jsx(RechartsPrimitive.ResponsiveContainer, { children: children })] }) }));
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
function filterDomProps(props, excludedKeys, allowedEvents) {
    const result = {};
    for (const key of Object.keys(props)) {
        const propKey = key;
        const value = props[propKey];
        if (value === undefined)
            continue;
        if (key === "key" || key === "ref" || key === "children")
            continue;
        if (excludedKeys.has(key))
            continue;
        if (key.startsWith("data-") || key.startsWith("aria-")) {
            result[propKey] = value;
        }
        else if (VALID_DOM_ATTRIBUTES.has(key)) {
            result[propKey] = value;
        }
        else if (allowedEvents.has(key)) {
            result[propKey] = value;
        }
    }
    return result;
}
function getPayloadConfigFromPayload(config, payload, key) {
    if (typeof payload !== "object" || payload === null) {
        return undefined;
    }
    const payloadPayload = "payload" in payload &&
        typeof payload.payload === "object" &&
        payload.payload !== null
        ? payload.payload
        : undefined;
    let configLabelKey = key;
    if (key in payload &&
        typeof payload[key] === "string") {
        configLabelKey = payload[key];
    }
    else if (payloadPayload &&
        key in payloadPayload &&
        typeof payloadPayload[key] === "string") {
        configLabelKey = payloadPayload[key];
    }
    return configLabelKey in config
        ? config[configLabelKey]
        : config[key];
}
/**
 * Tooltip content for Recharts matching Cloudflare design tokens and card styling.
 */
const ChartTooltipContent = React.forwardRef((props, ref) => {
    const { active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey, 
    // Recharts Tooltip non-DOM props (consumed and not forwarded to DOM)
    activeIndex: _activeIndex, accessibilityLayer: _accessibilityLayer, coordinate: _coordinate, allowEscapeViewBox: _allowEscapeViewBox, animationDuration: _animationDuration, animationEasing: _animationEasing, axisId: _axisId, content: _content, contentStyle: _contentStyle, cursor: _cursor, filterNull: _filterNull, includeHidden: _includeHidden, isAnimationActive: _isAnimationActive, itemSorter: _itemSorter, itemStyle: _itemStyle, labelStyle: _labelStyle, offset: _offset, position: _position, reverseDirection: _reverseDirection, separator: _separator, shared: _shared, trigger: _trigger, useTranslate3d: _useTranslate3d, viewBox: _viewBox, wrapperStyle: _wrapperStyle, portal: _portal, payloadUniqBy: _payloadUniqBy, defaultIndex: _defaultIndex, ...restProps } = props;
    const { config } = useChart();
    const tooltipLabel = React.useMemo(() => {
        if (hideLabel || !payload?.length) {
            return null;
        }
        const [item] = payload;
        const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        const value = !labelKey && typeof label === "string"
            ? config[label]?.label || label
            : itemConfig?.label;
        if (labelFormatter) {
            return (_jsx("div", { className: cn("cfui-chart-tooltip-label", labelClassName), children: labelFormatter(value, payload) }));
        }
        if (!value) {
            return null;
        }
        return (_jsx("div", { className: cn("cfui-chart-tooltip-label", labelClassName), children: value }));
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);
    if (!active || !payload?.length) {
        return null;
    }
    const nestLabel = payload.length === 1 && indicator !== "dot";
    const domProps = filterDomProps(restProps, RECHARTS_TOOLTIP_NON_DOM_KEYS, TOOLTIP_DOM_EVENTS);
    return (_jsxs("div", { ref: ref, className: cn("cfui-chart-tooltip", className), ...domProps, children: [!nestLabel ? tooltipLabel : null, _jsx("div", { className: "cfui-chart-tooltip-grid", children: payload.map((item, index) => {
                    const key = `${nameKey || item.name || item.dataKey || "value"}`;
                    const itemConfig = getPayloadConfigFromPayload(config, item, key);
                    const indicatorColor = color ||
                        (typeof item.payload === "object" &&
                            item.payload !== null &&
                            "fill" in item.payload &&
                            typeof item.payload.fill === "string"
                            ? item.payload.fill
                            : undefined) ||
                        (typeof item.fill === "string" ? item.fill : undefined) ||
                        (typeof item.color === "string" ? item.color : undefined);
                    return (_jsx("div", { className: cn("cfui-chart-tooltip-entry", indicator === "dot" && "cfui-chart-tooltip-entry-dot"), children: formatter && item?.value !== undefined ? (formatter(item.value, item.name ?? itemConfig?.label ?? key, item, index, item.payload)) : (_jsxs(_Fragment, { children: [itemConfig?.icon ? (_jsx(itemConfig.icon, {})) : (!hideIndicator && (_jsx("div", { className: cn("cfui-chart-tooltip-indicator", {
                                        "cfui-chart-tooltip-indicator-dot": indicator === "dot",
                                        "cfui-chart-tooltip-indicator-line": indicator === "line",
                                        "cfui-chart-tooltip-indicator-dashed": indicator === "dashed",
                                        "cfui-chart-tooltip-indicator-nested": nestLabel && indicator === "dashed",
                                    }), style: {
                                        "--color-bg": indicatorColor,
                                        "--color-border": indicatorColor,
                                    } }))), _jsxs("div", { className: cn("cfui-chart-tooltip-values", nestLabel
                                        ? "cfui-chart-tooltip-values-nested"
                                        : "cfui-chart-tooltip-values-centered"), children: [_jsxs("div", { className: "cfui-chart-tooltip-name-wrapper", children: [nestLabel ? tooltipLabel : null, _jsx("span", { className: "cfui-chart-tooltip-name", children: itemConfig?.label || (item.name !== undefined ? String(item.name) : null) })] }), item.value !== undefined && (_jsx("span", { className: "cfui-chart-tooltip-value", children: typeof item.value === "number"
                                                ? item.value.toLocaleString()
                                                : String(item.value) }))] })] })) }, item.dataKey !== undefined ? String(item.dataKey) : index));
                }) })] }));
});
ChartTooltipContent.displayName = "ChartTooltipContent";
const ChartLegend = RechartsPrimitive.Legend;
/**
 * Legend content for Recharts matching Cloudflare design tokens.
 */
const ChartLegendContent = React.forwardRef((props, ref) => {
    const { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey, 
    // Recharts Legend non-DOM props & callbacks
    content: _content, layout: _layout, align: _align, iconSize: _iconSize, iconType: _iconType, inactiveColor: _inactiveColor, itemSorter: _itemSorter, labelStyle: _labelStyle, chartWidth: _chartWidth, chartHeight: _chartHeight, margin: _margin, payloadUniqBy: _payloadUniqBy, formatter: legendFormatter, wrapperStyle: _wrapperStyle, width: _width, height: _height, position: _position, offset: _offset, onBBoxUpdate: _onBBoxUpdate, portal: _portal, onClick: onLegendItemClick, onMouseEnter: onLegendItemMouseEnter, onMouseLeave: onLegendItemMouseLeave, ...restProps } = props;
    const { config } = useChart();
    if (!payload?.length) {
        return null;
    }
    const domProps = filterDomProps(restProps, RECHARTS_LEGEND_NON_DOM_KEYS, LEGEND_DOM_EVENTS);
    return (_jsx("div", { ref: ref, className: cn("cfui-chart-legend", verticalAlign === "top" ? "cfui-chart-legend-top" : "cfui-chart-legend-bottom", className), ...domProps, children: payload.map((item, index) => {
            const key = `${nameKey || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const defaultLabel = itemConfig?.label ||
                (item.value !== undefined ? String(item.value) : null);
            const formattedLabel = legendFormatter
                ? legendFormatter(defaultLabel, item, index)
                : defaultLabel;
            return (_jsxs("div", { className: "cfui-chart-legend-item", onClick: onLegendItemClick
                    ? (event) => onLegendItemClick(item, index, event)
                    : undefined, onMouseEnter: onLegendItemMouseEnter
                    ? (event) => onLegendItemMouseEnter(item, index, event)
                    : undefined, onMouseLeave: onLegendItemMouseLeave
                    ? (event) => onLegendItemMouseLeave(item, index, event)
                    : undefined, children: [itemConfig?.icon && !hideIcon ? (_jsx(itemConfig.icon, {})) : (_jsx("div", { className: "cfui-chart-legend-indicator", style: {
                            backgroundColor: item.color || (typeof item.fill === "string" ? item.fill : undefined),
                        } })), _jsx("span", { className: "cfui-chart-legend-label", children: formattedLabel })] }, item.value !== undefined ? String(item.value) : index));
        }) }));
});
ChartLegendContent.displayName = "ChartLegendContent";
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, useChart, };
//# sourceMappingURL=chart.js.map