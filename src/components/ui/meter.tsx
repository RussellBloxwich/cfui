import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./meter.css";

export type MeterVariant = "default" | "brand" | "success" | "warning" | "danger";
export type MeterSize = "sm" | "md" | "lg";

export interface MeterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  variant?: MeterVariant;
  size?: MeterSize;
  label?: React.ReactNode;
  formatValue?: (value: number, min: number, max: number) => React.ReactNode;
  showValue?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
}

interface MeterContextValue {
  value: number;
  min: number;
  max: number;
  percentage: number;
  variant: MeterVariant;
  size: MeterSize;
  low?: number;
  high?: number;
  optimum?: number;
}

const MeterContext = React.createContext<MeterContextValue | null>(null);

export function useMeterContext() {
  const context = React.useContext(MeterContext);
  if (!context) {
    throw new Error("Meter compound components must be used within a Meter");
  }
  return context;
}

function resolveVariant(
  explicitVariant: MeterVariant | undefined,
  value: number,
  low?: number,
  high?: number,
  optimum?: number
): MeterVariant {
  if (explicitVariant) return explicitVariant;
  if (low !== undefined && high !== undefined) {
    if (optimum !== undefined) {
      if (optimum >= high) {
        if (value >= high) return "success";
        if (value >= low) return "warning";
        return "danger";
      } else if (optimum <= low) {
        if (value <= low) return "success";
        if (value <= high) return "warning";
        return "danger";
      }
    }
    if (value > high) return "danger";
    if (value > low) return "warning";
    return "success";
  }
  return "brand";
}

export const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      className,
      value,
      min = 0,
      max = 100,
      low,
      high,
      optimum,
      variant: explicitVariant,
      size = "md",
      label,
      formatValue = (val) => `${Math.round(val)}%`,
      showValue = true,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, min), max);
    const range = max - min;
    const percentage = range > 0 ? ((clampedValue - min) / range) * 100 : 0;
    const variant = resolveVariant(explicitVariant, clampedValue, low, high, optimum);

    const contextValue = React.useMemo<MeterContextValue>(
      () => ({
        value: clampedValue,
        min,
        max,
        percentage,
        variant,
        size,
        low,
        high,
        optimum,
      }),
      [clampedValue, min, max, percentage, variant, size, low, high, optimum]
    );

    const Comp = asChild ? Slot : "div";

    return (
      <MeterContext.Provider value={contextValue}>
        <Comp
          ref={ref}
          role="meter"
          aria-valuenow={clampedValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={
            typeof formatValue === "function"
              ? String(formatValue(clampedValue, min, max))
              : `${clampedValue}`
          }
          className={cn("cfui-meter", className)}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              {(label || showValue) && (
                <div className="cfui-meter-header">
                  {label && <MeterLabel>{label}</MeterLabel>}
                  {showValue && (
                    <MeterValue>
                      {formatValue(clampedValue, min, max)}
                    </MeterValue>
                  )}
                </div>
              )}
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
              {/* Accessible hidden native meter for assistive tech */}
              <meter
                className="cfui-meter-native-sr-only"
                value={clampedValue}
                min={min}
                max={max}
                low={low}
                high={high}
                optimum={optimum}
              />
            </>
          )}
        </Comp>
      </MeterContext.Provider>
    );
  }
);
Meter.displayName = "Meter";

export interface MeterLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const MeterLabel = React.forwardRef<HTMLSpanElement, MeterLabelProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-meter-label", className)}
        {...props}
      />
    );
  }
);
MeterLabel.displayName = "MeterLabel";

export interface MeterValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const MeterValue = React.forwardRef<HTMLSpanElement, MeterValueProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const { value, min, max } = useMeterContext();
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={cn("cfui-meter-value", className)}
        {...props}
      >
        {children ?? `${Math.round(((value - min) / (max - min || 1)) * 100)}%`}
      </Comp>
    );
  }
);
MeterValue.displayName = "MeterValue";

export interface MeterTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const MeterTrack = React.forwardRef<HTMLDivElement, MeterTrackProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const { size } = useMeterContext();
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          "cfui-meter-track",
          `cfui-meter-track--${size}`,
          className
        )}
        {...props}
      >
        {children ?? <MeterIndicator />}
      </Comp>
    );
  }
);
MeterTrack.displayName = "MeterTrack";

export interface MeterIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const MeterIndicator = React.forwardRef<
  HTMLDivElement,
  MeterIndicatorProps
>(({ className, asChild = false, style, ...props }, ref) => {
  const { percentage, variant } = useMeterContext();
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      style={{ width: `${percentage}%`, ...style }}
      className={cn(
        "cfui-meter-indicator",
        `cfui-meter-indicator--${variant}`,
        className
      )}
      {...props}
    />
  );
});
MeterIndicator.displayName = "MeterIndicator";
