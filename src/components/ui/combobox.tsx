import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import {
  CaretDownIcon,
  CaretUpDownIcon,
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./combobox.css";

interface ItemRecord {
  id: string;
  value: any;
  label?: string;
  disabled?: boolean;
  onSelect?: (value: any) => void;
}

interface ComboboxContextValue {
  multiple: boolean;
  disabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: any;
  setValue: (value: any) => void;
  selectItem: (itemValue: any) => void;
  removeItem: (itemValue: any) => void;
  clear: () => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  items: any[];
  itemToStringValue: (item: any) => string;
  registerItem: (record: ItemRecord) => () => void;
  visibleItems: ItemRecord[];
  anchorRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  listId: string;
  inputId: string;
  activeDescendantId: string | undefined;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  navigateHighlight: (direction: 1 | -1) => void;
  isItemSelected: (itemVal: any) => boolean;
  autoHighlight: boolean;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext(componentName: string) {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a Combobox.`);
  }
  return context;
}

export function useComboboxAnchor(): React.RefObject<HTMLDivElement | null> {
  const context = React.useContext(ComboboxContext);
  const fallbackRef = React.useRef<HTMLDivElement>(null);
  return context ? context.anchorRef : fallbackRef;
}

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

export type ComboboxProps<T = any> =
  | ComboboxSingleProps<T>
  | ComboboxMultipleProps<T>;

interface StructuralRecord {
  value?: unknown;
  id?: unknown;
  [key: string]: unknown;
}

function isStructuralRecord(item: unknown): item is StructuralRecord {
  return typeof item === "object" && item !== null;
}

const defaultFilter = (itemValue: string, search: string) =>
  itemValue.toLowerCase().includes(search.toLowerCase());

const defaultItemToStringValue = (item: any): string => {
  if (item == null) return "";
  if (typeof item === "string") return item;
  return item.label ?? item.value ?? item.name ?? String(item);
};

export const Combobox = <T = any,>(props: ComboboxProps<T>) => {
  const {
    children,
    items = [],
    itemToStringValue = defaultItemToStringValue,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    autoHighlight = true,
    filter = defaultFilter,
    inputValue: controlledInput,
    defaultInputValue = "",
    onInputValueChange,
    className,
    asChild = false,
  } = props;

  const multiple = props.multiple === true;
  const isValueControlled = "value" in props && props.value !== undefined;
  const controlledValue = props.value;
  const defaultValue = props.defaultValue;
  const onValueChange = props.onValueChange;

  const [internalValue, setInternalValue] = React.useState<any>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return multiple ? [] : null;
  });
  const value = isValueControlled ? controlledValue : internalValue;

  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen);
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const [internalInput, setInternalInput] =
    React.useState<string>(defaultInputValue);
  const [isEditing, setIsEditing] = React.useState<boolean>(
    Boolean(defaultInputValue)
  );
  const isInputControlled = controlledInput !== undefined;

  const [registeredItems, setRegisteredItems] = React.useState<ItemRecord[]>(
    []
  );
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const uniqueId = React.useId();
  const listId = `cfui-combobox-list-${uniqueId}`;
  const inputId = `cfui-combobox-input-${uniqueId}`;

  const toStr = React.useCallback(
    (item: any): string => {
      if (item == null) return "";
      if (typeof item === "string") return item;
      try {
        return itemToStringValue(item as T) ?? "";
      } catch {
        return defaultItemToStringValue(item);
      }
    },
    [itemToStringValue]
  );

  const resolveItem = React.useCallback(
    (val: any) => {
      if (val !== null && typeof val === "object") {
        return val;
      }
      if (items && items.length > 0) {
        const found = items.find((it) => {
          if (toStr(it) === val) return true;
          if (isStructuralRecord(it)) {
            const hasMatchingValue = "value" in it && it.value === val;
            const hasMatchingId = "id" in it && it.id === val;
            return hasMatchingValue || hasMatchingId;
          }
          return false;
        });
        if (found !== undefined) return found;
      }
      const rec = registeredItems.find(
        (it) => it.value === val || toStr(it.value) === val
      );
      if (rec && typeof rec.value === "object" && rec.value !== null) {
        return rec.value;
      }
      return val;
    },
    [items, registeredItems, toStr]
  );

  const getDisplayLabel = React.useCallback(
    (val: any): string => {
      if (val == null || val === "") return "";
      if (typeof val === "string") {
        const rec = registeredItems.find(
          (it) => it.value === val || (it.id && it.id === val)
        );
        if (rec?.label) return rec.label;
        if (items && items.length > 0) {
          const found = items.find((it) => {
            if (toStr(it) === val) return true;
            if (isStructuralRecord(it)) {
              return (
                ("value" in it && it.value === val) ||
                ("id" in it && it.id === val)
              );
            }
            return false;
          });
          if (found !== undefined) return toStr(found);
        }
        return val;
      }
      const rec = registeredItems.find(
        (it) =>
          it.value === val ||
          (isStructuralRecord(val) &&
            isStructuralRecord(it.value) &&
            "id" in val &&
            "id" in it.value &&
            val.id !== undefined &&
            val.id === it.value.id)
      );
      if (rec?.label) return rec.label;
      return toStr(val);
    },
    [items, registeredItems, toStr]
  );

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

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      if (!nextOpen) {
        setIsEditing(false);
        setInternalInput("");
      }
      onOpenChange?.(nextOpen);
    },
    [disabled, isOpenControlled, onOpenChange]
  );

  const setInputValue = React.useCallback(
    (nextInput: string) => {
      setIsEditing(true);
      if (!isInputControlled) {
        setInternalInput(nextInput);
      }
      onInputValueChange?.(nextInput);
    },
    [isInputControlled, onInputValueChange]
  );

  const setValue = React.useCallback(
    (nextVal: any) => {
      if (!isValueControlled) {
        setInternalValue(nextVal);
      }
      if (multiple) {
        (onValueChange as ((val: T[]) => void) | undefined)?.(nextVal as T[]);
      } else {
        (onValueChange as ((val: T | null) => void) | undefined)?.(
          nextVal as T | null
        );
      }
    },
    [isValueControlled, multiple, onValueChange]
  );

  const registerItem = React.useCallback((record: ItemRecord) => {
    setRegisteredItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === record.id);
      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        if (
          existing.value === record.value &&
          existing.label === record.label &&
          existing.disabled === record.disabled &&
          existing.onSelect === record.onSelect
        ) {
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
        if (!prev.some((item) => item.id === record.id)) return prev;
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
    } else if (!open) {
      setHighlightedIndex(-1);
    }
  }, [open, autoHighlight, visibleItems]);

  const isItemSelected = React.useCallback(
    (itemVal: any): boolean => {
      const strTarget = toStr(itemVal);
      if (multiple) {
        if (!Array.isArray(value)) return false;
        return value.some((v: any) => v === itemVal || toStr(v) === strTarget);
      }
      if (value == null || value === "") return false;
      return value === itemVal || toStr(value) === strTarget;
    },
    [multiple, toStr, value]
  );

  const selectItem = React.useCallback(
    (rawVal: any) => {
      if (disabled) return;
      const resolvedVal = resolveItem(rawVal);
      const targetStr = toStr(resolvedVal);

      const itemRecord = registeredItems.find(
        (it) =>
          it.value === rawVal ||
          toStr(it.value) === targetStr ||
          (it.id && it.id === rawVal)
      );

      if (multiple) {
        const currentArr = Array.isArray(value) ? value : [];
        const exists = currentArr.some(
          (v: any) => v === resolvedVal || toStr(v) === targetStr
        );
        const next = exists
          ? currentArr.filter(
              (v: any) => v !== resolvedVal && toStr(v) !== targetStr
            )
          : [...currentArr, resolvedVal];
        setValue(next);
        setIsEditing(false);
        setInternalInput("");
      } else {
        setValue(resolvedVal);
        setIsEditing(false);
        setInternalInput("");
        setOpen(false);
      }

      itemRecord?.onSelect?.(resolvedVal);
    },
    [
      disabled,
      multiple,
      registeredItems,
      resolveItem,
      setOpen,
      setValue,
      toStr,
      value,
    ]
  );

  const removeItem = React.useCallback(
    (rawVal: any) => {
      if (disabled) return;
      const targetStr = toStr(rawVal);
      if (multiple) {
        const currentArr = Array.isArray(value) ? value : [];
        const next = currentArr.filter(
          (v: any) => v !== rawVal && toStr(v) !== targetStr
        );
        setValue(next);
      } else {
        setValue(null);
        setIsEditing(false);
        setInternalInput("");
      }
    },
    [disabled, multiple, setValue, toStr, value]
  );

  const clear = React.useCallback(() => {
    if (disabled) return;
    setValue(multiple ? [] : null);
    setIsEditing(false);
    setInternalInput("");
    if (!isInputControlled) {
      onInputValueChange?.("");
    }
  }, [disabled, isInputControlled, multiple, onInputValueChange, setValue]);

  const navigateHighlight = React.useCallback(
    (direction: 1 | -1) => {
      if (visibleItems.length === 0) return;
      const len = visibleItems.length;
      const hasEnabled = visibleItems.some((it) => !it.disabled);
      if (!hasEnabled) return;

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
    },
    [visibleItems]
  );

  const onInputKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          navigateHighlight(1);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          navigateHighlight(-1);
        }
      } else if (e.key === "Enter") {
        if (open && highlightedIndex >= 0 && visibleItems[highlightedIndex]) {
          const item = visibleItems[highlightedIndex];
          if (!item.disabled) {
            e.preventDefault();
            selectItem(item.value);
          }
        }
      } else if (e.key === "Escape") {
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
      } else if (e.key === "Tab") {
        if (open) {
          setOpen(false);
        }
      }
    },
    [
      disabled,
      highlightedIndex,
      navigateHighlight,
      open,
      selectItem,
      setOpen,
      visibleItems,
    ]
  );

  const activeDescendantId =
    highlightedIndex >= 0 && visibleItems[highlightedIndex]
      ? visibleItems[highlightedIndex].id
      : undefined;

  const contextValue = React.useMemo<ComboboxContextValue>(
    () => ({
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
    }),
    [
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
    ]
  );

  const Comp = asChild ? Slot : "div";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <ComboboxContext.Provider value={contextValue}>
        <Comp
          ref={anchorRef}
          data-cfui-component="Combobox"
          className={cn("cfui-combobox", className)}
        >
          {children}
        </Comp>
      </ComboboxContext.Provider>
    </PopoverPrimitive.Root>
  );
};
Combobox.displayName = "Combobox";

export interface ComboboxTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  ComboboxTriggerProps
>(({ className, children, asChild = false, onClick, onKeyDown, ...props }, ref) => {
  const context = useComboboxContext("ComboboxTrigger");
  const Comp = asChild ? Slot : "button";

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      (context.triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current =
        node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
    },
    [context.triggerRef, ref]
  );

  return (
    <Comp
      ref={mergedRef}
      type="button"
      role="combobox"
      aria-expanded={context.open}
      aria-haspopup="listbox"
      aria-controls={context.listId}
      aria-activedescendant={context.activeDescendantId}
      data-cfui-component="Combobox"
      data-cfui-part="trigger"
      disabled={context.disabled}
      className={cn("cfui-combobox-trigger", className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          context.setOpen(!context.open);
        }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || context.disabled) return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!context.open) {
            context.setOpen(true);
          } else {
            context.navigateHighlight(e.key === "ArrowDown" ? 1 : -1);
          }
        } else if (e.key === "Enter" || e.key === " ") {
          if (!context.open) {
            e.preventDefault();
            context.setOpen(true);
          } else if (context.highlightedIndex >= 0) {
            const item = context.visibleItems[context.highlightedIndex];
            if (item && !item.disabled) {
              e.preventDefault();
              context.selectItem(item.value);
            }
          }
        } else if (e.key === "Escape") {
          if (context.open) {
            e.preventDefault();
            context.setOpen(false);
          }
        }
      }}
      {...props}
    >
      {children}
      {!asChild && (
        <span
          aria-hidden="true"
          className="cfui-combobox-trigger-icon"
        >
          <CaretDownIcon className="cfui-combobox-trigger-svg" />
        </span>
      )}
    </Comp>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

export interface ComboboxInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  showTrigger?: boolean;
  showClear?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  wrapperClassName?: string;
}

export const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  ComboboxInputProps
>(
  (
    {
      className,
      wrapperClassName,
      showTrigger = true,
      showClear = false,
      value: controlledValue,
      onChange,
      onKeyDown,
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    const context = useComboboxContext("ComboboxInput");
    const localInputRef = React.useRef<HTMLInputElement>(null);

    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        localInputRef.current = node;
        (context.inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [context.inputRef, ref]
    );

    const displayValue =
      controlledValue !== undefined ? controlledValue : context.inputValue;
    const hasSelection = context.multiple
      ? Array.isArray(context.value) && context.value.length > 0
      : context.value != null && context.value !== "";
    const canClear = Boolean(displayValue) || hasSelection;

    return (
      <div
        data-cfui-component="Combobox"
        data-cfui-part="input-wrapper"
        className={cn(
          "cfui-combobox-input-wrapper",
          context.disabled && "cfui-combobox-input-wrapper-disabled",
          wrapperClassName
        )}
      >
        <input
          ref={mergedRef}
          id={context.inputId}
          role="combobox"
          type="text"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={context.open}
          aria-controls={context.listId}
          aria-activedescendant={context.activeDescendantId}
          aria-disabled={context.disabled}
          disabled={context.disabled}
          value={displayValue}
          placeholder={placeholder}
          data-cfui-component="Combobox"
          data-cfui-part="input"
          className={cn("cfui-combobox-input", className)}
          onChange={(e) => {
            onChange?.(e);
            if (!e.defaultPrevented) {
              context.setInputValue(e.target.value);
              if (!context.open) {
                context.setOpen(true);
              }
            }
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (!e.defaultPrevented) {
              context.onInputKeyDown(e);
            }
          }}
          {...props}
        />
        <div className="cfui-combobox-input-actions">
          {showClear && canClear && !context.disabled && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear selection"
              data-cfui-component="Combobox"
              data-cfui-part="clear"
              className="cfui-combobox-clear-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                context.clear();
                localInputRef.current?.focus();
              }}
            >
              <XIcon className="cfui-combobox-clear-svg" />
            </button>
          )}
          {showTrigger && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Toggle popup"
              data-cfui-component="Combobox"
              data-cfui-part="input-trigger"
              disabled={context.disabled}
              className="cfui-combobox-toggle-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                context.setOpen(!context.open);
                localInputRef.current?.focus();
              }}
            >
              <CaretUpDownIcon className="cfui-combobox-caret-svg" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
ComboboxInput.displayName = "ComboboxInput";

export interface ComboboxChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  ComboboxChipsProps
>(({ className, children, asChild = false, onClick, ...props }, ref) => {
  const context = useComboboxContext("ComboboxChips");
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-cfui-component="Combobox"
      data-cfui-part="chips"
      className={cn(
        "cfui-combobox-chips",
        context.disabled && "cfui-combobox-chips-disabled",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          context.inputRef.current?.focus();
        }
      }}
      {...props}
    >
      {children}
    </Comp>
  );
});
ComboboxChips.displayName = "ComboboxChips";

export interface ComboboxChipProps extends React.HTMLAttributes<HTMLDivElement> {
  value: any;
  showRemove?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
}

export const ComboboxChip = React.forwardRef<HTMLDivElement, ComboboxChipProps>(
  (
    {
      className,
      children,
      value,
      showRemove = true,
      onRemove,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const context = useComboboxContext("ComboboxChip");
    const isChipDisabled = disabled || context.disabled;
    const label = context.itemToStringValue(value);

    return (
      <div
        ref={ref}
        data-cfui-component="Combobox"
        data-cfui-part="chip"
        className={cn(
          "cfui-combobox-chip",
          isChipDisabled && "cfui-combobox-chip-disabled",
          className
        )}
        {...props}
      >
        <span className="cfui-combobox-chip-label truncate">
          {children ?? label}
        </span>
        {showRemove && !isChipDisabled && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Remove ${label}`}
            className="cfui-combobox-chip-remove"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) {
                onRemove();
              } else {
                context.removeItem(value);
              }
            }}
          >
            <XIcon className="cfui-combobox-chip-remove-svg" />
          </button>
        )}
      </div>
    );
  }
);
ComboboxChip.displayName = "ComboboxChip";

