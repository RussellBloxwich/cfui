import * as React from "react";
                         
export interface TagInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value?: string[];
    defaultValue?: string[];
    onChange?: (tags: string[]) => void;
    onAddTag?: (tag: string) => void;
    onRemoveTag?: (index: number) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    maxTags?: number;
    delimiters?: string[];
    allowDuplicates?: boolean;
    validateTag?: (tag: string) => boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
interface TagInputContextValue {
    tags: string[];
    removeTag: (index: number) => void;
    disabled?: boolean;
    readOnly?: boolean;
}
export declare function useTagInputContext(): TagInputContextValue;
export declare const TagInput: React.ForwardRefExoticComponent<TagInputProps & React.RefAttributes<HTMLDivElement>>;
export interface TagInputListProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const TagInputList: React.ForwardRefExoticComponent<TagInputListProps & React.RefAttributes<HTMLDivElement>>;
export interface TagInputItemProps extends React.HTMLAttributes<HTMLSpanElement> {
    index: number;
}
export declare const TagInputItem: React.ForwardRefExoticComponent<TagInputItemProps & React.RefAttributes<HTMLSpanElement>>;
export declare const Tag: React.ForwardRefExoticComponent<TagInputItemProps & React.RefAttributes<HTMLSpanElement>>;
export interface TagInputRemoveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    index: number;
}
export declare const TagInputRemove: React.ForwardRefExoticComponent<TagInputRemoveProps & React.RefAttributes<HTMLButtonElement>>;
export interface TagInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
}
export declare const TagInputField: React.ForwardRefExoticComponent<TagInputFieldProps & React.RefAttributes<HTMLInputElement>>;
export declare const TagInputInput: React.ForwardRefExoticComponent<TagInputFieldProps & React.RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=tag-input.d.ts.map