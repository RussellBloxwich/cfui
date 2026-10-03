import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./questionnaire.css";

export type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped";

export interface QuestionnaireChoiceDefinition {
  value: string;
  disabled?: boolean;
  label?: React.ReactNode;
}

export interface QuestionnaireItemDefinition {
  name: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  choices?: readonly QuestionnaireChoiceDefinition[];
}

interface ItemRegistration {
  name: string;
  required: boolean;
  disabled: boolean;
  multiple: boolean;
  invalid?: boolean;
  explicitRequired?: boolean;
  onStatusChange?: (status: QuestionnaireItemStatus) => void;
  fieldsetRef: React.RefObject<HTMLFieldSetElement | null>;
}

interface QuestionnaireContextValue {
  activeItem: string;
  items: readonly QuestionnaireItemDefinition[];
  registeredItems: Map<string, ItemRegistration>;
  registerItem: (meta: ItemRegistration) => void;
  unregisterItem: (name: string) => void;
  itemStatuses: Record<string, QuestionnaireItemStatus>;
  setItemStatus: (name: string, status: QuestionnaireItemStatus) => void;
  skippedItems: Set<string>;
  errors: Record<string, string | undefined>;
  setError: (name: string, error: string | undefined) => void;
  goToItem: (name: string) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isOptional: boolean;
  currentStepIndex: number;
  totalEnabledSteps: number;
  activeItemDefinition?: QuestionnaireItemDefinition;
  formRef: React.RefObject<HTMLFormElement | null>;
}

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null);

export function useQuestionnaireContext() {
  const ctx = React.useContext(QuestionnaireContext);
  if (!ctx) {
    throw new Error("Questionnaire compound components must be used within a Questionnaire root");
  }
  return ctx;
}

interface ItemContextValue {
  name: string;
  required: boolean;
  disabled: boolean;
  multiple: boolean;
  invalid?: boolean;
  isActive: boolean;
  status: QuestionnaireItemStatus;
  error?: string;
  choiceIndexCounter: { current: number };
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

export function useQuestionnaireItemContext() {
  const ctx = React.useContext(ItemContext);
  if (!ctx) {
    throw new Error("Questionnaire item components must be used within a QuestionnaireItem");
  }
  return ctx;
}

function checkHasDefaultAnswer(fieldset: HTMLFieldSetElement | null): boolean {
  if (!fieldset) return false;
  const checked = fieldset.querySelector("input:checked");
  if (checked) return true;
  const textInputs = fieldset.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "input:not([type='radio']):not([type='checkbox']), textarea"
  );
  for (const input of Array.from(textInputs)) {
    if (input.value && input.value.trim().length > 0) return true;
    if (input.defaultValue && input.defaultValue.trim().length > 0) return true;
  }
  return false;
}

/* ==========================================================================
   Questionnaire (Root)
   Always renders a native form; handles navigation, SSR items ordering,
   keyboard shortcuts and native FormData retention.
   ========================================================================== */

