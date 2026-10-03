import * as React from "react";
                            
export interface NumberFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    label?: React.ReactNode;
    "aria-label"?: string;
    "aria-labelledby"?: string;
}
interface NumberFieldContextValue {
    value: number;
    isControlled: boolean;
    min?: number;
    max?: number;
    step: number;
    disabled?: boolean;
    readOnly?: boolean;
    increment: (factor?: number) => void;
    decrement: (factor?: number) => void;
    setValue: (val: number) => void;
    canIncrement: boolean;
    canDecrement: boolean;
    labelId?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
}
export declare function useNumberFieldContext(): NumberFieldContextValue;
export declare const NumberField: React.ForwardRefExoticComponent<NumberFieldProps & React.RefAttributes<HTMLDivElement>>;
export interface NumberFieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
}
export declare const NumberFieldLabel: React.ForwardRefExoticComponent<NumberFieldLabelProps & React.RefAttributes<HTMLLabelElement>>;
export interface NumberFieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const NumberFieldGroup: React.ForwardRefExoticComponent<NumberFieldGroupProps & React.RefAttributes<HTMLDivElement>>;
export interface NumberFieldInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (value: number) => void;
    onNativeChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export declare const NumberFieldInput: React.ForwardRefExoticComponent<NumberFieldInputProps & React.RefAttributes<HTMLInputElement>>;
export interface NumberFieldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
export declare const NumberFieldDecrement: React.ForwardRefExoticComponent<NumberFieldButtonProps & React.RefAttributes<HTMLButtonElement>>;
export declare const NumberFieldIncrement: React.ForwardRefExoticComponent<NumberFieldButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=number-field.d.ts.map