export interface ComboboxChipsInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComboboxChipsInput = React.forwardRef<
  HTMLInputElement,
  ComboboxChipsInputProps
>(({ className, value: controlledValue, onChange, onKeyDown, ...props }, ref) => {
  const context = useComboboxContext("ComboboxChipsInput");

  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      (context.inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [context.inputRef, ref]
  );

  const displayValue =
    controlledValue !== undefined ? controlledValue : context.inputValue;

  return (
    <input
      ref={mergedRef}
      id={context.inputId}
      role="combobox"
      type="text"
      autoComplete="off"
      aria-autocomplete="list"
      aria-expanded={context.open}
      aria-controls={context.listId}
      aria-activedescendant={context.activeDescendantId}
      aria-disabled={context.disabled}
      disabled={context.disabled}
      value={displayValue}
      data-cfui-component="Combobox"
      data-cfui-part="chips-input"
      className={cn("cfui-combobox-chips-input", className)}
      onChange={(e) => {
        onChange?.(e);
        if (!e.defaultPrevented) {
          context.setInputValue(e.target.value);
          if (!context.open) {
            context.setOpen(true);
          }
        }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented) {
          if (
            e.key === "Backspace" &&
            displayValue === "" &&
            context.multiple &&
            Array.isArray(context.value) &&
            context.value.length > 0
          ) {
            const lastVal = context.value[context.value.length - 1];
            context.removeItem(lastVal);
          } else {
            context.onInputKeyDown(e);
          }
        }
      }}
      {...props}
    />
  );
});
ComboboxChipsInput.displayName = "ComboboxChipsInput";

