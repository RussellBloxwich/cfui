import * as React from "react";
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./search-field.css";

export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void;
  loading?: boolean;
  shortcut?: string;
  sizeVariant?: "default" | "sm" | "lg";
  error?: boolean;
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onChange,
      onClear,
      loading = false,
      shortcut,
      sizeVariant = "default",
      disabled = false,
      error = false,
      placeholder = "Search...",
      id,
      name,
      required,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? ""
    );
    const currentValue = isControlled ? controlledValue : uncontrolledValue;
    const hasValue = String(currentValue ?? "").length > 0;

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      // 1. Update internal value only when uncontrolled
      if (!isControlled) {
        setUncontrolledValue("");
      }

      // 2. Request clear through caller callbacks
      onClear?.();

      if (onChange) {
        let target: HTMLInputElement;
        if (inputRef.current) {
          target = Object.create(inputRef.current, {
            value: {
              value: "",
              writable: true,
              configurable: true,
              enumerable: true,
            },
          });
        } else {
          target = { value: "", name, id } as unknown as HTMLInputElement;
        }

        const syntheticEvent = {
          target,
          currentTarget: target,
          type: "change",
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          isTrusted: false,
          persist: () => {},
          preventDefault: () => {},
          stopPropagation: () => {},
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          nativeEvent: new Event("change"),
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }

      // 3. Retain focus and native name/ref semantics
      inputRef.current?.focus();
    };

    const isInvalid = error || !!ariaInvalid;

    return (
      <div
        data-disabled={disabled ? "true" : undefined}
        data-invalid={isInvalid ? "true" : undefined}
        className={cn(
          "cfui-search-field",
          sizeVariant !== "default" && `cfui-search-field--${sizeVariant}`,
          disabled && "cfui-search-field--disabled",
          isInvalid && "cfui-search-field--error",
          className
        )}
      >
        <span className="cfui-search-field-icon" aria-hidden="true">
          <MagnifyingGlassIcon weight="bold" />
        </span>
        <input
          ref={handleRef}
          type="search"
          id={id}
          name={name}
          value={currentValue}
          disabled={disabled}
          required={required}
          aria-invalid={isInvalid ? true : undefined}
          aria-describedby={ariaDescribedby}
          placeholder={placeholder}
          onChange={handleChange}
          className="cfui-search-field-input"
          {...props}
        />
        {loading && (
          <span className="cfui-search-field-spinner" aria-label="Loading">
            <CircleNotchIcon weight="bold" className="cfui-search-field-spin" />
          </span>
        )}
        {!loading && hasValue && (
          <button
            type="button"
            aria-label="Clear search"
            disabled={disabled}
            onClick={handleClear}
            className="cfui-search-field-clear"
          >
            <XCircleIcon weight="fill" />
          </button>
        )}
        {!loading && !hasValue && shortcut && (
          <kbd className="cfui-search-field-shortcut" aria-hidden="true">
            {shortcut}
          </kbd>
        )}
      </div>
    );
  }
);
SearchField.displayName = "SearchField";

export interface SearchFieldRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sizeVariant?: "default" | "sm" | "lg";
  disabled?: boolean;
  error?: boolean;
}

const SearchFieldRoot = React.forwardRef<HTMLDivElement, SearchFieldRootProps>(
  ({ className, sizeVariant = "default", disabled, error, ...props }, ref) => (
    <div
      ref={ref}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={error ? "true" : undefined}
      className={cn(
        "cfui-search-field",
        sizeVariant !== "default" && `cfui-search-field--${sizeVariant}`,
        disabled && "cfui-search-field--disabled",
        error && "cfui-search-field--error",
        className
      )}
      {...props}
    />
  )
);
SearchFieldRoot.displayName = "SearchFieldRoot";

export interface SearchFieldInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchFieldInput = React.forwardRef<
  HTMLInputElement,
  SearchFieldInputProps
>(({ className, type = "search", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn("cfui-search-field-input", className)}
    {...props}
  />
));
SearchFieldInput.displayName = "SearchFieldInput";

export interface SearchFieldClearProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SearchFieldClear = React.forwardRef<
  HTMLButtonElement,
  SearchFieldClearProps
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn("cfui-search-field-clear", className)}
    {...props}
  >
    {children ?? <XCircleIcon weight="fill" />}
  </button>
));
SearchFieldClear.displayName = "SearchFieldClear";

export interface SearchFieldIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const SearchFieldIcon = React.forwardRef<
  HTMLSpanElement,
  SearchFieldIconProps
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("cfui-search-field-icon", className)}
    {...props}
  >
    {children ?? <MagnifyingGlassIcon weight="bold" />}
  </span>
));
SearchFieldIcon.displayName = "SearchFieldIcon";

export {
  SearchField,
  SearchFieldRoot,
  SearchFieldInput,
  SearchFieldClear,
  SearchFieldIcon,
};
