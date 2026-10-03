import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { EyeIcon, EyeSlashIcon, CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { copyToClipboard } from "./clipboard-text.js";
                               
const SensitiveInputContext = React.createContext(null);
export function useSensitiveInputContext() {
    const context = React.useContext(SensitiveInputContext);
    if (!context) {
        throw new Error("SensitiveInput compound subcomponents must be used within SensitiveInputContainer");
    }
    return context;
}
export const SensitiveInputContainer = React.forwardRef(({ className, revealed: controlledRevealed, defaultRevealed = false, onRevealedChange, disabled, readOnly, value, children, ...props }, ref) => {
    const [uncontrolledRevealed, setUncontrolledRevealed] = React.useState(defaultRevealed);
    const isRevealed = controlledRevealed !== undefined ? controlledRevealed : uncontrolledRevealed;
    const toggleRevealed = React.useCallback(() => {
        const next = !isRevealed;
        if (controlledRevealed === undefined) {
            setUncontrolledRevealed(next);
        }
        onRevealedChange?.(next);
    }, [isRevealed, controlledRevealed, onRevealedChange]);
    return (_jsx(SensitiveInputContext.Provider, { value: {
            revealed: isRevealed,
            toggleRevealed,
            disabled,
            readOnly,
            value,
        }, children: _jsx("div", { ref: ref, className: cn("cfui-sensitive-input-container", disabled && "cfui-sensitive-input-container--disabled", className), ...props, children: children }) }));
});
SensitiveInputContainer.displayName = "SensitiveInputContainer";
export const SensitiveInputRoot = SensitiveInputContainer;
export const SensitiveInputField = React.forwardRef(({ className, ...props }, ref) => {
    const context = React.useContext(SensitiveInputContext);
    const isRevealed = context ? context.revealed : false;
    return (_jsx("input", { ref: ref, type: isRevealed ? "text" : "password", autoComplete: "off", autoCorrect: "off", autoCapitalize: "off", spellCheck: "false", className: cn("cfui-sensitive-input-field", !isRevealed && "cfui-sensitive-input-field--masked", className), ...props }));
});
SensitiveInputField.displayName = "SensitiveInputField";
export const SensitiveInputReveal = React.forwardRef(({ className, type = "button", onClick, children, ...props }, ref) => {
    const { revealed, toggleRevealed, disabled } = useSensitiveInputContext();
    const handleClick = (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
            toggleRevealed();
        }
    };
    return (_jsx("button", { ref: ref, type: type, tabIndex: -1, disabled: disabled, "aria-label": revealed ? "Hide sensitive value" : "Reveal sensitive value", "aria-pressed": revealed, onClick: handleClick, className: cn("cfui-sensitive-input-reveal", className), ...props, children: children ??
            (revealed ? (_jsx(EyeSlashIcon, { size: 16, weight: "regular" })) : (_jsx(EyeIcon, { size: 16, weight: "regular" }))) }));
});
SensitiveInputReveal.displayName = "SensitiveInputReveal";
export const SensitiveInputToggle = SensitiveInputReveal;
export const SensitiveInputCopy = React.forwardRef(({ className, type = "button", textToCopy, copyTimeout = 2000, onClick, children, ...props }, ref) => {
    const { value, disabled } = useSensitiveInputContext();
    const [copied, setCopied] = React.useState(false);
    const handleCopy = async (e) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled)
            return;
        const targetText = textToCopy ?? (typeof value === "string" ? value : "");
        if (!targetText)
            return;
        const success = await copyToClipboard(targetText);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), copyTimeout);
        }
    };
    return (_jsx("button", { ref: ref, type: type, tabIndex: -1, disabled: disabled, "aria-label": copied ? "Copied to clipboard" : "Copy to clipboard", onClick: handleCopy, className: cn("cfui-sensitive-input-copy", copied && "cfui-sensitive-input-copy--copied", className), ...props, children: children ??
            (copied ? (_jsx(CheckIcon, { size: 16, weight: "bold" })) : (_jsx(CopyIcon, { size: 16, weight: "regular" }))) }));
});
SensitiveInputCopy.displayName = "SensitiveInputCopy";
/* Convenience component forwarding ref to the input element */
export const SensitiveInput = React.forwardRef(({ className, containerClassName, revealed, defaultRevealed = false, onRevealedChange, showCopy = false, disabled, readOnly, value, ...props }, ref) => {
    return (_jsxs(SensitiveInputContainer, { className: containerClassName, revealed: revealed, defaultRevealed: defaultRevealed, onRevealedChange: onRevealedChange, disabled: disabled, readOnly: readOnly, value: value, children: [_jsx(SensitiveInputField, { ref: ref, className: className, disabled: disabled, readOnly: readOnly, value: value, ...props }), _jsx(SensitiveInputReveal, {}), showCopy && (_jsx(SensitiveInputCopy, { textToCopy: typeof value === "string" ? value : undefined }))] }));
});
SensitiveInput.displayName = "SensitiveInput";
//# sourceMappingURL=sensitive-input.js.map