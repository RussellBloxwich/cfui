import * as React from "react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./number-field.css";

export interface NumberFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  label?: React.ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

interface NumberFieldContextValue {
  value: number;
  isControlled: boolean;
  min?: number;
  max?: number;
  step: number;
  disabled?: boolean;
  readOnly?: boolean;
  increment: (factor?: number) => void;
  decrement: (factor?: number) => void;
  setValue: (val: number) => void;
  canIncrement: boolean;
  canDecrement: boolean;
  labelId?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

const NumberFieldContext =
  React.createContext<NumberFieldContextValue | null>(null);

export function useNumberFieldContext() {
  const context = React.useContext(NumberFieldContext);
  if (!context) {
    throw new Error(
      "NumberField compound subcomponents must be used within NumberField"
    );
  }
  return context;
}

function clamp(value: number, min?: number, max?: number): number {
  let res = value;
  if (min !== undefined && res < min) res = min;
  if (max !== undefined && res > max) res = max;
  return res;
}

function roundToStep(value: number, step: number): number {
  const precision = (step.toString().split(".")[1] || "").length;
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min,
      max,
      step = 1,
      disabled = false,
      readOnly = false,
      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const labelId = ariaLabelledBy ?? (label ? `${generatedId}-label` : undefined);

    const [uncontrolledValue, setUncontrolledValue] = React.useState<number>(
      clamp(defaultValue, min, max)
    );

    const value =
      controlledValue !== undefined
        ? clamp(controlledValue, min, max)
        : uncontrolledValue;

    const isControlled = controlledValue !== undefined;

    const updateValue = React.useCallback(
      (newVal: number) => {
        if (disabled || readOnly) return;
        const rounded = roundToStep(clamp(newVal, min, max), step);
        if (controlledValue === undefined) {
          setUncontrolledValue(rounded);
        }
        onChange?.(rounded);
      },
      [disabled, readOnly, controlledValue, min, max, step, onChange]
    );

    const increment = React.useCallback(
      (factor: number = 1) => {
        if (disabled || readOnly) return;
        updateValue(value + step * factor);
      },
      [disabled, readOnly, updateValue, value, step]
    );

    const decrement = React.useCallback(
      (factor: number = 1) => {
        if (disabled || readOnly) return;
        updateValue(value - step * factor);
      },
      [disabled, readOnly, updateValue, value, step]
    );

    const canIncrement = !disabled && !readOnly && (max === undefined || value < max);
    const canDecrement = !disabled && !readOnly && (min === undefined || value > min);

    return (
      <NumberFieldContext.Provider
        value={{
          value,
          isControlled,
          min,
          max,
          step,
          disabled,
          readOnly,
          increment,
          decrement,
          setValue: updateValue,
          canIncrement,
          canDecrement,
          labelId,
          ariaLabel,
          ariaLabelledBy,
        }}
      >
        <div
          ref={ref}
          className={cn("cfui-number-field", className)}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              {label && (
                <NumberFieldLabel id={labelId}>{label}</NumberFieldLabel>
              )}
              <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </>
          )}
        </div>
      </NumberFieldContext.Provider>
    );
  }
);
NumberField.displayName = "NumberField";

export interface NumberFieldLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const NumberFieldLabel = React.forwardRef<
  HTMLLabelElement,
  NumberFieldLabelProps
>(({ className, ...props }, ref) => {
  const { labelId } = useNumberFieldContext();
  return (
    <label
      ref={ref}
      id={labelId}
      className={cn("cfui-number-field-label", className)}
      {...props}
    />
  );
});
NumberFieldLabel.displayName = "NumberFieldLabel";

export interface NumberFieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const NumberFieldGroup = React.forwardRef<
  HTMLDivElement,
  NumberFieldGroupProps
>(({ className, ...props }, ref) => {
  const { disabled } = useNumberFieldContext();
  return (
    <div
      ref={ref}
      className={cn(
        "cfui-number-field-group",
        disabled && "cfui-number-field-group--disabled",
        className
      )}
      {...props}
    />
  );
});
NumberFieldGroup.displayName = "NumberFieldGroup";

