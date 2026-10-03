import * as React from "react";
                           
export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    sizeVariant?: "default" | "sm" | "lg";
    disabled?: boolean;
    error?: boolean;
}
declare const InputGroup: React.ForwardRefExoticComponent<InputGroupProps & React.RefAttributes<HTMLDivElement>>;
export type InputGroupAddonAlign = "inline-start" | "inline-end" | "block-start" | "block-end" | "inline";
export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: InputGroupAddonAlign;
    /** @deprecated Optional placement alias for backwards compatibility */
    placement?: "prefix" | "suffix" | "inline";
}
declare const InputGroupAddon: React.ForwardRefExoticComponent<InputGroupAddonProps & React.RefAttributes<HTMLDivElement>>;
export interface InputGroupTextProps extends React.HTMLAttributes<HTMLSpanElement> {
}
declare const InputGroupText: React.ForwardRefExoticComponent<InputGroupTextProps & React.RefAttributes<HTMLSpanElement>>;
export interface InputGroupInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}
declare const InputGroupInput: React.ForwardRefExoticComponent<InputGroupInputProps & React.RefAttributes<HTMLInputElement>>;
export interface InputGroupButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    sizeVariant?: "default" | "sm" | "lg";
}
declare const InputGroupButton: React.ForwardRefExoticComponent<InputGroupButtonProps & React.RefAttributes<HTMLButtonElement>>;
export interface InputGroupTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
}
declare const InputGroupTextarea: React.ForwardRefExoticComponent<InputGroupTextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput, InputGroupButton, InputGroupTextarea, };
//# sourceMappingURL=input-group.d.ts.map