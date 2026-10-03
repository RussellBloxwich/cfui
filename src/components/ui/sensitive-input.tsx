import * as React from "react";
import { EyeIcon, EyeSlashIcon, CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { copyToClipboard } from "./clipboard-text.js";
import "./sensitive-input.css";

export interface SensitiveInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
  showCopy?: boolean;
  containerClassName?: string;
}

interface SensitiveInputContextValue {
  revealed: boolean;
  toggleRevealed: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string | number | readonly string[];
}

const SensitiveInputContext =
  React.createContext<SensitiveInputContextValue | null>(null);

export function useSensitiveInputContext() {
  const context = React.useContext(SensitiveInputContext);
  if (!context) {
    throw new Error(
      "SensitiveInput compound subcomponents must be used within SensitiveInputContainer"
    );
  }
  return context;
}

export const SensitiveInputContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    revealed?: boolean;
    defaultRevealed?: boolean;
    onRevealedChange?: (revealed: boolean) => void;
    disabled?: boolean;
    readOnly?: boolean;
    value?: string | number | readonly string[];
  }
>(
  (
    {
      className,
      revealed: controlledRevealed,
      defaultRevealed = false,
      onRevealedChange,
      disabled,
      readOnly,
      value,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledRevealed, setUncontrolledRevealed] =
      React.useState(defaultRevealed);
    const isRevealed =
      controlledRevealed !== undefined ? controlledRevealed : uncontrolledRevealed;

    const toggleRevealed = React.useCallback(() => {
      const next = !isRevealed;
      if (controlledRevealed === undefined) {
        setUncontrolledRevealed(next);
      }
      onRevealedChange?.(next);
    }, [isRevealed, controlledRevealed, onRevealedChange]);

    return (
      <SensitiveInputContext.Provider
        value={{
          revealed: isRevealed,
          toggleRevealed,
          disabled,
          readOnly,
          value,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "cfui-sensitive-input-container",
            disabled && "cfui-sensitive-input-container--disabled",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SensitiveInputContext.Provider>
    );
  }
);
SensitiveInputContainer.displayName = "SensitiveInputContainer";

export const SensitiveInputRoot = SensitiveInputContainer;

export interface SensitiveInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SensitiveInputField = React.forwardRef<
  HTMLInputElement,
  SensitiveInputFieldProps
>(({ className, ...props }, ref) => {
  const context = React.useContext(SensitiveInputContext);
  const isRevealed = context ? context.revealed : false;

  return (
    <input
      ref={ref}
      type={isRevealed ? "text" : "password"}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      className={cn(
        "cfui-sensitive-input-field",
        !isRevealed && "cfui-sensitive-input-field--masked",
        className
      )}
      {...props}
    />
  );
});
SensitiveInputField.displayName = "SensitiveInputField";

export interface SensitiveInputRevealProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SensitiveInputReveal = React.forwardRef<
  HTMLButtonElement,
  SensitiveInputRevealProps
>(({ className, type = "button", onClick, children, ...props }, ref) => {
  const { revealed, toggleRevealed, disabled } = useSensitiveInputContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      toggleRevealed();
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      tabIndex={-1}
      disabled={disabled}
      aria-label={revealed ? "Hide sensitive value" : "Reveal sensitive value"}
      aria-pressed={revealed}
      onClick={handleClick}
      className={cn("cfui-sensitive-input-reveal", className)}
      {...props}
    >
      {children ??
        (revealed ? (
          <EyeSlashIcon size={16} weight="regular" />
        ) : (
          <EyeIcon size={16} weight="regular" />
        ))}
    </button>
  );
});
SensitiveInputReveal.displayName = "SensitiveInputReveal";

export const SensitiveInputToggle = SensitiveInputReveal;

export interface SensitiveInputCopyProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy?: string;
  copyTimeout?: number;
}

export const SensitiveInputCopy = React.forwardRef<
  HTMLButtonElement,
  SensitiveInputCopyProps
>(
  (
    { className, type = "button", textToCopy, copyTimeout = 2000, onClick, children, ...props },
    ref
  ) => {
    const { value, disabled } = useSensitiveInputContext();
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;

      const targetText = textToCopy ?? (typeof value === "string" ? value : "");
      if (!targetText) return;

      const success = await copyToClipboard(targetText);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), copyTimeout);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        tabIndex={-1}
        disabled={disabled}
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        onClick={handleCopy}
        className={cn(
          "cfui-sensitive-input-copy",
          copied && "cfui-sensitive-input-copy--copied",
          className
        )}
        {...props}
      >
        {children ??
          (copied ? (
            <CheckIcon size={16} weight="bold" />
          ) : (
            <CopyIcon size={16} weight="regular" />
          ))}
      </button>
    );
  }
);
SensitiveInputCopy.displayName = "SensitiveInputCopy";

/* Convenience component forwarding ref to the input element */
export const SensitiveInput = React.forwardRef<
  HTMLInputElement,
  SensitiveInputProps
>(
  (
    {
      className,
      containerClassName,
      revealed,
      defaultRevealed = false,
      onRevealedChange,
      showCopy = false,
      disabled,
      readOnly,
      value,
      ...props
    },
    ref
  ) => {
    return (
      <SensitiveInputContainer
        className={containerClassName}
        revealed={revealed}
        defaultRevealed={defaultRevealed}
        onRevealedChange={onRevealedChange}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
      >
        <SensitiveInputField
          ref={ref}
          className={className}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          {...props}
        />
        <SensitiveInputReveal />
        {showCopy && (
          <SensitiveInputCopy
            textToCopy={typeof value === "string" ? value : undefined}
          />
        )}
      </SensitiveInputContainer>
    );
  }
);
SensitiveInput.displayName = "SensitiveInput";
