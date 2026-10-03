import * as React from "react";
                       
export type MessageAlign = "start" | "end";
interface MessageContextValue {
    align: MessageAlign;
}
export declare function useMessageContext(): MessageContextValue;
export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: MessageAlign;
    asChild?: boolean;
}
export declare const Message: React.ForwardRefExoticComponent<MessageProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: React.ReactNode;
    asChild?: boolean;
}
export declare const MessageAvatar: React.ForwardRefExoticComponent<MessageAvatarProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const MessageContent: React.ForwardRefExoticComponent<MessageContentProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: MessageAlign;
    asChild?: boolean;
}
export declare const MessageHeader: React.ForwardRefExoticComponent<MessageHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: MessageAlign;
    asChild?: boolean;
}
export declare const MessageFooter: React.ForwardRefExoticComponent<MessageFooterProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: MessageAlign;
    asChild?: boolean;
}
export declare const MessageGroup: React.ForwardRefExoticComponent<MessageGroupProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=message.d.ts.map