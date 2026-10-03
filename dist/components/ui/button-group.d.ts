import * as React from "react";
import type { ButtonProps } from "./button.js";
                            
export interface ButtonGroupContextValue {
    size?: ButtonProps["size"];
    variant?: ButtonProps["variant"];
    orientation?: "horizontal" | "vertical";
    attached?: boolean;
}
export declare const ButtonGroupContext: React.Context<ButtonGroupContextValue>;
export declare const useButtonGroup: () => ButtonGroupContextValue;
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
    attached?: boolean;
    size?: ButtonProps["size"];
    variant?: ButtonProps["variant"];
}
declare const ButtonGroup: React.ForwardRefExoticComponent<ButtonGroupProps & React.RefAttributes<HTMLDivElement>>;
export interface ButtonGroupSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}
declare const ButtonGroupSeparator: React.ForwardRefExoticComponent<ButtonGroupSeparatorProps & React.RefAttributes<HTMLDivElement>>;
export interface ButtonGroupTextProps extends React.HTMLAttributes<HTMLSpanElement> {
}
declare const ButtonGroupText: React.ForwardRefExoticComponent<ButtonGroupTextProps & React.RefAttributes<HTMLSpanElement>>;
export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
//# sourceMappingURL=button-group.d.ts.map