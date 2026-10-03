import * as React from "react";
                                
export type ScrollPosition = "start" | "end" | "last-anchor";
export type ScrollAlign = "start" | "center" | "end" | "nearest";
export interface ScrollToMessageOptions {
    align?: ScrollAlign;
    behavior?: ScrollBehavior;
    scrollMargin?: number;
}
export interface MessageScrollerContextValue {
    viewportRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    registerItem: (id: string, element: HTMLElement, scrollAnchor: boolean) => void;
    unregisterItem: (id: string) => void;
    scrollToMessage: (id: string, options?: ScrollToMessageOptions) => boolean;
    scrollToEnd: (options?: {
        behavior?: ScrollBehavior;
    }) => boolean;
    scrollToStart: (options?: {
        behavior?: ScrollBehavior;
    }) => boolean;
    scrollable: {
        start: boolean;
        end: boolean;
    };
    visibility: {
        currentAnchorId: string | null;
        visibleMessageIds: string[];
    };
    isAutoScrolling: boolean;
    pendingScroll: boolean;
    preserveScrollOnPrepend: boolean;
    setPreserveScrollOnPrepend: (val: boolean) => void;
    updateScrollMetrics: () => void;
    isFollowingEdge: boolean;
    pauseFollowing: () => void;
    resumeFollowing: () => void;
    autoScroll: boolean;
}
export declare function useMessageScrollerContext(): MessageScrollerContextValue;
export declare function useMessageScroller(): {
    scrollToMessage: (id: string, options?: ScrollToMessageOptions) => boolean;
    scrollToEnd: (options?: {
        behavior?: ScrollBehavior;
    }) => boolean;
    scrollToStart: (options?: {
        behavior?: ScrollBehavior;
    }) => boolean;
};
export declare function useMessageScrollerScrollable(): {
    start: boolean;
    end: boolean;
};
export declare function useMessageScrollerVisibility(): {
    currentAnchorId: string | null;
    visibleMessageIds: string[];
};
export interface MessageScrollerProviderProps {
    autoScroll?: boolean;
    defaultScrollPosition?: ScrollPosition;
    scrollEdgeThreshold?: number;
    scrollMargin?: number;
    scrollPreviousItemPeek?: number;
    children?: React.ReactNode;
}
export declare function MessageScrollerProvider({ autoScroll, defaultScrollPosition, scrollEdgeThreshold, scrollMargin, scrollPreviousItemPeek, children, }: MessageScrollerProviderProps): React.JSX.Element;
export interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
export declare const MessageScroller: React.ForwardRefExoticComponent<MessageScrollerProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageScrollerViewportProps extends React.HTMLAttributes<HTMLDivElement> {
    preserveScrollOnPrepend?: boolean;
    asChild?: boolean;
}
export declare const MessageScrollerViewport: React.ForwardRefExoticComponent<MessageScrollerViewportProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageScrollerContentProps extends React.HTMLAttributes<HTMLDivElement> {
    spacerClassName?: string;
    asChild?: boolean;
}
export declare const MessageScrollerContent: React.ForwardRefExoticComponent<MessageScrollerContentProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageScrollerItemProps extends React.HTMLAttributes<HTMLDivElement> {
    messageId: string;
    scrollAnchor?: boolean;
    asChild?: boolean;
}
export declare const MessageScrollerItem: React.ForwardRefExoticComponent<MessageScrollerItemProps & React.RefAttributes<HTMLDivElement>>;
export interface MessageScrollerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    direction: "start" | "end";
    behavior?: ScrollBehavior;
    asChild?: boolean;
    render?: React.ReactElement<any> | ((props: React.ButtonHTMLAttributes<HTMLButtonElement>, state: {
        isAvailable: boolean;
        direction: "start" | "end";
    }) => React.ReactNode);
}
export declare const MessageScrollerButton: React.ForwardRefExoticComponent<MessageScrollerButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=message-scroller.d.ts.map