export interface ComboboxValueProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  placeholder?: string;
  children?: ((val: any) => React.ReactNode) | React.ReactNode;
}

export const ComboboxValue = React.forwardRef<
  HTMLSpanElement,
  ComboboxValueProps
>(({ className, placeholder, children, ...props }, ref) => {
  const context = useComboboxContext("ComboboxValue");

  let content: React.ReactNode = null;
  if (typeof children === "function") {
    content = children(context.value);
  } else if (children) {
    content = children;
  } else if (context.multiple && Array.isArray(context.value)) {
    content =
      context.value.length > 0
        ? context.value.map((v) => context.itemToStringValue(v)).join(", ")
        : null;
  } else if (context.value != null && context.value !== "") {
    content = context.itemToStringValue(context.value);
  }

  const isPlaceholder = !content;

  return (
    <span
      ref={ref}
      data-cfui-component="Combobox"
      data-cfui-part="value"
      data-placeholder={isPlaceholder ? "" : undefined}
      className={cn("cfui-combobox-value", className)}
      {...props}
    >
      {content ?? placeholder}
    </span>
  );
});
ComboboxValue.displayName = "ComboboxValue";

export interface ComboboxContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  anchor?: React.RefObject<HTMLElement | null>;
}

export const ComboboxContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  ComboboxContentProps
>(
  (
    {
      className,
      children,
      anchor,
      side = "bottom",
      align = "start",
      sideOffset = 4,
      alignOffset = 0,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const context = useComboboxContext("ComboboxContent");
    const activeAnchor = anchor ?? context.anchorRef;

    return (
      <>
        {activeAnchor && <PopoverPrimitive.Anchor virtualRef={activeAnchor} />}
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            onOpenAutoFocus={(e) => {
              onOpenAutoFocus?.(e);
              if (!e.defaultPrevented) {
                e.preventDefault();
              }
            }}
            onCloseAutoFocus={(e) => {
              onCloseAutoFocus?.(e);
              if (!e.defaultPrevented) {
                e.preventDefault();
              }
            }}
            onKeyDown={(e) => {
              onKeyDown?.(e);
              if (!e.defaultPrevented) {
                context.onInputKeyDown(e);
              }
            }}
            data-cfui-component="Combobox"
            data-cfui-part="content"
            className={cn("cfui-combobox-content", className)}
            {...props}
          >
            {children}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </>
    );
  }
);
ComboboxContent.displayName = "ComboboxContent";

export interface ComboboxListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactNode | ((items: any[]) => React.ReactNode);
}

