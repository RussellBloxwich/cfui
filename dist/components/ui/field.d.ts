import * as React from "react";
import { type LabelProps } from "./label.js";
                     
export interface FieldContextValue {
    id: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string | boolean;
    descriptionId: string;
    errorId: string;
}
declare const FieldContext: React.Context<FieldContextValue | undefined>;
export declare function useFieldContext(): FieldContextValue;
export type FieldOrientation = "vertical" | "horizontal" | "responsive";
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
    id?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string | boolean;
    orientation?: FieldOrientation;
}
declare const Field: React.ForwardRefExoticComponent<FieldProps & React.RefAttributes<HTMLDivElement>>;
export interface FieldLabelProps extends Omit<LabelProps, "htmlFor"> {
    htmlFor?: string;
}
declare const FieldLabel: React.ForwardRefExoticComponent<FieldLabelProps & React.RefAttributes<HTMLLabelElement>>;
export interface FieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
}
declare const FieldDescription: React.ForwardRefExoticComponent<FieldDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
    errors?: Array<{
        message?: string;
    } | undefined>;
}
declare const FieldError: React.ForwardRefExoticComponent<FieldErrorProps & React.RefAttributes<HTMLParagraphElement>>;
export interface FieldContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const FieldContent: React.ForwardRefExoticComponent<FieldContentProps & React.RefAttributes<HTMLDivElement>>;
export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const FieldGroup: React.ForwardRefExoticComponent<FieldGroupProps & React.RefAttributes<HTMLDivElement>>;
export interface FieldSetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
}
declare const FieldSet: React.ForwardRefExoticComponent<FieldSetProps & React.RefAttributes<HTMLFieldSetElement>>;
declare const Fieldset: React.ForwardRefExoticComponent<FieldSetProps & React.RefAttributes<HTMLFieldSetElement>>;
export interface FieldLegendProps extends React.HTMLAttributes<HTMLLegendElement> {
    variant?: "legend" | "label";
}
declare const FieldLegend: React.ForwardRefExoticComponent<FieldLegendProps & React.RefAttributes<HTMLLegendElement>>;
export interface FieldTitleProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const FieldTitle: React.ForwardRefExoticComponent<FieldTitleProps & React.RefAttributes<HTMLDivElement>>;
export interface FieldSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const FieldSeparator: React.ForwardRefExoticComponent<FieldSeparatorProps & React.RefAttributes<HTMLDivElement>>;
export { Field, FieldLabel, FieldDescription, FieldError, FieldContext, FieldContent, FieldGroup, FieldLegend, FieldSeparator, FieldSet, Fieldset, FieldTitle, };
//# sourceMappingURL=field.d.ts.map