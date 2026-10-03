import * as React from "react";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./tag-input.css";

export interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (index: number) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  delimiters?: string[];
  allowDuplicates?: boolean;
  validateTag?: (tag: string) => boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

interface TagInputContextValue {
  tags: string[];
  removeTag: (index: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const TagInputContext = React.createContext<TagInputContextValue | null>(null);

export function useTagInputContext() {
  const context = React.useContext(TagInputContext);
  if (!context) {
    throw new Error("TagInput compound subcomponents must be used within TagInput");
  }
  return context;
}

export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = [],
      onChange,
      onAddTag,
      onRemoveTag,
      placeholder = "Add tag...",
      disabled = false,
      readOnly = false,
      maxTags,
      delimiters = [",", "Enter"],
      allowDuplicates = false,
      validateTag,
      inputProps,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState<string[]>(defaultValue);
    const tags = controlledValue !== undefined ? controlledValue : uncontrolledValue;

    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const updateTags = React.useCallback(
      (newTags: string[]) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(newTags);
        }
        onChange?.(newTags);
      },
      [controlledValue, onChange]
    );

    const addTag = React.useCallback(
      (rawTag: string) => {
        const trimmed = rawTag.trim();
        if (!trimmed) return;
        if (maxTags !== undefined && tags.length >= maxTags) return;
        if (!allowDuplicates && tags.includes(trimmed)) return;
        if (validateTag && !validateTag(trimmed)) return;

        const next = [...tags, trimmed];
        updateTags(next);
        onAddTag?.(trimmed);
        setInputValue("");
      },
      [tags, maxTags, allowDuplicates, validateTag, updateTags, onAddTag]
    );

    const removeTag = React.useCallback(
      (indexToRemove: number) => {
        if (disabled || readOnly) return;
        const next = tags.filter((_, i) => i !== indexToRemove);
        updateTags(next);
        onRemoveTag?.(indexToRemove);
      },
      [tags, disabled, readOnly, updateTags, onRemoveTag]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      inputProps?.onKeyDown?.(e);
      if (e.defaultPrevented || disabled || readOnly) return;

      if (delimiters.includes(e.key)) {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
        e.preventDefault();
        removeTag(tags.length - 1);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const delimiterHit = delimiters.find(
        (d) => d !== "Enter" && val.includes(d)
      );

      if (delimiterHit) {
        const parts = val.split(delimiterHit);
        const toAdd = parts[0];
        const remainder = parts.slice(1).join(delimiterHit);
        addTag(toAdd);
        setInputValue(remainder);
      } else {
        setInputValue(val);
        inputProps?.onChange?.(e);
      }
    };

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        inputRef.current?.focus();
      }
    };

    return (
      <TagInputContext.Provider
        value={{ tags, removeTag, disabled, readOnly }}
      >
        <div
          ref={ref}
          onClick={handleContainerClick}
          className={cn(
            "cfui-tag-input",
            disabled && "cfui-tag-input--disabled",
            className
          )}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              <TagInputList>
                {tags.map((tag, idx) => (
                  <TagInputItem key={`${tag}-${idx}`} index={idx}>
                    <span>{tag}</span>
                    {!disabled && !readOnly && (
                      <TagInputRemove
                        index={idx}
                        aria-label={`Remove tag ${tag}`}
                      />
                    )}
                  </TagInputItem>
                ))}
              </TagInputList>
              {(!maxTags || tags.length < maxTags) && !readOnly && (
                <TagInputField
                  ref={inputRef}
                  value={inputValue}
                  disabled={disabled}
                  placeholder={tags.length === 0 ? placeholder : ""}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  {...inputProps}
                />
              )}
            </>
          )}
        </div>
      </TagInputContext.Provider>
    );
  }
);
TagInput.displayName = "TagInput";

export interface TagInputListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TagInputList = React.forwardRef<HTMLDivElement, TagInputListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("cfui-tag-input-list", className)}
      {...props}
    />
  )
);
TagInputList.displayName = "TagInputList";

export interface TagInputItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  index: number;
}

export const TagInputItem = React.forwardRef<HTMLSpanElement, TagInputItemProps>(
  ({ className, index, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("cfui-tag-input-item", className)}
      {...props}
    >
      {children}
    </span>
  )
);
TagInputItem.displayName = "TagInputItem";

export const Tag = TagInputItem;

export interface TagInputRemoveProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
}

export const TagInputRemove = React.forwardRef<
  HTMLButtonElement,
  TagInputRemoveProps
>(({ className, index, type = "button", onClick, children, ...props }, ref) => {
  const { removeTag, disabled, readOnly } = useTagInputContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(e);
    if (!e.defaultPrevented) {
      removeTag(index);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      tabIndex={-1}
      disabled={disabled || readOnly}
      onClick={handleClick}
      className={cn("cfui-tag-input-remove", className)}
      {...props}
    >
      {children ?? <XIcon size={10} weight="bold" />}
    </button>
  );
});
TagInputRemove.displayName = "TagInputRemove";

export interface TagInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const TagInputField = React.forwardRef<
  HTMLInputElement,
  TagInputFieldProps
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="text"
    className={cn("cfui-tag-input-field", className)}
    {...props}
  />
));
TagInputField.displayName = "TagInputField";

export const TagInputInput = TagInputField;
