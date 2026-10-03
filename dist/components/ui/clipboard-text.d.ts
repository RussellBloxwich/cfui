import * as React from "react";
                              
export type ClipboardStatus = "idle" | "copied" | "error";
export interface ClipboardTextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    displayText?: string;
    timeout?: number;
    onCopySuccess?: (text: string) => void;
    onCopyError?: (error: Error) => void;
    variant?: "inline" | "button" | "ghost" | "badge";
    asChild?: boolean;
}
interface ClipboardTextContextValue {
    text: string;
    status: ClipboardStatus;
    copy: () => Promise<void>;
    variant: "inline" | "button" | "ghost" | "badge";
}
export declare function useClipboardTextContext(): ClipboardTextContextValue;
export declare function copyToClipboard(text: string): Promise<boolean>;
export declare const ClipboardText: React.ForwardRefExoticComponent<ClipboardTextProps & React.RefAttributes<HTMLButtonElement>>;
export interface ClipboardTextValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const ClipboardTextValue: React.ForwardRefExoticComponent<ClipboardTextValueProps & React.RefAttributes<HTMLSpanElement>>;
export interface ClipboardTextIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const ClipboardTextIcon: React.ForwardRefExoticComponent<ClipboardTextIconProps & React.RefAttributes<HTMLSpanElement>>;
export declare const ClipboardTextTrigger: React.ForwardRefExoticComponent<ClipboardTextProps & React.RefAttributes<HTMLButtonElement>>;
export declare const ClipboardTextButton: React.ForwardRefExoticComponent<ClipboardTextProps & React.RefAttributes<HTMLButtonElement>>;
export declare const InlineCopyText: React.ForwardRefExoticComponent<ClipboardTextProps & React.RefAttributes<HTMLButtonElement>>;
export type InlineCopyTextProps = ClipboardTextProps;
export {};
//# sourceMappingURL=clipboard-text.d.ts.map