export interface NumberFieldInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: number) => void;
  onNativeChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const NumberFieldInput = React.forwardRef<
  HTMLInputElement,
  NumberFieldInputProps
>(
  (
    {
      className,
      onChange: onNumericChange,
      onNativeChange,
      onKeyDown,
      onBlur,
      ...restProps
    },
    ref
  ) => {
    const {
      value,
      isControlled,
      min,
      max,
      step,
      disabled,
      readOnly,
      setValue,
      increment,
      decrement,
      labelId,
      ariaLabel,
      ariaLabelledBy,
    } = useNumberFieldContext();

    const [textValue, setTextValue] = React.useState<string>(String(value));
    const isDraftingRef = React.useRef(false);
    const lastEmittedValueRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      if (
        isDraftingRef.current &&
        lastEmittedValueRef.current !== null &&
        value === lastEmittedValueRef.current
      ) {
        return;
      }
      isDraftingRef.current = false;
      lastEmittedValueRef.current = null;
      setTextValue(String(value));
    }, [value]);

    const commit = () => {
      isDraftingRef.current = false;
      lastEmittedValueRef.current = null;

      if (disabled || readOnly) {
        setTextValue(String(value));
        return;
      }

      const trimmed = textValue.trim();
      if (trimmed === "" || isNaN(Number(trimmed)) || isNaN(parseFloat(trimmed))) {
        setTextValue(String(value));
        return;
      }

      const parsed = parseFloat(trimmed);
      const bounded = roundToStep(clamp(parsed, min, max), step);
      setValue(bounded);
      if (!isControlled) {
        setTextValue(String(bounded));
      } else {
        setTextValue(String(value));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled || readOnly) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        increment(1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        decrement(1);
      } else if (e.key === "PageUp") {
        e.preventDefault();
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        increment(10);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        decrement(10);
      } else if (e.key === "Home" && min !== undefined) {
        e.preventDefault();
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        setValue(min);
      } else if (e.key === "End" && max !== undefined) {
        e.preventDefault();
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        setValue(max);
      } else if (e.key === "Enter") {
        commit();
      } else if (e.key === "Escape") {
        isDraftingRef.current = false;
        lastEmittedValueRef.current = null;
        setTextValue(String(value));
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      if (e.defaultPrevented) return;
      commit();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onNativeChange?.(e);
      if (disabled || readOnly) return;
      const nextText = e.target.value;
      setTextValue(nextText);
      isDraftingRef.current = true;
      const parsed = parseFloat(nextText);
      if (!isNaN(parsed)) {
        const clamped = roundToStep(clamp(parsed, min, max), step);
        lastEmittedValueRef.current = clamped;
        setValue(parsed);
        onNumericChange?.(parsed);
      } else {
        lastEmittedValueRef.current = null;
      }
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? labelId}
        disabled={disabled}
        readOnly={readOnly}
        value={textValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn("cfui-number-field-input", className)}
        {...restProps}
      />
    );
  }
);
NumberFieldInput.displayName = "NumberFieldInput";

export interface NumberFieldButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NumberFieldDecrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldButtonProps
>(({ className, type = "button", onClick, children, ...props }, ref) => {
  const { decrement, canDecrement } = useNumberFieldContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      decrement(1);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      tabIndex={-1}
      disabled={!canDecrement}
      aria-label="Decrease value"
      onClick={handleClick}
      className={cn("cfui-number-field-decrement", className)}
      {...props}
    >
      {children ?? <MinusIcon size={12} weight="bold" />}
    </button>
  );
});
NumberFieldDecrement.displayName = "NumberFieldDecrement";

export const NumberFieldIncrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldButtonProps
>(({ className, type = "button", onClick, children, ...props }, ref) => {
  const { increment, canIncrement } = useNumberFieldContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      increment(1);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      tabIndex={-1}
      disabled={!canIncrement}
      aria-label="Increase value"
      onClick={handleClick}
      className={cn("cfui-number-field-increment", className)}
      {...props}
    >
      {children ?? <PlusIcon size={12} weight="bold" />}
    </button>
  );
});
NumberFieldIncrement.displayName = "NumberFieldIncrement";
