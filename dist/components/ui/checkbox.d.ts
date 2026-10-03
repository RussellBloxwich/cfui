import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
                        
export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    indeterminate?: boolean;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLButtonElement>>;
declare const CheckboxIndicator: React.ForwardRefExoticComponent<CheckboxPrimitive.CheckboxIndicatorProps & React.RefAttributes<HTMLSpanElement>>;
export { Checkbox, CheckboxIndicator };
//# sourceMappingURL=checkbox.d.ts.map