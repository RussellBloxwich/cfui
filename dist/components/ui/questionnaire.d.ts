import * as React from "react";
                             
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
export declare function useQuestionnaireContext(): QuestionnaireContextValue;
interface ItemContextValue {
    name: string;
    required: boolean;
    disabled: boolean;
    multiple: boolean;
    invalid?: boolean;
    isActive: boolean;
    status: QuestionnaireItemStatus;
    error?: string;
    choiceIndexCounter: {
        current: number;
    };
}
export declare function useQuestionnaireItemContext(): ItemContextValue;
export interface QuestionnaireProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
    items?: readonly QuestionnaireItemDefinition[];
    item?: string;
    defaultItem?: string;
    onItemChange?: (item: string) => void;
    shortcuts?: "letters" | "numbers";
    noValidate?: boolean;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
export declare const Questionnaire: React.ForwardRefExoticComponent<QuestionnaireProps & React.RefAttributes<HTMLFormElement>>;
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
export interface QuestionnaireProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    asChild?: boolean;
    children?: React.ReactNode | ((state: QuestionnaireProgressRenderState) => React.ReactNode);
}
export declare const QuestionnaireProgress: React.ForwardRefExoticComponent<QuestionnaireProgressProps & React.RefAttributes<HTMLDivElement>>;
export interface QuestionnaireItemProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
    name: string;
    required?: boolean;
    multiple?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    onStatusChange?: (status: QuestionnaireItemStatus) => void;
    asChild?: boolean;
}
export declare const QuestionnaireItem: React.ForwardRefExoticComponent<QuestionnaireItemProps & React.RefAttributes<HTMLFieldSetElement>>;
export interface QuestionnaireTitleProps extends React.HTMLAttributes<HTMLLegendElement> {
    asChild?: boolean;
}
export declare const QuestionnaireTitle: React.ForwardRefExoticComponent<QuestionnaireTitleProps & React.RefAttributes<HTMLLegendElement>>;
export interface QuestionnaireDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    asChild?: boolean;
}
export declare const QuestionnaireDescription: React.ForwardRefExoticComponent<QuestionnaireDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface QuestionnaireChoicesProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const QuestionnaireChoices: React.ForwardRefExoticComponent<QuestionnaireChoicesProps & React.RefAttributes<HTMLDivElement>>;
export interface QuestionnaireChoiceProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
    value: string;
    disabled?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare const QuestionnaireChoice: React.ForwardRefExoticComponent<QuestionnaireChoiceProps & React.RefAttributes<HTMLLabelElement>>;
export interface QuestionnaireInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    asChild?: boolean;
}
export declare const QuestionnaireInput: React.ForwardRefExoticComponent<QuestionnaireInputProps & React.RefAttributes<HTMLInputElement>>;
export interface QuestionnaireErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const QuestionnaireError: React.ForwardRefExoticComponent<QuestionnaireErrorProps & React.RefAttributes<HTMLDivElement>>;
export interface QuestionnaireActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const QuestionnaireActions: React.ForwardRefExoticComponent<QuestionnaireActionsProps & React.RefAttributes<HTMLDivElement>>;
export interface QuestionnairePreviousProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const QuestionnairePrevious: React.ForwardRefExoticComponent<QuestionnairePreviousProps & React.RefAttributes<HTMLButtonElement>>;
export interface QuestionnaireSkipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const QuestionnaireSkip: React.ForwardRefExoticComponent<QuestionnaireSkipProps & React.RefAttributes<HTMLButtonElement>>;
export interface QuestionnaireNextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const QuestionnaireNext: React.ForwardRefExoticComponent<QuestionnaireNextProps & React.RefAttributes<HTMLButtonElement>>;
export interface QuestionnaireSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const QuestionnaireSubmit: React.ForwardRefExoticComponent<QuestionnaireSubmitProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=questionnaire.d.ts.map