export const ComboboxList = React.forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ className, children, onKeyDown, ...props }, ref) => {
    const context = useComboboxContext("ComboboxList");

    return (
      <div
        ref={ref}
        id={context.listId}
        role="listbox"
        aria-multiselectable={context.multiple}
        data-cfui-component="Combobox"
        data-cfui-part="list"
        className={cn("cfui-combobox-list", className)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented) {
            context.onInputKeyDown(e);
          }
        }}
        {...props}
      >
        {typeof children === "function" ? children(context.items) : children}
      </div>
    );
  }
);
ComboboxList.displayName = "ComboboxList";

export interface ComboboxCollectionProps<T = any> {
  items?: T[];
  children?: React.ReactNode | ((item: T, index: number) => React.ReactNode);
  className?: string;
}

export const ComboboxCollection = <T = any,>({
  items,
  children,
  className,
}: ComboboxCollectionProps<T>) => {
  const context = useComboboxContext("ComboboxCollection");
  const collectionItems = items ?? context.items;

  return (
    <div
      data-cfui-component="Combobox"
      data-cfui-part="collection"
      className={cn("cfui-combobox-collection", className)}
    >
      {typeof children === "function"
        ? collectionItems.map((item: T, index: number) =>
            (children as (item: T, index: number) => React.ReactNode)(
              item,
              index
            )
          )
        : children}
    </div>
  );
};
ComboboxCollection.displayName = "ComboboxCollection";