export interface QuestionnaireProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  items?: readonly QuestionnaireItemDefinition[];
  item?: string;
  defaultItem?: string;
  onItemChange?: (item: string) => void;
  shortcuts?: "letters" | "numbers";
  noValidate?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Questionnaire = React.forwardRef<HTMLFormElement, QuestionnaireProps>(
  (
    {
      items: propItems,
      item: controlledItem,
      defaultItem,
      onItemChange,
      shortcuts,
      noValidate = true,
      onSubmit,
      onReset,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    // Own internal form ref and compose external object/callback refs
    const internalFormRef = React.useRef<HTMLFormElement | null>(null);

    const handleFormRef = React.useCallback(
      (node: HTMLFormElement | null) => {
        internalFormRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef && typeof forwardedRef === "object") {
          (forwardedRef as React.MutableRefObject<HTMLFormElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    // Ref holding all registered items for stable callbacks and imperative lookups
    const registeredItemsRef = React.useRef<Map<string, ItemRegistration>>(new Map());

    // Immutable state Map for re-renders when item structure changes
    const [registeredItems, setRegisteredItems] = React.useState<Map<string, ItemRegistration>>(
      () => new Map()
    );

    const registerItem = React.useCallback((meta: ItemRegistration) => {
      registeredItemsRef.current.set(meta.name, meta);
      setRegisteredItems((prev) => {
        const existing = prev.get(meta.name);
        if (
          existing &&
          existing.name === meta.name &&
          existing.required === meta.required &&
          existing.disabled === meta.disabled &&
          existing.multiple === meta.multiple &&
          existing.invalid === meta.invalid &&
          existing.explicitRequired === meta.explicitRequired &&
          existing.fieldsetRef === meta.fieldsetRef
        ) {
          return prev;
        }
        const next = new Map(prev);
        next.set(meta.name, meta);
        return next;
      });
    }, []);

    const unregisterItem = React.useCallback((name: string) => {
      registeredItemsRef.current.delete(name);
      setRegisteredItems((prev) => {
        if (!prev.has(name)) return prev;
        const next = new Map(prev);
        next.delete(name);
        return next;
      });
    }, []);

    // Derive complete ordered items list
    const orderedItems = React.useMemo<QuestionnaireItemDefinition[]>(() => {
      if (propItems && propItems.length > 0) {
        const fromProps: QuestionnaireItemDefinition[] = propItems.map((p) => {
          const registered = registeredItems.get(p.name);
          return {
            ...p,
            required:
              registered?.explicitRequired && registered.required !== undefined
                ? registered.required
                : (p.required ?? false),
            disabled: Boolean(p.disabled || (registered?.disabled ?? false)),
            multiple: registered?.multiple ?? p.multiple ?? false,
          };
        });

        // Child-defined optional root items not present in propItems
        const propNames = new Set(propItems.map((p) => p.name));
        const extraFromChildren: ItemRegistration[] = [];
        for (const [name, m] of registeredItems.entries()) {
          if (!propNames.has(name)) {
            extraFromChildren.push(m);
          }
        }
        // Preserve DOM order for extra child-defined items
        extraFromChildren.sort((a, b) => {
          const elA = a.fieldsetRef.current;
          const elB = b.fieldsetRef.current;
          if (elA && elB && elA !== elB) {
            const pos = elA.compareDocumentPosition(elB);
            if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
            if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
          }
          return 0;
        });

        return [
          ...fromProps,
          ...extraFromChildren.map((m) => ({
            name: m.name,
            required: m.required,
            disabled: m.disabled,
            multiple: m.multiple,
          })),
        ];
      }

      // No propItems provided: all items child-defined
      const itemsList = Array.from(registeredItems.values());
      // Preserve stable DOM order
      itemsList.sort((a, b) => {
        const elA = a.fieldsetRef.current;
        const elB = b.fieldsetRef.current;
        if (elA && elB && elA !== elB) {
          const pos = elA.compareDocumentPosition(elB);
          if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
          if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        }
        return 0;
      });
      return itemsList.map((m) => ({
        name: m.name,
        required: m.required,
        disabled: m.disabled,
        multiple: m.multiple,
      }));
    }, [propItems, registeredItems]);

    const enabledItems = React.useMemo(
      () => orderedItems.filter((i) => !i.disabled),
      [orderedItems]
    );

    // Derive initial active item respecting disabled items
    const getFirstEnabledItemName = React.useCallback((): string => {
      if (defaultItem) {
        const def = orderedItems.find((i) => i.name === defaultItem);
        if (def && !def.disabled) return defaultItem;
      }
      const firstEnabled = orderedItems.find((i) => !i.disabled);
      return firstEnabled ? firstEnabled.name : "";
    }, [defaultItem, orderedItems]);

    const isControlled = controlledItem !== undefined;
    const [uncontrolledActiveItem, setUncontrolledActiveItem] = React.useState<string>(
      defaultItem ?? ""
    );
    const activeItem = isControlled ? controlledItem : uncontrolledActiveItem;

    const [itemStatuses, setItemStatuses] = React.useState<Record<string, QuestionnaireItemStatus>>({});
    const [skippedItems, setSkippedItems] = React.useState<Set<string>>(() => new Set());
    const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});

    const itemStatusesRef = React.useRef<Record<string, QuestionnaireItemStatus>>({});
    itemStatusesRef.current = itemStatuses;

    const skippedItemsRef = React.useRef<Set<string>>(new Set());
    skippedItemsRef.current = skippedItems;

    const onItemChangeRef = React.useRef(onItemChange);
    onItemChangeRef.current = onItemChange;

    // When items register or change, initialize or correct activeItem if empty or disabled
    React.useEffect(() => {
      if (orderedItems.length === 0) return;

      const currentActiveDef = orderedItems.find((i) => i.name === activeItem);
      if (!activeItem || !currentActiveDef || currentActiveDef.disabled) {
        const nextTarget = getFirstEnabledItemName();
        if (nextTarget && nextTarget !== activeItem) {
          if (!isControlled) {
            setUncontrolledActiveItem(nextTarget);
          }
          onItemChangeRef.current?.(nextTarget);
        }
      }
    }, [orderedItems, activeItem, isControlled, getFirstEnabledItemName]);

    const currentStepIndex = Math.max(
      0,
      enabledItems.findIndex((i) => i.name === activeItem)
    );
    const totalEnabledSteps = enabledItems.length;
    const isFirstStep = totalEnabledSteps <= 1 || currentStepIndex <= 0;
    const isLastStep = totalEnabledSteps > 0 && currentStepIndex >= totalEnabledSteps - 1;

    const activeItemDefinition = orderedItems.find((i) => i.name === activeItem);
    const isOptional = !activeItemDefinition?.required;

    // Stable and idempotent setItemStatus callback
    const setItemStatus = React.useCallback(
      (name: string, status: QuestionnaireItemStatus) => {
        const currentStatus = itemStatusesRef.current[name] ?? "unanswered";
        const isSkipped = skippedItemsRef.current.has(name);
        const willBeSkipped = status === "skipped";

        if (currentStatus === status && isSkipped === willBeSkipped) {
          return;
        }

        itemStatusesRef.current[name] = status;
        setItemStatuses((prev) => {
          if (prev[name] === status) return prev;
          return { ...prev, [name]: status };
        });

        // Notify registered item status callback safely without restarting registration
        const meta = registeredItemsRef.current.get(name);
        meta?.onStatusChange?.(status);

        if (status === "skipped") {
          setSkippedItems((prev) => {
            if (prev.has(name)) return prev;
            const next = new Set(prev);
            next.add(name);
            return next;
          });
        } else if (status === "answered") {
          setSkippedItems((prev) => {
            if (!prev.has(name)) return prev;
            const next = new Set(prev);
            next.delete(name);
            return next;
          });
        }
      },
      []
    );

    const setError = React.useCallback((name: string, error: string | undefined) => {
      setErrors((prev) => {
        if (prev[name] === error) return prev;
        return { ...prev, [name]: error };
      });
    }, []);

    const goToItem = React.useCallback(
      (targetName: string) => {
        onItemChangeRef.current?.(targetName);
        if (!isControlled) {
          setUncontrolledActiveItem(targetName);
        }
        // Focus the target fieldset on navigation
        setTimeout(() => {
          const meta = registeredItemsRef.current.get(targetName);
          meta?.fieldsetRef.current?.focus();
        }, 0);
      },
      [isControlled]
    );

    // Validation for a single step
    const validateStep = React.useCallback(
      (name: string): boolean => {
        const meta = registeredItemsRef.current.get(name);
        const def = orderedItems.find((i) => i.name === name);
        if (!def || def.disabled) return true;

        if (meta?.invalid) {
          setError(name, "This field is invalid.");
          const firstInput = meta.fieldsetRef.current?.querySelector<HTMLElement>(
            "input:not([disabled]), textarea:not([disabled]), button:not([disabled])"
          );
          firstInput?.focus();
          return false;
        }

        const form = internalFormRef.current;
        let hasValue = false;

        if (form) {
          const formData = new FormData(form);
          const values = formData.getAll(name);
          const nonBlank = values.filter((v) => typeof v === "string" && v.trim().length > 0);
          hasValue = nonBlank.length > 0;
        }

        // Also check directly on the fieldset controls if inactive/default-filled
        if (!hasValue && meta?.fieldsetRef.current) {
          hasValue = checkHasDefaultAnswer(meta.fieldsetRef.current);
        }

        const isSkipped = skippedItems.has(name);

        if (def.required) {
          if (!hasValue || isSkipped) {
            setError(name, "This field is required.");
            const firstInput = meta?.fieldsetRef.current?.querySelector<HTMLElement>(
              "input:not([disabled]), textarea:not([disabled])"
            );
            firstInput?.focus();
            return false;
          }
        } else {
          // Optional step: requires explicit Skip or an answer
          if (!hasValue && !isSkipped) {
            setError(name, "Please select an answer or choose Skip.");
            const firstInput = meta?.fieldsetRef.current?.querySelector<HTMLElement>(
              "input:not([disabled]), textarea:not([disabled])"
            );
            firstInput?.focus();
            return false;
          }
        }

        setError(name, undefined);
        return true;
      },
      [orderedItems, skippedItems, setError]
    );

    const handleNext = React.useCallback(() => {
      if (!activeItem) return;
      const isValid = validateStep(activeItem);
      if (!isValid) return;

      const nextItem = enabledItems[currentStepIndex + 1];
      if (nextItem) {
        goToItem(nextItem.name);
      }
    }, [activeItem, validateStep, enabledItems, currentStepIndex, goToItem]);

    const handlePrevious = React.useCallback(() => {
      const prevItem = enabledItems[currentStepIndex - 1];
      if (prevItem) {
        goToItem(prevItem.name);
      }
    }, [enabledItems, currentStepIndex, goToItem]);

    const handleSkip = React.useCallback(() => {
      if (!activeItem) return;
      setItemStatus(activeItem, "skipped");
      setError(activeItem, undefined);

      const nextItem = enabledItems[currentStepIndex + 1];
      if (nextItem) {
        goToItem(nextItem.name);
      }
    }, [activeItem, setItemStatus, setError, enabledItems, currentStepIndex, goToItem]);

    const handleFormSubmit = React.useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        // Intercept only invalid submissions; successful submit must reach caller uncanceled
        for (const itemDef of enabledItems) {
          const isValid = validateStep(itemDef.name);
          if (!isValid) {
            e.preventDefault();
            if (itemDef.name !== activeItem) {
              goToItem(itemDef.name);
            }
            return;
          }
        }

        // Before submitting, ensure all skipped items are disabled so native FormData excludes them
        for (const skippedName of skippedItems) {
          const meta = registeredItemsRef.current.get(skippedName);
          if (meta?.fieldsetRef.current) {
            meta.fieldsetRef.current.disabled = true;
          }
        }

        onSubmit?.(e);
      },
      [enabledItems, validateStep, activeItem, goToItem, onSubmit, skippedItems]
    );

    const handleFormReset = React.useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        onReset?.(e);
        if (e.defaultPrevented) return;

        // Reset state after native reset restores defaults
        if (internalFormRef.current) {
          const controls = internalFormRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            "input, select, textarea"
          );
          controls.forEach((el) => {
            const origName = el.getAttribute("data-cfui-name");
            if (origName) {
              el.setAttribute("name", origName);
              el.removeAttribute("data-cfui-name");
            }
            if (el instanceof HTMLInputElement) {
              if (el.type === "radio" || el.type === "checkbox") {
                el.checked = el.defaultChecked;
              } else {
                el.value = el.defaultValue;
              }
            } else if (el instanceof HTMLTextAreaElement) {
              el.value = el.defaultValue;
            }
          });
        }

        const nextStatuses: Record<string, QuestionnaireItemStatus> = {};
        for (const [name, meta] of registeredItemsRef.current.entries()) {
          const status = checkHasDefaultAnswer(meta.fieldsetRef.current) ? "answered" : "unanswered";
          nextStatuses[name] = status;
          meta.onStatusChange?.(status);
        }
        itemStatusesRef.current = nextStatuses;
        setItemStatuses(nextStatuses);

        skippedItemsRef.current = new Set();
        setSkippedItems(new Set());
        setErrors({});

        const initialTarget = getFirstEnabledItemName();
        if (initialTarget) {
          goToItem(initialTarget);
        }

        setTimeout(() => {
          const delayedStatuses: Record<string, QuestionnaireItemStatus> = {};
          for (const [name, meta] of registeredItemsRef.current.entries()) {
            const status = checkHasDefaultAnswer(meta.fieldsetRef.current) ? "answered" : "unanswered";
            delayedStatuses[name] = status;
            meta.onStatusChange?.(status);
          }
          itemStatusesRef.current = delayedStatuses;
          setItemStatuses(delayedStatuses);
        }, 0);
      },
      [onReset, getFirstEnabledItemName, goToItem]
    );

    // Keyboard shortcuts (letters or numbers) for choices
    React.useEffect(() => {
      if (!shortcuts) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;

        const target = e.target as HTMLElement | null;
        if (target) {
          const tag = target.tagName?.toLowerCase();
          const isTextEditing =
            target.isContentEditable ||
            tag === "textarea" ||
            (tag === "input" && (target as HTMLInputElement).type !== "radio" && (target as HTMLInputElement).type !== "checkbox");
          if (isTextEditing) return;
        }

        let choiceIndex = -1;
        if (shortcuts === "letters") {
          const char = e.key.toLowerCase();
          if (char >= "a" && char <= "z") {
            choiceIndex = char.charCodeAt(0) - 97;
          }
        } else if (shortcuts === "numbers") {
          const num = parseInt(e.key, 10);
          if (!isNaN(num) && num >= 1 && num <= 9) {
            choiceIndex = num - 1;
          }
        }

        if (choiceIndex >= 0) {
          const meta = registeredItemsRef.current.get(activeItem);
          if (meta?.fieldsetRef.current) {
            const inputs = Array.from(
              meta.fieldsetRef.current.querySelectorAll<HTMLInputElement>(
                ".cfui-questionnaire-choice-control:not([disabled])"
              )
            );
            const targetInput = inputs[choiceIndex];
            if (targetInput) {
              e.preventDefault();
              targetInput.click();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [shortcuts, activeItem]);

    const contextValue = React.useMemo<QuestionnaireContextValue>(
      () => ({
        activeItem,
        items: orderedItems,
        registeredItems,
        registerItem,
        unregisterItem,
        itemStatuses,
        setItemStatus,
        skippedItems,
        errors,
        setError,
        goToItem,
        handleNext,
        handlePrevious,
        handleSkip,
        isFirstStep,
        isLastStep,
        isOptional,
        currentStepIndex,
        totalEnabledSteps,
        activeItemDefinition,
        formRef: internalFormRef,
      }),
      [
        activeItem,
        orderedItems,
        registeredItems,
        registerItem,
        unregisterItem,
        itemStatuses,
        setItemStatus,
        skippedItems,
        errors,
        setError,
        goToItem,
        handleNext,
        handlePrevious,
        handleSkip,
        isFirstStep,
        isLastStep,
        isOptional,
        currentStepIndex,
        totalEnabledSteps,
        activeItemDefinition,
      ]
    );

    return (
      <QuestionnaireContext.Provider value={contextValue}>
        <form
          ref={handleFormRef}
          noValidate={noValidate}
          onSubmit={handleFormSubmit}
          onReset={handleFormReset}
          className={cn("cfui-questionnaire", className)}
          {...props}
        >
          {children}
        </form>
      </QuestionnaireContext.Provider>
    );
  }
);
Questionnaire.displayName = "Questionnaire";

/* ==========================================================================
   QuestionnaireProgress
   Progressbar with named progress semantics, data attributes and optional
   render-state composition.
   ========================================================================== */

export interface QuestionnaireProgressRenderState {
  current: number;
  total: number;
  percent: number;
  isFirst: boolean;
  isLast: boolean;
  status?: QuestionnaireItemStatus;
  activeItem?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export interface QuestionnaireProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  asChild?: boolean;
  children?:
    | React.ReactNode
    | ((state: QuestionnaireProgressRenderState) => React.ReactNode);
}

export const QuestionnaireProgress = React.forwardRef<
  HTMLDivElement,
  QuestionnaireProgressProps
>(({ asChild = false, className, children, "aria-label": ariaLabel = "Questionnaire progress", ...props }, ref) => {
  const {
    currentStepIndex,
    totalEnabledSteps,
    isFirstStep,
    isLastStep,
    activeItem,
    itemStatuses,
    skippedItems,
    errors,
    activeItemDefinition,
  } = useQuestionnaireContext();
  const Component = asChild ? Slot : "div";

  const current = totalEnabledSteps > 0 ? currentStepIndex + 1 : 0;
  const percent = totalEnabledSteps > 0 ? Math.round((current / totalEnabledSteps) * 100) : 0;
  const isSkipped = activeItem ? skippedItems.has(activeItem) : false;
  const activeStatus: QuestionnaireItemStatus | undefined = activeItem
    ? isSkipped
      ? "skipped"
      : (itemStatuses[activeItem] ?? "unanswered")
    : undefined;
  const isInvalid = activeItem ? Boolean(errors[activeItem]) : false;
  const isDisabled = Boolean(activeItemDefinition?.disabled);

  const renderState: QuestionnaireProgressRenderState = {
    current,
    total: totalEnabledSteps,
    percent,
    isFirst: isFirstStep,
    isLast: isLastStep,
    status: activeStatus,
    activeItem,
    disabled: isDisabled,
    invalid: isInvalid,
  };

  return (
    <Component
      ref={ref}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={totalEnabledSteps || 1}
      data-current={current}
      data-total={totalEnabledSteps}
      data-first={isFirstStep ? "true" : "false"}
      data-last={isLastStep ? "true" : "false"}
      data-active={activeItem || undefined}
      data-status={activeStatus}
      data-invalid={isInvalid ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      className={cn("cfui-questionnaire-progress", className)}
      {...props}
    >
      {typeof children === "function" ? (
        children(renderState)
      ) : children !== undefined ? (
        children
      ) : (
        <div
          className="cfui-questionnaire-progress-fill"
          style={{ width: `${percent}%` }}
        />
      )}
    </Component>
  );
});
QuestionnaireProgress.displayName = "QuestionnaireProgress";

/* ==========================================================================
   QuestionnaireItem
   Item always renders fieldset; manages status, disabled and inert inactive states.
   Composes external refs and respects root disabled definitions.
   ========================================================================== */

export interface QuestionnaireItemProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  name: string;
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  onStatusChange?: (status: QuestionnaireItemStatus) => void;
  asChild?: boolean;
}

export const QuestionnaireItem = React.forwardRef<
  HTMLFieldSetElement,
  QuestionnaireItemProps
>(
  (
    {
      name,
      required: explicitRequiredProp,
      multiple = false,
      disabled = false,
      invalid = false,
      onStatusChange,
      asChild = false,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const {
      activeItem,
      items,
      registerItem,
      unregisterItem,
      itemStatuses,
      setItemStatus,
      skippedItems,
      errors,
      setError,
    } = useQuestionnaireContext();

    const internalFieldsetRef = React.useRef<HTMLFieldSetElement | null>(null);

    const handleRef = React.useCallback(
      (node: HTMLFieldSetElement | null) => {
        internalFieldsetRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef && typeof forwardedRef === "object") {
          (forwardedRef as React.MutableRefObject<HTMLFieldSetElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    const choiceIndexCounter = React.useRef(0);
    choiceIndexCounter.current = 0;

    const rootDef = items.find((i) => i.name === name);
    const hasExplicitRequired = explicitRequiredProp !== undefined;
    const isItemRequired = hasExplicitRequired
      ? explicitRequiredProp
      : (rootDef?.required ?? false);
    const isItemDisabled = Boolean(rootDef?.disabled || disabled);
    const isItemMultiple = multiple || (rootDef?.multiple ?? false);

    // Keep onStatusChange callback reference in a ref so changes never cause re-registration
    const onStatusChangeRef = React.useRef(onStatusChange);
    onStatusChangeRef.current = onStatusChange;

    const registrationMeta = React.useMemo<ItemRegistration>(
      () => ({
        name,
        required: isItemRequired,
        disabled: isItemDisabled,
        multiple: isItemMultiple,
        invalid,
        explicitRequired: hasExplicitRequired,
        onStatusChange: (status) => onStatusChangeRef.current?.(status),
        fieldsetRef: internalFieldsetRef,
      }),
      [name, isItemRequired, isItemDisabled, isItemMultiple, invalid, hasExplicitRequired]
    );

    // Stable registration on mount or name change; unregister ONLY on unmount or name change
    React.useEffect(() => {
      registerItem(registrationMeta);
      return () => {
        unregisterItem(name);
      };
    }, [name, registerItem, unregisterItem]);

    // Update registration when properties change without unregistering
    React.useEffect(() => {
      registerItem(registrationMeta);
    }, [registrationMeta, registerItem]);

    // Derive initial status from default values if present on mount
    React.useEffect(() => {
      if (checkHasDefaultAnswer(internalFieldsetRef.current)) {
        setItemStatus(name, "answered");
      }
    }, [name, setItemStatus]);

    const isActive = activeItem === name;
    const isSkipped = skippedItems.has(name);
    const status = isSkipped ? "skipped" : (itemStatuses[name] ?? "unanswered");
    const error = errors[name];

    const itemContextValue = React.useMemo<ItemContextValue>(
      () => ({
        name,
        required: isItemRequired,
        disabled: isItemDisabled,
        multiple: isItemMultiple,
        invalid,
        isActive,
        status,
        error,
        choiceIndexCounter,
      }),
      [name, isItemRequired, isItemDisabled, isItemMultiple, invalid, isActive, status, error]
    );

    const Component = asChild ? Slot : "fieldset";

    // Skipped questions must remain editable when active (revisitable);
    // when inactive and skipped, disabled ensures no answer is contributed to FormData.
    const fieldsetDisabled = isItemDisabled || (!isActive && isSkipped);

    // Ensure all submittable controls within this fieldset omit their name attribute
    // when skipped so they do not serialize into native FormData at any active/inactive position.
    React.useLayoutEffect(() => {
      const fieldset = internalFieldsetRef.current;
      if (!fieldset) return;

      const controls = fieldset.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        "input, select, textarea"
      );

      if (isSkipped) {
        controls.forEach((el) => {
          if (el.name) {
            el.setAttribute("data-cfui-name", el.name);
            el.name = "";
            el.removeAttribute("name");
          }
        });
      } else {
        controls.forEach((el) => {
          const origName = el.getAttribute("data-cfui-name");
          if (origName) {
            el.name = origName;
            el.setAttribute("name", origName);
            el.removeAttribute("data-cfui-name");
          }
        });
      }
    }, [isSkipped]);

    const handleFieldsetInput = (e: React.FormEvent<HTMLFieldSetElement>) => {
      if (isSkipped) {
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const hasVal =
          target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")
            ? target.checked
            : Boolean(target.value && target.value.trim().length > 0);
        if (hasVal) {
          setItemStatus(name, "answered");
          setError(name, undefined);
        }
      }
    };

    return (
      <ItemContext.Provider value={itemContextValue}>
        <Component
          ref={handleRef}
          name={name}
          tabIndex={-1}
          hidden={!isActive}
          disabled={fieldsetDisabled}
          aria-invalid={invalid || !!error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          data-status={status}
          data-active={isActive ? "true" : "false"}
          data-disabled={isItemDisabled ? "true" : undefined}
          data-invalid={invalid || !!error ? "true" : undefined}
          onInput={handleFieldsetInput}
          onChange={handleFieldsetInput}
          style={{ display: isActive ? undefined : "none" }}
          className={cn(
            "cfui-questionnaire-item",
            isActive && "cfui-questionnaire-item--active",
            isItemDisabled && "cfui-questionnaire-item--disabled",
            (invalid || !!error) && "cfui-questionnaire-item--invalid",
            className
          )}
          {...props}
        >
          {children}
        </Component>
      </ItemContext.Provider>
    );
  }
);
QuestionnaireItem.displayName = "QuestionnaireItem";

/* ==========================================================================
   QuestionnaireTitle & QuestionnaireDescription
   Title defaults to legend; Description to p
   ========================================================================== */

export interface QuestionnaireTitleProps
  extends React.HTMLAttributes<HTMLLegendElement> {
  asChild?: boolean;
}

export const QuestionnaireTitle = React.forwardRef<
  HTMLLegendElement,
  QuestionnaireTitleProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const Component = asChild ? Slot : "legend";
  return (
    <Component
      ref={ref}
      className={cn("cfui-questionnaire-title", className)}
      {...props}
    >
      {children}
    </Component>
  );
});
QuestionnaireTitle.displayName = "QuestionnaireTitle";

export interface QuestionnaireDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export const QuestionnaireDescription = React.forwardRef<
  HTMLParagraphElement,
  QuestionnaireDescriptionProps
>(({ asChild = false, className, ...props }, ref) => {
  const Component = asChild ? Slot : "p";
  return (
    <Component
      ref={ref}
      className={cn("cfui-questionnaire-description", className)}
      {...props}
    />
  );
});
QuestionnaireDescription.displayName = "QuestionnaireDescription";

/* ==========================================================================
   QuestionnaireChoices & QuestionnaireChoice
   Choice composes native radio/checkbox based on Item.multiple; full label clickable.
   Omits native onChange before redeclaration to satisfy strict tsc (TS2430).
   ========================================================================== */

export interface QuestionnaireChoicesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const QuestionnaireChoices = React.forwardRef<
  HTMLDivElement,
  QuestionnaireChoicesProps
>(({ asChild = false, className, ...props }, ref) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      className={cn("cfui-questionnaire-choices", className)}
      {...props}
    />
  );
});
QuestionnaireChoices.displayName = "QuestionnaireChoices";

export interface QuestionnaireChoiceProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  value: string;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const QuestionnaireChoice = React.forwardRef<
  HTMLLabelElement,
  QuestionnaireChoiceProps
>(
  (
    {
      value,
      disabled = false,
      checked,
      defaultChecked,
      onChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const item = useQuestionnaireItemContext();
    const { setItemStatus, setError } = useQuestionnaireContext();

    const isInputDisabled = disabled || item.disabled;

    React.useEffect(() => {
      if ((checked || defaultChecked) && item.status !== "skipped") {
        setItemStatus(item.name, "answered");
      }
    }, [checked, defaultChecked, item.name, item.status, setItemStatus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setItemStatus(item.name, "answered");
      setError(item.name, undefined);
      onChange?.(e);
    };

    const handleClick = () => {
      if (item.status === "skipped") {
        setItemStatus(item.name, "answered");
        setError(item.name, undefined);
      }
    };

    return (
      <label
        ref={ref}
        data-disabled={isInputDisabled ? "true" : undefined}
        className={cn(
          "cfui-questionnaire-choice",
          isInputDisabled && "cfui-questionnaire-choice--disabled",
          className
        )}
        {...props}
      >
        <input
          type={item.multiple ? "checkbox" : "radio"}
          name={item.status === "skipped" ? undefined : item.name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={isInputDisabled}
          onChange={handleChange}
          onClick={handleClick}
          className="cfui-questionnaire-choice-control"
        />
        <span className="cfui-questionnaire-choice-label">{children}</span>
      </label>
    );
  }
);
QuestionnaireChoice.displayName = "QuestionnaireChoice";

/* ==========================================================================
   QuestionnaireInput
   Text input using containing item name
   ========================================================================== */

export interface QuestionnaireInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  asChild?: boolean;
}

export const QuestionnaireInput = React.forwardRef<
  HTMLInputElement,
  QuestionnaireInputProps
>(({ disabled = false, onChange, defaultValue, value, className, type = "text", ...props }, ref) => {
  const item = useQuestionnaireItemContext();
  const { setItemStatus, setError } = useQuestionnaireContext();

  const isInputDisabled = disabled || item.disabled;

  React.useEffect(() => {
    const hasDefault =
      (value !== undefined && String(value).trim().length > 0) ||
      (defaultValue !== undefined && String(defaultValue).trim().length > 0);
    if (hasDefault && item.status !== "skipped") {
      setItemStatus(item.name, "answered");
    }
  }, [value, defaultValue, item.name, item.status, setItemStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setItemStatus(item.name, val.trim().length > 0 ? "answered" : "unanswered");
    setError(item.name, undefined);
    onChange?.(e);
  };

  return (
    <input
      ref={ref}
      type={type}
      name={item.status === "skipped" ? undefined : item.name}
      value={value}
      defaultValue={defaultValue}
      disabled={isInputDisabled}
      onChange={handleChange}
      className={cn("cfui-questionnaire-input", className)}
      {...props}
    />
  );
});
QuestionnaireInput.displayName = "QuestionnaireInput";

/* ==========================================================================
   QuestionnaireError
   Associated accessible error
   ========================================================================== */

export interface QuestionnaireErrorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const QuestionnaireError = React.forwardRef<
  HTMLDivElement,
  QuestionnaireErrorProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const item = useQuestionnaireItemContext();
  const Component = asChild ? Slot : "div";

  const message = children ?? item.error;
  if (!message) return null;

  return (
    <Component
      ref={ref}
      role="alert"
      id={`${item.name}-error`}
      className={cn("cfui-questionnaire-error", className)}
      {...props}
    >
      {message}
    </Component>
  );
});
QuestionnaireError.displayName = "QuestionnaireError";

/* ==========================================================================
   QuestionnaireActions
   Layout container for step action buttons
   ========================================================================== */

export interface QuestionnaireActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const QuestionnaireActions = React.forwardRef<
  HTMLDivElement,
  QuestionnaireActionsProps
>(({ asChild = false, className, ...props }, ref) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      className={cn("cfui-questionnaire-actions", className)}
      {...props}
    />
  );
});
QuestionnaireActions.displayName = "QuestionnaireActions";

/* ==========================================================================
   QuestionnairePrevious
   Button visible off first step; composes caller preventDefault
   ========================================================================== */

export interface QuestionnairePreviousProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const QuestionnairePrevious = React.forwardRef<
  HTMLButtonElement,
  QuestionnairePreviousProps
>(({ asChild = false, className, onClick, type = "button", children = "Previous", ...props }, ref) => {
  const { isFirstStep, handlePrevious } = useQuestionnaireContext();
  const Component = asChild ? Slot : "button";

  if (isFirstStep) return null;

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          handlePrevious();
        }
      }}
      className={cn(
        "cfui-questionnaire-action",
        "cfui-questionnaire-previous",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
QuestionnairePrevious.displayName = "QuestionnairePrevious";

/* ==========================================================================
   QuestionnaireSkip
   Button visible on optional steps; composes caller preventDefault
   ========================================================================== */

export interface QuestionnaireSkipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const QuestionnaireSkip = React.forwardRef<
  HTMLButtonElement,
  QuestionnaireSkipProps
>(({ asChild = false, className, onClick, type = "button", children = "Skip", ...props }, ref) => {
  const { isOptional, handleSkip } = useQuestionnaireContext();
  const Component = asChild ? Slot : "button";

  if (!isOptional) return null;

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          handleSkip();
        }
      }}
      className={cn(
        "cfui-questionnaire-action",
        "cfui-questionnaire-skip",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
QuestionnaireSkip.displayName = "QuestionnaireSkip";

/* ==========================================================================
   QuestionnaireNext
   Button visible off last step; validates active step; composes caller preventDefault
   ========================================================================== */

export interface QuestionnaireNextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const QuestionnaireNext = React.forwardRef<
  HTMLButtonElement,
  QuestionnaireNextProps
>(({ asChild = false, className, onClick, type = "button", children = "Next", ...props }, ref) => {
  const { isLastStep, handleNext } = useQuestionnaireContext();
  const Component = asChild ? Slot : "button";

  if (isLastStep) return null;

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          handleNext();
        }
      }}
      className={cn(
        "cfui-questionnaire-action",
        "cfui-questionnaire-next",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
QuestionnaireNext.displayName = "QuestionnaireNext";

/* ==========================================================================
   QuestionnaireSubmit
   Submit button visible on last step; validates all enabled steps
   ========================================================================== */

export interface QuestionnaireSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const QuestionnaireSubmit = React.forwardRef<
  HTMLButtonElement,
  QuestionnaireSubmitProps
>(({ asChild = false, className, type = "submit", children = "Submit", ...props }, ref) => {
  const { isLastStep } = useQuestionnaireContext();
  const Component = asChild ? Slot : "button";

  if (!isLastStep) return null;

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      className={cn(
        "cfui-questionnaire-action",
        "cfui-questionnaire-submit",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
QuestionnaireSubmit.displayName = "QuestionnaireSubmit";
