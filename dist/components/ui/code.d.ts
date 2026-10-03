import * as React from "react";
                    
export interface CodeProps extends React.HTMLAttributes<HTMLDivElement> {
    code?: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    copyable?: boolean;
    copyTimeout?: number;
    asChild?: boolean;
}
interface CodeContextValue {
    code: string;
    language?: string;
    filename?: string;
    copied: boolean;
    copy: () => Promise<void>;
    showLineNumbers: boolean;
}
export declare function useCodeContext(): CodeContextValue;
export declare const Code: React.ForwardRefExoticComponent<CodeProps & React.RefAttributes<HTMLDivElement>>;
export interface CodeHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const CodeHeader: React.ForwardRefExoticComponent<CodeHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface CodeFilenameProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const CodeFilename: React.ForwardRefExoticComponent<CodeFilenameProps & React.RefAttributes<HTMLSpanElement>>;
export declare const CodeTitle: React.ForwardRefExoticComponent<CodeFilenameProps & React.RefAttributes<HTMLSpanElement>>;
export interface CodeLanguageProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}
export declare const CodeLanguage: React.ForwardRefExoticComponent<CodeLanguageProps & React.RefAttributes<HTMLSpanElement>>;
export interface CodeCopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const CodeCopyButton: React.ForwardRefExoticComponent<CodeCopyButtonProps & React.RefAttributes<HTMLButtonElement>>;
export declare const CodeCopy: React.ForwardRefExoticComponent<CodeCopyButtonProps & React.RefAttributes<HTMLButtonElement>>;
export interface CodeContentProps extends React.HTMLAttributes<HTMLPreElement> {
    asChild?: boolean;
}
export declare const CodeContent: React.ForwardRefExoticComponent<CodeContentProps & React.RefAttributes<HTMLPreElement>>;
export declare const CodePre: React.ForwardRefExoticComponent<CodeContentProps & React.RefAttributes<HTMLPreElement>>;
export interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
}
export declare const InlineCode: React.ForwardRefExoticComponent<InlineCodeProps & React.RefAttributes<HTMLElement>>;
export {};
//# sourceMappingURL=code.d.ts.map