export interface ComboboxItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
  value: any;
  disabled?: boolean;
  onSelect?: (value: any) => void;
  children?:
    | React.ReactNode
    | ((state: { selected: boolean; active: boolean }) => React.ReactNode);
  asChild?: boolean;
}

export const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  (
    {
      className,
      children,
      value,
      disabled = false,
      onSelect,
      onClick,
      onMouseEnter,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const context = useComboboxContext("ComboboxItem");
    const itemId = React.useId();

    const textContent =
      typeof children === "string"
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

    const visibleIndex = context.visibleItems.findIndex(
      (item) =>
        item.id === itemId ||
        item.value === value ||
        context.itemToStringValue(item.value) === context.itemToStringValue(value)
    );
    const isVisible = visibleIndex !== -1;
    const isActive = context.highlightedIndex === visibleIndex;

    if (!isVisible) {
      return null;
    }

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      onClick?.(e as React.MouseEvent<HTMLDivElement>);
      if (!e.defaultPrevented && !disabled) {
        context.selectItem(value);
      }
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
      onMouseEnter?.(e as React.MouseEvent<HTMLDivElement>);
      if (!disabled && visibleIndex >= 0) {
        context.setHighlightedIndex(visibleIndex);
      }
    };

    const itemProps = {
      id: itemId,
      role: "option" as const,
      "aria-selected": isSelected,
      "aria-disabled": disabled,
      "data-cfui-component": "Combobox",
      "data-cfui-part": "item",
      "data-selected": isSelected ? "" : undefined,
      "data-highlighted": isActive ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      className: cn(
        "cfui-combobox-item",
        isActive && "cfui-combobox-item-active",
        isSelected && "cfui-combobox-item-selected",
        disabled && "cfui-combobox-item-disabled",
        className
      ),
      onClick: handleClick,
      onMouseEnter: handleMouseEnter,
      ...props,
    };

    if (asChild && React.isValidElement(children)) {
      return (
        <Slot ref={ref} {...itemProps}>
          {children}
        </Slot>
      );
    }

    return (
      <div ref={ref} {...itemProps}>
        {typeof children === "function" ? (
          children({ selected: isSelected, active: isActive })
        ) : (
          <>
            <span
              aria-hidden="true"
              className="cfui-combobox-item-indicator"
            >
              {isSelected && (
                <CheckIcon
                  className="cfui-combobox-item-check-svg"
                  weight="bold"
                />
              )}
            </span>
            <span className="cfui-combobox-item-text">{children}</span>
          </>
        )}
      </div>
    );
  }
);
ComboboxItem.displayName = "ComboboxItem";

