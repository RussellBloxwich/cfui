import * as React from "react";
                     
export type MeterVariant = "default" | "brand" | "success" | "warning" | "danger";
export type MeterSize = "sm" | "md" | "lg";
export interface MeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
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
export declare function useMeterContext(): MeterContextValue;
export declare const Meter: React.ForwardRefExoticComponent<MeterProps & React.RefAttributes<HTMLDivElement>>;
export interface MeterLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const MeterLabel: React.ForwardRefExoticComponent<MeterLabelProps & React.RefAttributes<HTMLSpanElement>>;
export interface MeterValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const MeterValue: React.ForwardRefExoticComponent<MeterValueProps & React.RefAttributes<HTMLSpanElement>>;
export interface MeterTrackProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const MeterTrack: React.ForwardRefExoticComponent<MeterTrackProps & React.RefAttributes<HTMLDivElement>>;
export interface MeterIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const MeterIndicator: React.ForwardRefExoticComponent<MeterIndicatorProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=meter.d.ts.map