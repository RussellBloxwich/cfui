import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Label } from "./label.js";
import { cn } from "../../utils.js";
                     
const FieldContext = React.createContext(undefined);
export function useFieldContext() {
    const context = React.useContext(FieldContext);
    if (!context) {
        throw new Error("useFieldContext must be used within a <Field>");
    }
    return context;
}
const Field = React.forwardRef(({ id: explicitId, name, required, disabled, error, orientation = "vertical", className, children, ...props }, ref) => {
    const generatedId = React.useId();
    const id = explicitId || generatedId;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const contextValue = React.useMemo(() => ({
        id,
        name,
        required,
        disabled,
        error,
        descriptionId,
        errorId,
    }), [id, name, required, disabled, error, descriptionId, errorId]);
    return (_jsx(FieldContext.Provider, { value: contextValue, children: _jsx("div", { ref: ref, className: cn("cfui-field", orientation === "horizontal" && "cfui-field--horizontal", orientation === "responsive" && "cfui-field--responsive", disabled && "cfui-field--disabled", error && "cfui-field--error", className), ...props, children: children }) }));
});
Field.displayName = "Field";
const FieldLabel = React.forwardRef(({ className, htmlFor, required: explicitRequired, disabled: explicitDisabled, ...props }, ref) => {
    const context = React.useContext(FieldContext);
    const targetId = htmlFor ?? context?.id;
    const isRequired = explicitRequired ?? context?.required;
    const isDisabled = explicitDisabled ?? context?.disabled;
    return (_jsx(Label, { ref: ref, htmlFor: targetId, required: isRequired, disabled: isDisabled, className: cn("cfui-field-label", className), ...props }));
});
FieldLabel.displayName = "FieldLabel";
const FieldDescription = React.forwardRef(({ className, id: explicitId, ...props }, ref) => {
    const context = React.useContext(FieldContext);
    const targetId = explicitId ?? context?.descriptionId;
    return (_jsx("p", { ref: ref, id: targetId, className: cn("cfui-field-description", className), ...props }));
});
FieldDescription.displayName = "FieldDescription";
const FieldError = React.forwardRef(({ className, id: explicitId, children, errors, ...props }, ref) => {
    const context = React.useContext(FieldContext);
    const targetId = explicitId ?? context?.errorId;
    const extractMessage = (error) => {
        if (!error)
            return undefined;
        if (typeof error === "string") {
            return error.trim().length > 0 ? error : undefined;
        }
        if (typeof error === "object" && typeof error.message === "string") {
            return error.message.trim().length > 0 ? error.message : undefined;
        }
        return undefined;
    };
    const uniqueErrors = React.useMemo(() => {
        if (!errors || errors.length === 0)
            return [];
        const seen = new Set();
        const result = [];
        for (const err of errors) {
            const msg = extractMessage(err);
            if (msg && !seen.has(msg)) {
                seen.add(msg);
                result.push(msg);
            }
        }
        return result;
    }, [errors]);
    const hasChildren = children !== undefined &&
        children !== null &&
        children !== false &&
        children !== "";
    if (hasChildren) {
        return (_jsx("p", { ref: ref, id: targetId, role: "alert", className: cn("cfui-field-error", className), ...props, children: children }));
    }
    if (errors !== undefined) {
        if (uniqueErrors.length === 0) {
            return null;
        }
        if (uniqueErrors.length > 1) {
            return (_jsx("div", { ref: ref, id: targetId, role: "alert", className: cn("cfui-field-error", className), ...props, children: _jsx("ul", { className: "cfui-field-error-list", children: uniqueErrors.map((message, index) => (_jsx("li", { className: "cfui-field-error-item", children: message }, index))) }) }));
        }
        return (_jsx("p", { ref: ref, id: targetId, role: "alert", className: cn("cfui-field-error", className), ...props, children: uniqueErrors[0] }));
    }
    const contextErrorMessage = typeof context?.error === "string" && context.error.trim().length > 0
        ? context.error
        : undefined;
    if (!contextErrorMessage) {
        return null;
    }
    return (_jsx("p", { ref: ref, id: targetId, role: "alert", className: cn("cfui-field-error", className), ...props, children: contextErrorMessage }));
});
FieldError.displayName = "FieldError";
const FieldContent = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("cfui-field-content", className), ...props })));
FieldContent.displayName = "FieldContent";
const FieldGroup = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("cfui-field-group", className), ...props })));
FieldGroup.displayName = "FieldGroup";
const FieldSet = React.forwardRef(({ className, disabled, ...props }, ref) => (_jsx("fieldset", { ref: ref, disabled: disabled, className: cn("cfui-fieldset", disabled && "cfui-fieldset--disabled", className), ...props })));
FieldSet.displayName = "FieldSet";
const Fieldset = FieldSet;
const FieldLegend = React.forwardRef(({ className, variant = "legend", ...props }, ref) => (_jsx("legend", { ref: ref, className: cn("cfui-field-legend", variant === "label" && "cfui-field-legend--label", className), ...props })));
FieldLegend.displayName = "FieldLegend";
const FieldTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, role: "heading", "aria-level": 3, className: cn("cfui-field-title", className), ...props })));
FieldTitle.displayName = "FieldTitle";
const FieldSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, role: "separator", "aria-orientation": "horizontal", className: cn("cfui-field-separator", className), ...props })));
FieldSeparator.displayName = "FieldSeparator";
export { Field, FieldLabel, FieldDescription, FieldError, FieldContext, FieldContent, FieldGroup, FieldLegend, FieldSeparator, FieldSet, Fieldset, FieldTitle, };
//# sourceMappingURL=field.js.map