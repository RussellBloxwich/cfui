import * as React from "react";
import { Label, type LabelProps } from "./label.js";
import { cn } from "../../utils.js";
import "./field.css";

export interface FieldContextValue {
  id: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  descriptionId: string;
  errorId: string;
}

const FieldContext = React.createContext<FieldContextValue | undefined>(undefined);

export function useFieldContext(): FieldContextValue {
  const context = React.useContext(FieldContext);
  if (!context) {
    throw new Error("useFieldContext must be used within a <Field>");
  }
  return context;
}

export type FieldOrientation = "vertical" | "horizontal" | "responsive";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  orientation?: FieldOrientation;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      id: explicitId,
      name,
      required,
      disabled,
      error,
      orientation = "vertical",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const id = explicitId || generatedId;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    const contextValue = React.useMemo<FieldContextValue>(
      () => ({
        id,
        name,
        required,
        disabled,
        error,
        descriptionId,
        errorId,
      }),
      [id, name, required, disabled, error, descriptionId, errorId]
    );

    return (
      <FieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "cfui-field",
            orientation === "horizontal" && "cfui-field--horizontal",
            orientation === "responsive" && "cfui-field--responsive",
            disabled && "cfui-field--disabled",
            error && "cfui-field--error",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    );
  }
);
Field.displayName = "Field";

export interface FieldLabelProps extends Omit<LabelProps, "htmlFor"> {
  htmlFor?: string;
}

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FieldLabelProps
>(
  (
    {
      className,
      htmlFor,
      required: explicitRequired,
      disabled: explicitDisabled,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(FieldContext);
    const targetId = htmlFor ?? context?.id;
    const isRequired = explicitRequired ?? context?.required;
    const isDisabled = explicitDisabled ?? context?.disabled;

    return (
      <Label
        ref={ref}
        htmlFor={targetId}
        required={isRequired}
        disabled={isDisabled}
        className={cn("cfui-field-label", className)}
        {...props}
      />
    );
  }
);
FieldLabel.displayName = "FieldLabel";

export interface FieldDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(({ className, id: explicitId, ...props }, ref) => {
  const context = React.useContext(FieldContext);
  const targetId = explicitId ?? context?.descriptionId;

  return (
    <p
      ref={ref}
      id={targetId}
      className={cn("cfui-field-description", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

export interface FieldErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: Array<{ message?: string } | undefined>;
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, id: explicitId, children, errors, ...props }, ref) => {
    const context = React.useContext(FieldContext);
    const targetId = explicitId ?? context?.errorId;

    const extractMessage = (
      error: { message?: string } | string | undefined
    ): string | undefined => {
      if (!error) return undefined;
      if (typeof error === "string") {
        return error.trim().length > 0 ? error : undefined;
      }
      if (typeof error === "object" && typeof error.message === "string") {
        return error.message.trim().length > 0 ? error.message : undefined;
      }
      return undefined;
    };

    const uniqueErrors = React.useMemo(() => {
      if (!errors || errors.length === 0) return [];
      const seen = new Set<string>();
      const result: string[] = [];
      for (const err of errors) {
        const msg = extractMessage(err);
        if (msg && !seen.has(msg)) {
          seen.add(msg);
          result.push(msg);
        }
      }
      return result;
    }, [errors]);

    const hasChildren =
      children !== undefined &&
      children !== null &&
      children !== false &&
      children !== "";

    if (hasChildren) {
      return (
        <p
          ref={ref}
          id={targetId}
          role="alert"
          className={cn("cfui-field-error", className)}
          {...props}
        >
          {children}
        </p>
      );
    }

    if (errors !== undefined) {
      if (uniqueErrors.length === 0) {
        return null;
      }

      if (uniqueErrors.length > 1) {
        return (
          <div
            ref={ref as unknown as React.Ref<HTMLDivElement>}
            id={targetId}
            role="alert"
            className={cn("cfui-field-error", className)}
            {...(props as React.HTMLAttributes<HTMLDivElement>)}
          >
            <ul className="cfui-field-error-list">
              {uniqueErrors.map((message, index) => (
                <li key={index} className="cfui-field-error-item">
                  {message}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      return (
        <p
          ref={ref}
          id={targetId}
          role="alert"
          className={cn("cfui-field-error", className)}
          {...props}
        >
          {uniqueErrors[0]}
        </p>
      );
    }

    const contextErrorMessage =
      typeof context?.error === "string" && context.error.trim().length > 0
        ? context.error
        : undefined;

    if (!contextErrorMessage) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={targetId}
        role="alert"
        className={cn("cfui-field-error", className)}
        {...props}
      >
        {contextErrorMessage}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";

export interface FieldContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const FieldContent = React.forwardRef<HTMLDivElement, FieldContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("cfui-field-content", className)}
      {...props}
    />
  )
);
FieldContent.displayName = "FieldContent";

export interface FieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("cfui-field-group", className)}
      {...props}
    />
  )
);
FieldGroup.displayName = "FieldGroup";

export interface FieldSetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {}

const FieldSet = React.forwardRef<HTMLFieldSetElement, FieldSetProps>(
  ({ className, disabled, ...props }, ref) => (
    <fieldset
      ref={ref}
      disabled={disabled}
      className={cn(
        "cfui-fieldset",
        disabled && "cfui-fieldset--disabled",
        className
      )}
      {...props}
    />
  )
);
FieldSet.displayName = "FieldSet";

const Fieldset = FieldSet;

export interface FieldLegendProps
  extends React.HTMLAttributes<HTMLLegendElement> {
  variant?: "legend" | "label";
}

const FieldLegend = React.forwardRef<HTMLLegendElement, FieldLegendProps>(
  ({ className, variant = "legend", ...props }, ref) => (
    <legend
      ref={ref}
      className={cn(
        "cfui-field-legend",
        variant === "label" && "cfui-field-legend--label",
        className
      )}
      {...props}
    />
  )
);
FieldLegend.displayName = "FieldLegend";

export interface FieldTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const FieldTitle = React.forwardRef<HTMLDivElement, FieldTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="heading"
      aria-level={3}
      className={cn("cfui-field-title", className)}
      {...props}
    />
  )
);
FieldTitle.displayName = "FieldTitle";

export interface FieldSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const FieldSeparator = React.forwardRef<HTMLDivElement, FieldSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn("cfui-field-separator", className)}
      {...props}
    />
  )
);
FieldSeparator.displayName = "FieldSeparator";

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContext,
  FieldContent,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  Fieldset,
  FieldTitle,
};
