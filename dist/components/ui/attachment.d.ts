import * as React from "react";
                          
export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";
export type AttachmentSize = "default" | "sm" | "xs";
export type AttachmentOrientation = "horizontal" | "vertical";
export interface AttachmentContextValue {
    state: AttachmentState;
    size: AttachmentSize;
    orientation: AttachmentOrientation;
    disabled?: boolean;
}
export declare function useAttachmentContext(): AttachmentContextValue;
export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
    state?: AttachmentState;
    size?: AttachmentSize;
    orientation?: AttachmentOrientation;
    disabled?: boolean;
    asChild?: boolean;
}
export declare const Attachment: React.ForwardRefExoticComponent<AttachmentProps & React.RefAttributes<HTMLDivElement>>;
export interface AttachmentTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    href?: string;
    target?: string;
    rel?: string;
    render?: React.ReactElement<any> | ((props: React.HTMLAttributes<HTMLElement>, context: AttachmentContextValue) => React.ReactNode);
}
export declare const AttachmentTrigger: React.ForwardRefExoticComponent<AttachmentTriggerProps & React.RefAttributes<HTMLElement>>;
export interface AttachmentMediaProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "icon" | "image";
    src?: string;
    alt?: string;
    asChild?: boolean;
}
export declare const AttachmentMedia: React.ForwardRefExoticComponent<AttachmentMediaProps & React.RefAttributes<HTMLDivElement>>;
export interface AttachmentContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const AttachmentContent: React.ForwardRefExoticComponent<AttachmentContentProps & React.RefAttributes<HTMLDivElement>>;
export interface AttachmentTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    progress?: number;
    asChild?: boolean;
}
export declare const AttachmentTitle: React.ForwardRefExoticComponent<AttachmentTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface AttachmentDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    asChild?: boolean;
}
export declare const AttachmentDescription: React.ForwardRefExoticComponent<AttachmentDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface AttachmentActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const AttachmentActions: React.ForwardRefExoticComponent<AttachmentActionsProps & React.RefAttributes<HTMLDivElement>>;
export interface AttachmentActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
    size?: "default" | "sm" | "xs" | "lg" | "icon" | "icon-sm" | "icon-lg";
    loading?: boolean;
    href?: string;
    asChild?: boolean;
}
export declare const AttachmentAction: React.ForwardRefExoticComponent<AttachmentActionProps & React.RefAttributes<HTMLButtonElement>>;
export interface AttachmentGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const AttachmentGroup: React.ForwardRefExoticComponent<AttachmentGroupProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=attachment.d.ts.map