export interface ComboboxEmptyProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  ComboboxEmptyProps
>(({ className, children, ...props }, ref) => {
  const context = useComboboxContext("ComboboxEmpty");

  if (context.visibleItems.length > 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="presentation"
      data-cfui-component="Combobox"
      data-cfui-part="empty"
      className={cn("cfui-combobox-empty", className)}
      {...props}
    >
      {children ?? "No results found."}
    </div>
  );
});
ComboboxEmpty.displayName = "ComboboxEmpty";

export interface ComboboxGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ComboboxGroup = React.forwardRef<
  HTMLDivElement,
  ComboboxGroupProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      data-cfui-component="Combobox"
      data-cfui-part="group"
      className={cn("cfui-combobox-group", className)}
      {...props}
    />
  );
});
ComboboxGroup.displayName = "ComboboxGroup";

export interface ComboboxLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ComboboxLabel = React.forwardRef<
  HTMLDivElement,
  ComboboxLabelProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-cfui-component="Combobox"
      data-cfui-part="label"
      className={cn("cfui-combobox-label", className)}
      {...props}
    />
  );
});
ComboboxLabel.displayName = "ComboboxLabel";

export interface ComboboxSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ComboboxSeparator = React.forwardRef<
  HTMLDivElement,
  ComboboxSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
      data-cfui-component="Combobox"
      data-cfui-part="separator"
      className={cn("cfui-combobox-separator", className)}
      {...props}
    />
  );
});
ComboboxSeparator.displayName = "ComboboxSeparator";
