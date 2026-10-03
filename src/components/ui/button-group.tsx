import * as React from "react";
import { cn } from "../../utils.js";
import type { ButtonProps } from "./button.js";
import "./button-group.css";

export interface ButtonGroupContextValue {
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
}

export const ButtonGroupContext = React.createContext<ButtonGroupContextValue>({});

export const useButtonGroup = () => React.useContext(ButtonGroupContext);

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      orientation = "horizontal",
      attached = true,
      size,
      variant,
      children,
      role = "group",
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({ size, variant, orientation, attached }),
      [size, variant, orientation, attached]
    );

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role={role}
          data-orientation={orientation}
          data-attached={attached ? "true" : "false"}
          className={cn(
            "cfui-button-group",
            orientation === "vertical"
              ? "cfui-button-group--vertical"
              : "cfui-button-group--horizontal",
            attached && "cfui-button-group--attached",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

export interface ButtonGroupSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const ButtonGroupSeparator = React.forwardRef<
  HTMLDivElement,
  ButtonGroupSeparatorProps
>(({ className, orientation, ...props }, ref) => {
  const context = useButtonGroup();
  const resolvedOrientation = orientation ?? context.orientation ?? "horizontal";

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={resolvedOrientation}
      className={cn(
        "cfui-button-group__separator",
        resolvedOrientation === "vertical"
          ? "cfui-button-group__separator--vertical"
          : "cfui-button-group__separator--horizontal",
        className
      )}
      {...props}
    />
  );
});
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export interface ButtonGroupTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const ButtonGroupText = React.forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("cfui-button-group__text", className)}
        {...props}
      />
    );
  }
);
ButtonGroupText.displayName = "ButtonGroupText";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
