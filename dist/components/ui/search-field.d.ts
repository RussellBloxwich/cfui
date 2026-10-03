import * as React from "react";
                            
export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    onClear?: () => void;
    loading?: boolean;
    shortcut?: string;
    sizeVariant?: "default" | "sm" | "lg";
    error?: boolean;
}
declare const SearchField: React.ForwardRefExoticComponent<SearchFieldProps & React.RefAttributes<HTMLInputElement>>;
export interface SearchFieldRootProps extends React.HTMLAttributes<HTMLDivElement> {
    sizeVariant?: "default" | "sm" | "lg";
    disabled?: boolean;
    error?: boolean;
}
declare const SearchFieldRoot: React.ForwardRefExoticComponent<SearchFieldRootProps & React.RefAttributes<HTMLDivElement>>;
export interface SearchFieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}
declare const SearchFieldInput: React.ForwardRefExoticComponent<SearchFieldInputProps & React.RefAttributes<HTMLInputElement>>;
export interface SearchFieldClearProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
declare const SearchFieldClear: React.ForwardRefExoticComponent<SearchFieldClearProps & React.RefAttributes<HTMLButtonElement>>;
export interface SearchFieldIconProps extends React.HTMLAttributes<HTMLSpanElement> {
}
declare const SearchFieldIcon: React.ForwardRefExoticComponent<SearchFieldIconProps & React.RefAttributes<HTMLSpanElement>>;
export { SearchField, SearchFieldRoot, SearchFieldInput, SearchFieldClear, SearchFieldIcon, };
//# sourceMappingURL=search-field.d.ts.map