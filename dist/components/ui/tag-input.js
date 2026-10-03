import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                         
const TagInputContext = React.createContext(null);
export function useTagInputContext() {
    const context = React.useContext(TagInputContext);
    if (!context) {
        throw new Error("TagInput compound subcomponents must be used within TagInput");
    }
    return context;
}
export const TagInput = React.forwardRef(({ className, value: controlledValue, defaultValue = [], onChange, onAddTag, onRemoveTag, placeholder = "Add tag...", disabled = false, readOnly = false, maxTags, delimiters = [",", "Enter"], allowDuplicates = false, validateTag, inputProps, children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const tags = controlledValue !== undefined ? controlledValue : uncontrolledValue;
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef(null);
    const updateTags = React.useCallback((newTags) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(newTags);
        }
        onChange?.(newTags);
    }, [controlledValue, onChange]);
    const addTag = React.useCallback((rawTag) => {
        const trimmed = rawTag.trim();
        if (!trimmed)
            return;
        if (maxTags !== undefined && tags.length >= maxTags)
            return;
        if (!allowDuplicates && tags.includes(trimmed))
            return;
        if (validateTag && !validateTag(trimmed))
            return;
        const next = [...tags, trimmed];
        updateTags(next);
        onAddTag?.(trimmed);
        setInputValue("");
    }, [tags, maxTags, allowDuplicates, validateTag, updateTags, onAddTag]);
    const removeTag = React.useCallback((indexToRemove) => {
        if (disabled || readOnly)
            return;
        const next = tags.filter((_, i) => i !== indexToRemove);
        updateTags(next);
        onRemoveTag?.(indexToRemove);
    }, [tags, disabled, readOnly, updateTags, onRemoveTag]);
    const handleKeyDown = (e) => {
        inputProps?.onKeyDown?.(e);
        if (e.defaultPrevented || disabled || readOnly)
            return;
        if (delimiters.includes(e.key)) {
            e.preventDefault();
            addTag(inputValue);
        }
        else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            e.preventDefault();
            removeTag(tags.length - 1);
        }
    };
    const handleInputChange = (e) => {
        const val = e.target.value;
        const delimiterHit = delimiters.find((d) => d !== "Enter" && val.includes(d));
        if (delimiterHit) {
            const parts = val.split(delimiterHit);
            const toAdd = parts[0];
            const remainder = parts.slice(1).join(delimiterHit);
            addTag(toAdd);
            setInputValue(remainder);
        }
        else {
            setInputValue(val);
            inputProps?.onChange?.(e);
        }
    };
    const handleContainerClick = (e) => {
        if (e.target === e.currentTarget) {
            inputRef.current?.focus();
        }
    };
    return (_jsx(TagInputContext.Provider, { value: { tags, removeTag, disabled, readOnly }, children: _jsx("div", { ref: ref, onClick: handleContainerClick, className: cn("cfui-tag-input", disabled && "cfui-tag-input--disabled", className), ...props, children: children ? (children) : (_jsxs(_Fragment, { children: [_jsx(TagInputList, { children: tags.map((tag, idx) => (_jsxs(TagInputItem, { index: idx, children: [_jsx("span", { children: tag }), !disabled && !readOnly && (_jsx(TagInputRemove, { index: idx, "aria-label": `Remove tag ${tag}` }))] }, `${tag}-${idx}`))) }), (!maxTags || tags.length < maxTags) && !readOnly && (_jsx(TagInputField, { ref: inputRef, value: inputValue, disabled: disabled, placeholder: tags.length === 0 ? placeholder : "", onChange: handleInputChange, onKeyDown: handleKeyDown, ...inputProps }))] })) }) }));
});
TagInput.displayName = "TagInput";
export const TagInputList = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("cfui-tag-input-list", className), ...props })));
TagInputList.displayName = "TagInputList";
export const TagInputItem = React.forwardRef(({ className, index, children, ...props }, ref) => (_jsx("span", { ref: ref, className: cn("cfui-tag-input-item", className), ...props, children: children })));
TagInputItem.displayName = "TagInputItem";
export const Tag = TagInputItem;
export const TagInputRemove = React.forwardRef(({ className, index, type = "button", onClick, children, ...props }, ref) => {
    const { removeTag, disabled, readOnly } = useTagInputContext();
    const handleClick = (e) => {
        e.stopPropagation();
        onClick?.(e);
        if (!e.defaultPrevented) {
            removeTag(index);
        }
    };
    return (_jsx("button", { ref: ref, type: type, tabIndex: -1, disabled: disabled || readOnly, onClick: handleClick, className: cn("cfui-tag-input-remove", className), ...props, children: children ?? _jsx(XIcon, { size: 10, weight: "bold" }) }));
});
TagInputRemove.displayName = "TagInputRemove";
export const TagInputField = React.forwardRef(({ className, ...props }, ref) => (_jsx("input", { ref: ref, type: "text", className: cn("cfui-tag-input-field", className), ...props })));
TagInputField.displayName = "TagInputField";
export const TagInputInput = TagInputField;
//# sourceMappingURL=tag-input.js.map