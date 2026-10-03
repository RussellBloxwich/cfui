import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { Dialog, DialogContent } from "./dialog.js";
                       
const Command = React.forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive, { ref: ref, "data-cfui-component": "Command", className: cn("cfui-command", className), ...props })));
Command.displayName = CommandPrimitive.displayName;
const CommandDialog = ({ children, dialogContentClassName, ...props }) => {
    return (_jsx(Dialog, { ...props, children: _jsx(DialogContent, { "data-cfui-component": "Command", "data-cfui-part": "dialog-content", className: cn("cfui-command-dialog-content", dialogContentClassName), children: _jsx(Command, { className: "cfui-command-dialog-command", children: children }) }) }));
};
const CommandInput = React.forwardRef(({ className, ...props }, ref) => (_jsxs("div", { "data-cfui-component": "Command", "data-cfui-part": "input-wrapper", className: "cfui-command-input-wrapper", "cmdk-input-wrapper": "", children: [_jsx(MagnifyingGlassIcon, { className: "cfui-command-search-icon" }), _jsx(CommandPrimitive.Input, { ref: ref, "data-cfui-component": "Command", "data-cfui-part": "input", className: cn("cfui-command-input", className), ...props })] })));
CommandInput.displayName = CommandPrimitive.Input.displayName;
const CommandList = React.forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.List, { ref: ref, "data-cfui-component": "Command", "data-cfui-part": "list", className: cn("cfui-command-list", className), ...props })));
CommandList.displayName = CommandPrimitive.List.displayName;
const CommandEmpty = React.forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.Empty, { ref: ref, "data-cfui-component": "Command", "data-cfui-part": "empty", className: cn("cfui-command-empty", className), ...props })));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.Group, { ref: ref, "data-cfui-component": "Command", "data-cfui-part": "group", className: cn("cfui-command-group", className), ...props })));
CommandGroup.displayName = CommandPrimitive.Group.displayName;
const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.Separator, { ref: ref, "data-cfui-component": "Command", "data-cfui-part": "separator", className: cn("cfui-command-separator", className), ...props })));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;
const CommandItem = React.forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.Item, { ref: ref, "data-cfui-component": "Command", "data-cfui-part": "item", className: cn("cfui-command-item", className), ...props })));
CommandItem.displayName = CommandPrimitive.Item.displayName;
const CommandShortcut = ({ className, ...props }) => {
    return (_jsx("span", { "data-cfui-component": "Command", "data-cfui-part": "shortcut", className: cn("cfui-command-shortcut", className), ...props }));
};
CommandShortcut.displayName = "CommandShortcut";
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, };
//# sourceMappingURL=command.js.map