import * as React from "react";
                               
export interface SensitiveInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    revealed?: boolean;
    defaultRevealed?: boolean;
    onRevealedChange?: (revealed: boolean) => void;
    showCopy?: boolean;
    containerClassName?: string;
}
interface SensitiveInputContextValue {
    revealed: boolean;
    toggleRevealed: () => void;
    disabled?: boolean;
    readOnly?: boolean;
    value?: string | number | readonly string[];
}
export declare function useSensitiveInputContext(): SensitiveInputContextValue;
export declare const SensitiveInputContainer: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    revealed?: boolean;
    defaultRevealed?: boolean;
    onRevealedChange?: (revealed: boolean) => void;
    disabled?: boolean;
    readOnly?: boolean;
    value?: string | number | readonly string[];
} & React.RefAttributes<HTMLDivElement>>;
export declare const SensitiveInputRoot: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    revealed?: boolean;
    defaultRevealed?: boolean;
    onRevealedChange?: (revealed: boolean) => void;
    disabled?: boolean;
    readOnly?: boolean;
    value?: string | number | readonly string[];
} & React.RefAttributes<HTMLDivElement>>;
export interface SensitiveInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
}
export declare const SensitiveInputField: React.ForwardRefExoticComponent<SensitiveInputFieldProps & React.RefAttributes<HTMLInputElement>>;
export interface SensitiveInputRevealProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
export declare const SensitiveInputReveal: React.ForwardRefExoticComponent<SensitiveInputRevealProps & React.RefAttributes<HTMLButtonElement>>;
export declare const SensitiveInputToggle: React.ForwardRefExoticComponent<SensitiveInputRevealProps & React.RefAttributes<HTMLButtonElement>>;
export interface SensitiveInputCopyProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    textToCopy?: string;
    copyTimeout?: number;
}
export declare const SensitiveInputCopy: React.ForwardRefExoticComponent<SensitiveInputCopyProps & React.RefAttributes<HTMLButtonElement>>;
export declare const SensitiveInput: React.ForwardRefExoticComponent<SensitiveInputProps & React.RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=sensitive-input.d.ts.map