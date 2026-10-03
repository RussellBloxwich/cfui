import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
                       
declare const Toolbar: React.ForwardRefExoticComponent<Omit<ToolbarPrimitive.ToolbarProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ToolbarButton: React.ForwardRefExoticComponent<Omit<ToolbarPrimitive.ToolbarButtonProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const ToolbarSeparator: React.ForwardRefExoticComponent<Omit<ToolbarPrimitive.ToolbarSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ToolbarLink: React.ForwardRefExoticComponent<Omit<ToolbarPrimitive.ToolbarLinkProps & React.RefAttributes<HTMLAnchorElement>, "ref"> & React.RefAttributes<HTMLAnchorElement>>;
declare const ToolbarToggleGroup: React.ForwardRefExoticComponent<(Omit<ToolbarPrimitive.ToolbarToggleGroupSingleProps & React.RefAttributes<HTMLDivElement>, "ref"> | Omit<ToolbarPrimitive.ToolbarToggleGroupMultipleProps & React.RefAttributes<HTMLDivElement>, "ref">) & React.RefAttributes<HTMLDivElement>>;
declare const ToolbarToggleItem: React.ForwardRefExoticComponent<Omit<ToolbarPrimitive.ToolbarToggleItemProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarLink, ToolbarToggleGroup, ToolbarToggleItem, };
//# sourceMappingURL=toolbar.d.ts.map