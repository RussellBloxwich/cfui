import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
                        
export declare function useComboboxAnchor(): React.RefObject<HTMLDivElement | null>;
export interface ComboboxBaseProps<T = any> {
    children?: React.ReactNode;
    items?: T[];
    itemToStringValue?: (item: T) => string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    autoHighlight?: boolean;
    filter?: (itemValue: string, search: string) => boolean;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string) => void;
    className?: string;
    asChild?: boolean;
}
export interface ComboboxSingleProps<T = any> extends ComboboxBaseProps<T> {
    multiple?: false;
    value?: T | null;
    defaultValue?: T | null;
    onValueChange?: (value: T | null) => void;
}
export interface ComboboxMultipleProps<T = any> extends ComboboxBaseProps<T> {
    multiple: true;
    value?: T[];
    defaultValue?: T[];
    onValueChange?: (value: T[]) => void;
}
export type ComboboxProps<T = any> = ComboboxSingleProps<T> | ComboboxMultipleProps<T>;
export declare const Combobox: {
    <T = any>(props: ComboboxProps<T>): React.JSX.Element;
    displayName: string;
};
export interface ComboboxTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const ComboboxTrigger: React.ForwardRefExoticComponent<ComboboxTriggerProps & React.RefAttributes<HTMLButtonElement>>;
export interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    showTrigger?: boolean;
    showClear?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    wrapperClassName?: string;
}
export declare const ComboboxInput: React.ForwardRefExoticComponent<ComboboxInputProps & React.RefAttributes<HTMLInputElement>>;
export interface ComboboxChipsProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const ComboboxChips: React.ForwardRefExoticComponent<ComboboxChipsProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxChipProps extends React.HTMLAttributes<HTMLDivElement> {
    value: any;
    showRemove?: boolean;
    onRemove?: () => void;
    disabled?: boolean;
}
export declare const ComboboxChip: React.ForwardRefExoticComponent<ComboboxChipProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxChipsInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare const ComboboxChipsInput: React.ForwardRefExoticComponent<ComboboxChipsInputProps & React.RefAttributes<HTMLInputElement>>;
export interface ComboboxValueProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    placeholder?: string;
    children?: ((val: any) => React.ReactNode) | React.ReactNode;
}
export declare const ComboboxValue: React.ForwardRefExoticComponent<ComboboxValueProps & React.RefAttributes<HTMLSpanElement>>;
export interface ComboboxContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
    anchor?: React.RefObject<HTMLElement | null>;
}
export declare const ComboboxContent: React.ForwardRefExoticComponent<ComboboxContentProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    children?: React.ReactNode | ((items: any[]) => React.ReactNode);
}
export declare const ComboboxList: React.ForwardRefExoticComponent<ComboboxListProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxCollectionProps<T = any> {
    items?: T[];
    children?: React.ReactNode | ((item: T, index: number) => React.ReactNode);
    className?: string;
}
export declare const ComboboxCollection: {
    <T = any>({ items, children, className, }: ComboboxCollectionProps<T>): React.JSX.Element;
    displayName: string;
};
export interface ComboboxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
    value: any;
    disabled?: boolean;
    onSelect?: (value: any) => void;
    children?: React.ReactNode | ((state: {
        selected: boolean;
        active: boolean;
    }) => React.ReactNode);
    asChild?: boolean;
}
export declare const ComboboxItem: React.ForwardRefExoticComponent<ComboboxItemProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const ComboboxEmpty: React.ForwardRefExoticComponent<ComboboxEmptyProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const ComboboxGroup: React.ForwardRefExoticComponent<ComboboxGroupProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxLabelProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const ComboboxLabel: React.ForwardRefExoticComponent<ComboboxLabelProps & React.RefAttributes<HTMLDivElement>>;
export interface ComboboxSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const ComboboxSeparator: React.ForwardRefExoticComponent<ComboboxSeparatorProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=combobox.d.ts.map