import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '../src/components/ui/chart.js';

// Copy to CFUI/tests before running. This tests the custom content adapter with
// the option bags that Recharts 3.10.1 injects via cloneElement; it does not mock
// a CFUI component. The geometry shim gives the real ResponsiveContainer a size.
const chartConfig = { requests: { label: 'Requests', color: '#2563eb' } };

function insideChart(child: React.ReactElement) {
  return <ChartContainer config={chartConfig} style={{ width: 500, height: 250 }}>{child}</ChartContainer>;
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, top: 0, left: 0, right: 500, bottom: 250,
    width: 500, height: 250, toJSON: () => ({}),
  });
});

const injectedLegend = {
  payload: [{ value: 'requests', dataKey: 'requests', color: '#2563eb' }],
  align: 'center', verticalAlign: 'bottom' as const, layout: 'horizontal',
  iconSize: 14, inactiveColor: '#ccc', itemSorter: 'value', labelStyle: {},
  offset: 0, chartWidth: 500, chartHeight: 250,
  margin: { top: 16, left: 16, right: 16, bottom: 0 },
  content: <span>Injected renderer configuration</span>, wrapperStyle: {},
};

const injectedTooltip = {
  active: true,
  payload: [{ name: 'requests', dataKey: 'requests', value: 42, color: '#2563eb' }],
  label: 'Tuesday', activeIndex: '0', accessibilityLayer: true,
  coordinate: { x: 40, y: 70 }, viewBox: { x: 0, y: 0, width: 500, height: 250 },
  allowEscapeViewBox: { x: false, y: false }, animationDuration: 400,
  animationEasing: 'ease', axisId: 0, contentStyle: {}, cursor: true,
  filterNull: true, includeHidden: false, isAnimationActive: 'auto',
  itemSorter: 'name', itemStyle: {}, labelStyle: {}, offset: 10,
  reverseDirection: { x: false, y: false }, separator: ' : ', trigger: 'hover',
  useTranslate3d: false, wrapperStyle: {},
  content: <span>Injected renderer configuration</span>,
};

function expectNoChartAttributes(element: HTMLElement, names: readonly string[]) {
  for (const name of names) {
    // HTML lowercases unknown attributes, so check actual DOM rather than JSX names.
    expect(element).not.toHaveAttribute(name.toLowerCase());
  }
}

describe('chart content DOM boundaries', () => {
  it('renders legend labels and native attributes without leaking Recharts options', async () => {
    const errors = vi.spyOn(console, 'error');
    const ref = React.createRef<HTMLDivElement>();
    const onKeyDown = vi.fn();

    render(insideChart(<ChartLegendContent
      {...injectedLegend}
      ref={ref}
      data-testid="legend-content"
      data-user-context="metrics"
      id="request-legend"
      aria-label="Request series"
      role="group"
      title="Series legend"
      tabIndex={0}
      style={{ marginTop: 7 }}
      onKeyDown={onKeyDown}
    />));

    const legend = await screen.findByTestId('legend-content');
    expect(legend).toHaveTextContent('Requests');
    expect(legend).toHaveAttribute('data-user-context', 'metrics');
    expect(legend).toHaveAttribute('id', 'request-legend');
    expect(legend).toHaveAttribute('aria-label', 'Request series');
    expect(legend).toHaveAttribute('role', 'group');
    expect(legend).toHaveAttribute('title', 'Series legend');
    expect(legend).toHaveAttribute('tabindex', '0');
    expect(legend).toHaveStyle({ marginTop: '7px' });
    expect(ref.current).toBe(legend);
    fireEvent.keyDown(legend, { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expectNoChartAttributes(legend, [
      'align', 'layout', 'iconSize', 'inactiveColor', 'itemSorter', 'labelStyle',
      'offset', 'chartWidth', 'chartHeight', 'margin', 'content', 'wrapperStyle',
    ]);
    expect(errors.mock.calls).toEqual([]);
  });

  it('renders active tooltip data without leaking injected chart options', async () => {
    const errors = vi.spyOn(console, 'error');
    const ref = React.createRef<HTMLDivElement>();
    const onKeyDown = vi.fn();

    render(insideChart(<ChartTooltipContent
      {...injectedTooltip}
      ref={ref}
      data-testid="tooltip-content"
      data-user-context="metrics"
      id="request-tooltip"
      role="status"
      aria-live="polite"
      tabIndex={0}
      style={{ marginTop: 7 }}
      onKeyDown={onKeyDown}
    />));

    const tooltip = await screen.findByTestId('tooltip-content');
    expect(tooltip).toHaveTextContent('Requests');
    expect(tooltip).toHaveTextContent('42');
    expect(tooltip).toHaveAttribute('data-user-context', 'metrics');
    expect(tooltip).toHaveAttribute('id', 'request-tooltip');
    expect(tooltip).toHaveAttribute('role', 'status');
    expect(tooltip).toHaveAttribute('aria-live', 'polite');
    expect(tooltip).toHaveStyle({ marginTop: '7px' });
    expect(ref.current).toBe(tooltip);
    fireEvent.keyDown(tooltip, { key: 'Escape' });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expectNoChartAttributes(tooltip, [
      'activeIndex', 'accessibilityLayer', 'coordinate', 'viewBox', 'allowEscapeViewBox',
      'animationDuration', 'animationEasing', 'axisId', 'contentStyle', 'cursor',
      'filterNull', 'includeHidden', 'isAnimationActive', 'itemSorter', 'itemStyle',
      'labelStyle', 'offset', 'reverseDirection', 'separator', 'trigger',
      'useTranslate3d', 'wrapperStyle', 'content',
    ]);
    expect(errors.mock.calls).toEqual([]);
  });
});
