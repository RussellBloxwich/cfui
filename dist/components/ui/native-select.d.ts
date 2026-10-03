import * as React from "react";
                             
export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
    sizeVariant?: "default" | "sm" | "lg";
    wrapperClassName?: string;
}
declare const NativeSelect: React.ForwardRefExoticComponent<NativeSelectProps & React.RefAttributes<HTMLSelectElement>>;
export interface NativeSelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
}
declare const NativeSelectOption: React.ForwardRefExoticComponent<NativeSelectOptionProps & React.RefAttributes<HTMLOptionElement>>;
export interface NativeSelectOptGroupProps extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {
}
declare const NativeSelectOptGroup: React.ForwardRefExoticComponent<NativeSelectOptGroupProps & React.RefAttributes<HTMLOptGroupElement>>;
export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
//# sourceMappingURL=native-select.d.ts.map