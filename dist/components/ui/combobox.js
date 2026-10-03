import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import { CaretDownIcon, CaretUpDownIcon, CheckIcon, XIcon, } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                        
const ComboboxContext = React.createContext(null);
function useComboboxContext(componentName) {
    const context = React.useContext(ComboboxContext);
    if (!context) {
        throw new Error(`${componentName} must be used within a Combobox.`);
    }
    return context;
}
export function useComboboxAnchor() {
    const context = React.useContext(ComboboxContext);
    const fallbackRef = React.useRef(null);
    return context ? context.anchorRef : fallbackRef;
}
function isStructuralRecord(item) {
    return typeof item === "object" && item !== null;
}
const defaultFilter = (itemValue, search) => itemValue.toLowerCase().includes(search.toLowerCase());
const defaultItemToStringValue = (item) => {
    if (item == null)
        return "";
    if (typeof item === "string")
        return item;
    return item.label ?? item.value ?? item.name ?? String(item);
};
export const Combobox = (props) => {
    const { children, items = [], itemToStringValue = defaultItemToStringValue, open: controlledOpen, defaultOpen = false, onOpenChange, disabled = false, autoHighlight = true, filter = defaultFilter, inputValue: controlledInput, defaultInputValue = "", onInputValueChange, className, asChild = false, } = props;
    const multiple = props.multiple === true;
    const isValueControlled = "value" in props && props.value !== undefined;
    const controlledValue = props.value;
    const defaultValue = props.defaultValue;
    const onValueChange = props.onValueChange;
    const [internalValue, setInternalValue] = React.useState(() => {
        if (defaultValue !== undefined)
            return defaultValue;
        return multiple ? [] : null;
    });
    const value = isValueControlled ? controlledValue : internalValue;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpenControlled = controlledOpen !== undefined;
    const open = isOpenControlled ? controlledOpen : internalOpen;
    const [internalInput, setInternalInput] = React.useState(defaultInputValue);
    const [isEditing, setIsEditing] = React.useState(Boolean(defaultInputValue));
    const isInputControlled = controlledInput !== undefined;
    const [registeredItems, setRegisteredItems] = React.useState([]);
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const anchorRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    const uniqueId = React.useId();
    const listId = `cfui-combobox-list-${uniqueId}`;
    const inputId = `cfui-combobox-input-${uniqueId}`;
    const toStr = React.useCallback((item) => {
        if (item == null)
            return "";
        if (typeof item === "string")
            return item;
        try {
            return itemToStringValue(item) ?? "";
        }
        catch {
            return defaultItemToStringValue(item);
        }
    }, [itemToStringValue]);
    const resolveItem = React.useCallback((val) => {
        if (val !== null && typeof val === "object") {
            return val;
        }
        if (items && items.length > 0) {
            const found = items.find((it) => {
                if (toStr(it) === val)
                    return true;
                if (isStructuralRecord(it)) {
                    const hasMatchingValue = "value" in it && it.value === val;
                    const hasMatchingId = "id" in it && it.id === val;
                    return hasMatchingValue || hasMatchingId;
                }
                return false;
            });
            if (found !== undefined)
                return found;
        }
        const rec = registeredItems.find((it) => it.value === val || toStr(it.value) === val);
        if (rec && typeof rec.value === "object" && rec.value !== null) {
            return rec.value;
        }
        return val;
    }, [items, registeredItems, toStr]);
    const getDisplayLabel = React.useCallback((val) => {
        if (val == null || val === "")
            return "";
        if (typeof val === "string") {
            const rec = registeredItems.find((it) => it.value === val || (it.id && it.id === val));
            if (rec?.label)
                return rec.label;
            if (items && items.length > 0) {
                const found = items.find((it) => {
                    if (toStr(it) === val)
                        return true;
                    if (isStructuralRecord(it)) {
                        return (("value" in it && it.value === val) ||
                            ("id" in it && it.id === val));
                    }
                    return false;
                });
                if (found !== undefined)
                    return toStr(found);
            }
            return val;
        }
        const rec = registeredItems.find((it) => it.value === val ||
            (isStructuralRecord(val) &&
                isStructuralRecord(it.value) &&
                "id" in val &&
                "id" in it.value &&
                val.id !== undefined &&
                val.id === it.value.id));
        if (rec?.label)
            return rec.label;
        return toStr(val);
    }, [items, registeredItems, toStr]);
    const currentInputValue = React.useMemo(() => {
        if (isInputControlled) {
            return controlledInput ?? "";
        }
        if (multiple) {
            return internalInput;
        }
        if (isEditing) {
            return internalInput;
        }
        return getDisplayLabel(value);
    }, [
        controlledInput,
        getDisplayLabel,
        internalInput,
        isEditing,
        isInputControlled,
        multiple,
        value,
    ]);
    const inputValue = currentInputValue;
    const setOpen = React.useCallback((nextOpen) => {
        if (disabled)
            return;
        if (!isOpenControlled) {
            setInternalOpen(nextOpen);
        }
        if (!nextOpen) {
            setIsEditing(false);
            setInternalInput("");
        }
        onOpenChange?.(nextOpen);
    }, [disabled, isOpenControlled, onOpenChange]);
    const setInputValue = React.useCallback((nextInput) => {
        setIsEditing(true);
        if (!isInputControlled) {
            setInternalInput(nextInput);
        }
        onInputValueChange?.(nextInput);
    }, [isInputControlled, onInputValueChange]);
    const setValue = React.useCallback((nextVal) => {
        if (!isValueControlled) {
            setInternalValue(nextVal);
        }
        if (multiple) {
            onValueChange?.(nextVal);
        }
        else {
            onValueChange?.(nextVal);
        }
    }, [isValueControlled, multiple, onValueChange]);
    const registerItem = React.useCallback((record) => {
        setRegisteredItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === record.id);
            if (existingIndex !== -1) {
                const existing = prev[existingIndex];
                if (existing.value === record.value &&
                    existing.label === record.label &&
                    existing.disabled === record.disabled &&
                    existing.onSelect === record.onSelect) {
                    return prev;
                }
                const next = [...prev];
                next[existingIndex] = record;
                return next;
            }
            return [...prev, record];
        });
        return () => {
            setRegisteredItems((prev) => {
                if (!prev.some((item) => item.id === record.id))
                    return prev;
                return prev.filter((item) => item.id !== record.id);
            });
        };
    }, []);
    const visibleItems = React.useMemo(() => {
        const shouldFilter = isInputControlled
            ? Boolean(inputValue && inputValue.trim() !== "")
            : Boolean(isEditing && inputValue && inputValue.trim() !== "");
        if (!shouldFilter) {
            return registeredItems;
        }
        return registeredItems.filter((item) => {
            const strVal = toStr(item.value);
            const matchVal = filter(strVal, inputValue);
            const matchLabel = item.label ? filter(item.label, inputValue) : false;
            return matchVal || matchLabel;
        });
    }, [filter, inputValue, isEditing, isInputControlled, registeredItems, toStr]);
    React.useEffect(() => {
        if (open && autoHighlight && visibleItems.length > 0) {
            const firstEnabledIndex = visibleItems.findIndex((it) => !it.disabled);
            setHighlightedIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : 0);
        }
        else if (!open) {
            setHighlightedIndex(-1);
        }
    }, [open, autoHighlight, visibleItems]);
    const isItemSelected = React.useCallback((itemVal) => {
        const strTarget = toStr(itemVal);
        if (multiple) {
            if (!Array.isArray(value))
                return false;
            return value.some((v) => v === itemVal || toStr(v) === strTarget);
        }
        if (value == null || value === "")
            return false;
        return value === itemVal || toStr(value) === strTarget;
    }, [multiple, toStr, value]);
    const selectItem = React.useCallback((rawVal) => {
        if (disabled)
            return;
        const resolvedVal = resolveItem(rawVal);
        const targetStr = toStr(resolvedVal);
        const itemRecord = registeredItems.find((it) => it.value === rawVal ||
            toStr(it.value) === targetStr ||
            (it.id && it.id === rawVal));
        if (multiple) {
            const currentArr = Array.isArray(value) ? value : [];
            const exists = currentArr.some((v) => v === resolvedVal || toStr(v) === targetStr);
            const next = exists
                ? currentArr.filter((v) => v !== resolvedVal && toStr(v) !== targetStr)
                : [...currentArr, resolvedVal];
            setValue(next);
            setIsEditing(false);
            setInternalInput("");
        }
        else {
            setValue(resolvedVal);
            setIsEditing(false);
            setInternalInput("");
            setOpen(false);
        }
        itemRecord?.onSelect?.(resolvedVal);
    }, [
        disabled,
        multiple,
        registeredItems,
        resolveItem,
        setOpen,
        setValue,
        toStr,
        value,
    ]);
    const removeItem = React.useCallback((rawVal) => {
        if (disabled)
            return;
        const targetStr = toStr(rawVal);
        if (multiple) {
            const currentArr = Array.isArray(value) ? value : [];
            const next = currentArr.filter((v) => v !== rawVal && toStr(v) !== targetStr);
            setValue(next);
        }
        else {
            setValue(null);
            setIsEditing(false);
            setInternalInput("");
        }
    }, [disabled, multiple, setValue, toStr, value]);
    const clear = React.useCallback(() => {
        if (disabled)
            return;
        setValue(multiple ? [] : null);
        setIsEditing(false);
        setInternalInput("");
        if (!isInputControlled) {
            onInputValueChange?.("");
        }
    }, [disabled, isInputControlled, multiple, onInputValueChange, setValue]);
    const navigateHighlight = React.useCallback((direction) => {
        if (visibleItems.length === 0)
            return;
        const len = visibleItems.length;
        const hasEnabled = visibleItems.some((it) => !it.disabled);
        if (!hasEnabled)
            return;
        setHighlightedIndex((prev) => {
            let start = prev;
            if (start === -1) {
                start = direction === 1 ? -1 : len;
            }
            let next = start;
            for (let i = 0; i < len; i++) {
                next = (next + direction + len) % len;
                if (!visibleItems[next]?.disabled) {
                    return next;
                }
            }
            return prev;
        });
    }, [visibleItems]);
    const onInputKeyDown = React.useCallback((e) => {
        if (disabled)
            return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!open) {
                setOpen(true);
            }
            else {
                navigateHighlight(1);
            }
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) {
                setOpen(true);
            }
            else {
                navigateHighlight(-1);
            }
        }
        else if (e.key === "Enter") {
            if (open && highlightedIndex >= 0 && visibleItems[highlightedIndex]) {
                const item = visibleItems[highlightedIndex];
                if (!item.disabled) {
                    e.preventDefault();
                    selectItem(item.value);
                }
            }
        }
        else if (e.key === "Escape") {
            if (open) {
                e.preventDefault();
                setOpen(false);
            }
        }
        else if (e.key === "Tab") {
            if (open) {
                setOpen(false);
            }
        }
    }, [
        disabled,
        highlightedIndex,
        navigateHighlight,
        open,
        selectItem,
        setOpen,
        visibleItems,
    ]);
    const activeDescendantId = highlightedIndex >= 0 && visibleItems[highlightedIndex]
        ? visibleItems[highlightedIndex].id
        : undefined;
    const contextValue = React.useMemo(() => ({
        multiple,
        disabled,
        open,
        setOpen,
        value,
        setValue,
        selectItem,
        removeItem,
        clear,
        inputValue,
        setInputValue,
        highlightedIndex,
        setHighlightedIndex,
        items,
        itemToStringValue: toStr,
        registerItem,
        visibleItems,
        anchorRef,
        inputRef,
        triggerRef,
        listId,
        inputId,
        activeDescendantId,
        onInputKeyDown,
        navigateHighlight,
        isItemSelected,
        autoHighlight,
    }), [
        activeDescendantId,
        autoHighlight,
        clear,
        disabled,
        highlightedIndex,
        inputId,
        inputValue,
        isItemSelected,
        items,
        listId,
        multiple,
        navigateHighlight,
        onInputKeyDown,
        open,
        registerItem,
        removeItem,
        selectItem,
        setInputValue,
        setOpen,
        setValue,
        toStr,
        value,
        visibleItems,
    ]);
    const Comp = asChild ? Slot : "div";
    return (_jsx(PopoverPrimitive.Root, { open: open, onOpenChange: setOpen, children: _jsx(ComboboxContext.Provider, { value: contextValue, children: _jsx(Comp, { ref: anchorRef, "data-cfui-component": "Combobox", className: cn("cfui-combobox", className), children: children }) }) }));
};
Combobox.displayName = "Combobox";
export const ComboboxTrigger = React.forwardRef(({ className, children, asChild = false, onClick, onKeyDown, ...props }, ref) => {
    const context = useComboboxContext("ComboboxTrigger");
    const Comp = asChild ? Slot : "button";
    const mergedRef = React.useCallback((node) => {
        context.triggerRef.current =
            node;
        if (typeof ref === "function") {
            ref(node);
        }
        else if (ref) {
            ref.current = node;
        }
    }, [context.triggerRef, ref]);
    return (_jsxs(Comp, { ref: mergedRef, type: "button", role: "combobox", "aria-expanded": context.open, "aria-haspopup": "listbox", "aria-controls": context.listId, "aria-activedescendant": context.activeDescendantId, "data-cfui-component": "Combobox", "data-cfui-part": "trigger", disabled: context.disabled, className: cn("cfui-combobox-trigger", className), onClick: (e) => {
            onClick?.(e);
            if (!e.defaultPrevented) {
                context.setOpen(!context.open);
            }
        }, onKeyDown: (e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented || context.disabled)
                return;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                if (!context.open) {
                    context.setOpen(true);
                }
                else {
                    context.navigateHighlight(e.key === "ArrowDown" ? 1 : -1);
                }
            }
            else if (e.key === "Enter" || e.key === " ") {
                if (!context.open) {
                    e.preventDefault();
                    context.setOpen(true);
                }
                else if (context.highlightedIndex >= 0) {
                    const item = context.visibleItems[context.highlightedIndex];
                    if (item && !item.disabled) {
                        e.preventDefault();
                        context.selectItem(item.value);
                    }
                }
            }
            else if (e.key === "Escape") {
                if (context.open) {
                    e.preventDefault();
                    context.setOpen(false);
                }
            }
        }, ...props, children: [children, !asChild && (_jsx("span", { "aria-hidden": "true", className: "cfui-combobox-trigger-icon", children: _jsx(CaretDownIcon, { className: "cfui-combobox-trigger-svg" }) }))] }));
});
ComboboxTrigger.displayName = "ComboboxTrigger";
export const ComboboxInput = React.forwardRef(({ className, wrapperClassName, showTrigger = true, showClear = false, value: controlledValue, onChange, onKeyDown, placeholder = "Search...", ...props }, ref) => {
    const context = useComboboxContext("ComboboxInput");
    const localInputRef = React.useRef(null);
    const mergedRef = React.useCallback((node) => {
        localInputRef.current = node;
        context.inputRef.current =
            node;
        if (typeof ref === "function") {
            ref(node);
        }
        else if (ref) {
            ref.current = node;
        }
    }, [context.inputRef, ref]);
    const displayValue = controlledValue !== undefined ? controlledValue : context.inputValue;
    const hasSelection = context.multiple
        ? Array.isArray(context.value) && context.value.length > 0
        : context.value != null && context.value !== "";
    const canClear = Boolean(displayValue) || hasSelection;
    return (_jsxs("div", { "data-cfui-component": "Combobox", "data-cfui-part": "input-wrapper", className: cn("cfui-combobox-input-wrapper", context.disabled && "cfui-combobox-input-wrapper-disabled", wrapperClassName), children: [_jsx("input", { ref: mergedRef, id: context.inputId, role: "combobox", type: "text", autoComplete: "off", "aria-autocomplete": "list", "aria-expanded": context.open, "aria-controls": context.listId, "aria-activedescendant": context.activeDescendantId, "aria-disabled": context.disabled, disabled: context.disabled, value: displayValue, placeholder: placeholder, "data-cfui-component": "Combobox", "data-cfui-part": "input", className: cn("cfui-combobox-input", className), onChange: (e) => {
                    onChange?.(e);
                    if (!e.defaultPrevented) {
                        context.setInputValue(e.target.value);
                        if (!context.open) {
                            context.setOpen(true);
                        }
                    }
                }, onKeyDown: (e) => {
                    onKeyDown?.(e);
                    if (!e.defaultPrevented) {
                        context.onInputKeyDown(e);
                    }
                }, ...props }), _jsxs("div", { className: "cfui-combobox-input-actions", children: [showClear && canClear && !context.disabled && (_jsx("button", { type: "button", tabIndex: -1, "aria-label": "Clear selection", "data-cfui-component": "Combobox", "data-cfui-part": "clear", className: "cfui-combobox-clear-button", onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            context.clear();
                            localInputRef.current?.focus();
                        }, children: _jsx(XIcon, { className: "cfui-combobox-clear-svg" }) })), showTrigger && (_jsx("button", { type: "button", tabIndex: -1, "aria-label": "Toggle popup", "data-cfui-component": "Combobox", "data-cfui-part": "input-trigger", disabled: context.disabled, className: "cfui-combobox-toggle-button", onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            context.setOpen(!context.open);
                            localInputRef.current?.focus();
                        }, children: _jsx(CaretUpDownIcon, { className: "cfui-combobox-caret-svg" }) }))] })] }));
});
ComboboxInput.displayName = "ComboboxInput";
export const ComboboxChips = React.forwardRef(({ className, children, asChild = false, onClick, ...props }, ref) => {
    const context = useComboboxContext("ComboboxChips");
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, "data-cfui-component": "Combobox", "data-cfui-part": "chips", className: cn("cfui-combobox-chips", context.disabled && "cfui-combobox-chips-disabled", className), onClick: (e) => {
            onClick?.(e);
            if (!e.defaultPrevented) {
                context.inputRef.current?.focus();
            }
        }, ...props, children: children }));
});
ComboboxChips.displayName = "ComboboxChips";
export const ComboboxChip = React.forwardRef(({ className, children, value, showRemove = true, onRemove, disabled = false, ...props }, ref) => {
    const context = useComboboxContext("ComboboxChip");
    const isChipDisabled = disabled || context.disabled;
    const label = context.itemToStringValue(value);
    return (_jsxs("div", { ref: ref, "data-cfui-component": "Combobox", "data-cfui-part": "chip", className: cn("cfui-combobox-chip", isChipDisabled && "cfui-combobox-chip-disabled", className), ...props, children: [_jsx("span", { className: "cfui-combobox-chip-label truncate", children: children ?? label }), showRemove && !isChipDisabled && (_jsx("button", { type: "button", tabIndex: -1, "aria-label": `Remove ${label}`, className: "cfui-combobox-chip-remove", onClick: (e) => {
                    e.stopPropagation();
                    if (onRemove) {
                        onRemove();
                    }
                    else {
                        context.removeItem(value);
                    }
                }, children: _jsx(XIcon, { className: "cfui-combobox-chip-remove-svg" }) }))] }));
});
ComboboxChip.displayName = "ComboboxChip";
export const ComboboxChipsInput = React.forwardRef(({ className, value: controlledValue, onChange, onKeyDown, ...props }, ref) => {
    const context = useComboboxContext("ComboboxChipsInput");
    const mergedRef = React.useCallback((node) => {
        context.inputRef.current =
            node;
        if (typeof ref === "function") {
            ref(node);
        }
        else if (ref) {
            ref.current = node;
        }
    }, [context.inputRef, ref]);
    const displayValue = controlledValue !== undefined ? controlledValue : context.inputValue;
    return (_jsx("input", { ref: mergedRef, id: context.inputId, role: "combobox", type: "text", autoComplete: "off", "aria-autocomplete": "list", "aria-expanded": context.open, "aria-controls": context.listId, "aria-activedescendant": context.activeDescendantId, "aria-disabled": context.disabled, disabled: context.disabled, value: displayValue, "data-cfui-component": "Combobox", "data-cfui-part": "chips-input", className: cn("cfui-combobox-chips-input", className), onChange: (e) => {
            onChange?.(e);
            if (!e.defaultPrevented) {
                context.setInputValue(e.target.value);
                if (!context.open) {
                    context.setOpen(true);
                }
            }
        }, onKeyDown: (e) => {
            onKeyDown?.(e);
            if (!e.defaultPrevented) {
                if (e.key === "Backspace" &&
                    displayValue === "" &&
                    context.multiple &&
                    Array.isArray(context.value) &&
                    context.value.length > 0) {
                    const lastVal = context.value[context.value.length - 1];
                    context.removeItem(lastVal);
                }
                else {
                    context.onInputKeyDown(e);
                }
            }
        }, ...props }));
});
ComboboxChipsInput.displayName = "ComboboxChipsInput";
export const ComboboxValue = React.forwardRef(({ className, placeholder, children, ...props }, ref) => {
    const context = useComboboxContext("ComboboxValue");
    let content = null;
    if (typeof children === "function") {
        content = children(context.value);
    }
    else if (children) {
        content = children;
    }
    else if (context.multiple && Array.isArray(context.value)) {
        content =
            context.value.length > 0
                ? context.value.map((v) => context.itemToStringValue(v)).join(", ")
                : null;
    }
    else if (context.value != null && context.value !== "") {
        content = context.itemToStringValue(context.value);
    }
    const isPlaceholder = !content;
    return (_jsx("span", { ref: ref, "data-cfui-component": "Combobox", "data-cfui-part": "value", "data-placeholder": isPlaceholder ? "" : undefined, className: cn("cfui-combobox-value", className), ...props, children: content ?? placeholder }));
});
ComboboxValue.displayName = "ComboboxValue";
export const ComboboxContent = React.forwardRef(({ className, children, anchor, side = "bottom", align = "start", sideOffset = 4, alignOffset = 0, onOpenAutoFocus, onCloseAutoFocus, onKeyDown, ...props }, ref) => {
    const context = useComboboxContext("ComboboxContent");
    const activeAnchor = anchor ?? context.anchorRef;
    return (_jsxs(_Fragment, { children: [activeAnchor && _jsx(PopoverPrimitive.Anchor, { virtualRef: activeAnchor }), _jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Content, { ref: ref, side: side, align: align, sideOffset: sideOffset, alignOffset: alignOffset, onOpenAutoFocus: (e) => {
                        onOpenAutoFocus?.(e);
                        if (!e.defaultPrevented) {
                            e.preventDefault();
                        }
                    }, onCloseAutoFocus: (e) => {
                        onCloseAutoFocus?.(e);
                        if (!e.defaultPrevented) {
                            e.preventDefault();
                        }
                    }, onKeyDown: (e) => {
                        onKeyDown?.(e);
                        if (!e.defaultPrevented) {
                            context.onInputKeyDown(e);
                        }
                    }, "data-cfui-component": "Combobox", "data-cfui-part": "content", className: cn("cfui-combobox-content", className), ...props, children: children }) })] }));
});
ComboboxContent.displayName = "ComboboxContent";
export const ComboboxList = React.forwardRef(({ className, children, onKeyDown, ...props }, ref) => {
    const context = useComboboxContext("ComboboxList");
    return (_jsx("div", { ref: ref, id: context.listId, role: "listbox", "aria-multiselectable": context.multiple, "data-cfui-component": "Combobox", "data-cfui-part": "list", className: cn("cfui-combobox-list", className), onKeyDown: (e) => {
            onKeyDown?.(e);
            if (!e.defaultPrevented) {
                context.onInputKeyDown(e);
            }
        }, ...props, children: typeof children === "function" ? children(context.items) : children }));
});
ComboboxList.displayName = "ComboboxList";
export const ComboboxCollection = ({ items, children, className, }) => {
    const context = useComboboxContext("ComboboxCollection");
    const collectionItems = items ?? context.items;
    return (_jsx("div", { "data-cfui-component": "Combobox", "data-cfui-part": "collection", className: cn("cfui-combobox-collection", className), children: typeof children === "function"
            ? collectionItems.map((item, index) => children(item, index))
            : children }));
};
ComboboxCollection.displayName = "ComboboxCollection";
export const ComboboxItem = React.forwardRef(({ className, children, value, disabled = false, onSelect, onClick, onMouseEnter, asChild = false, ...props }, ref) => {
    const context = useComboboxContext("ComboboxItem");
    const itemId = React.useId();
    const textContent = typeof children === "string"
        ? children
        : typeof children === "number"
            ? String(children)
            : undefined;
    const { registerItem } = context;
    React.useEffect(() => {
        return registerItem({
            id: itemId,
            value,
            label: textContent,
            disabled,
            onSelect,
        });
    }, [registerItem, disabled, itemId, textContent, value, onSelect]);
    const isSelected = context.isItemSelected(value);
    const visibleIndex = context.visibleItems.findIndex((item) => item.id === itemId ||
        item.value === value ||
        context.itemToStringValue(item.value) === context.itemToStringValue(value));
    const isVisible = visibleIndex !== -1;
    const isActive = context.highlightedIndex === visibleIndex;
    if (!isVisible) {
        return null;
    }
    const handleClick = (e) => {
        onClick?.(e);
        if (!e.defaultPrevented && !disabled) {
            context.selectItem(value);
        }
    };
    const handleMouseEnter = (e) => {
        onMouseEnter?.(e);
        if (!disabled && visibleIndex >= 0) {
            context.setHighlightedIndex(visibleIndex);
        }
    };
    const itemProps = {
        id: itemId,
        role: "option",
        "aria-selected": isSelected,
        "aria-disabled": disabled,
        "data-cfui-component": "Combobox",
        "data-cfui-part": "item",
        "data-selected": isSelected ? "" : undefined,
        "data-highlighted": isActive ? "" : undefined,
        "data-disabled": disabled ? "" : undefined,
        className: cn("cfui-combobox-item", isActive && "cfui-combobox-item-active", isSelected && "cfui-combobox-item-selected", disabled && "cfui-combobox-item-disabled", className),
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        ...props,
    };
    if (asChild && React.isValidElement(children)) {
        return (_jsx(Slot, { ref: ref, ...itemProps, children: children }));
    }
    return (_jsx("div", { ref: ref, ...itemProps, children: typeof children === "function" ? (children({ selected: isSelected, active: isActive })) : (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": "true", className: "cfui-combobox-item-indicator", children: isSelected && (_jsx(CheckIcon, { className: "cfui-combobox-item-check-svg", weight: "bold" })) }), _jsx("span", { className: "cfui-combobox-item-text", children: children })] })) }));
});
ComboboxItem.displayName = "ComboboxItem";
export const ComboboxEmpty = React.forwardRef(({ className, children, ...props }, ref) => {
    const context = useComboboxContext("ComboboxEmpty");
    if (context.visibleItems.length > 0) {
        return null;
    }
    return (_jsx("div", { ref: ref, role: "presentation", "data-cfui-component": "Combobox", "data-cfui-part": "empty", className: cn("cfui-combobox-empty", className), ...props, children: children ?? "No results found." }));
});
ComboboxEmpty.displayName = "ComboboxEmpty";
export const ComboboxGroup = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, role: "group", "data-cfui-component": "Combobox", "data-cfui-part": "group", className: cn("cfui-combobox-group", className), ...props }));
});
ComboboxGroup.displayName = "ComboboxGroup";
export const ComboboxLabel = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, "data-cfui-component": "Combobox", "data-cfui-part": "label", className: cn("cfui-combobox-label", className), ...props }));
});
ComboboxLabel.displayName = "ComboboxLabel";
export const ComboboxSeparator = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, role: "separator", "data-cfui-component": "Combobox", "data-cfui-part": "separator", className: cn("cfui-combobox-separator", className), ...props }));
});
ComboboxSeparator.displayName = "ComboboxSeparator";
//# sourceMappingURL=combobox.js.map