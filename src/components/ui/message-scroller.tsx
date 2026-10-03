import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./message-scroller.css";

export type ScrollPosition = "start" | "end" | "last-anchor";
export type ScrollAlign = "start" | "center" | "end" | "nearest";

export interface ScrollToMessageOptions {
  align?: ScrollAlign;
  behavior?: ScrollBehavior;
  scrollMargin?: number;
}

interface ItemEntry {
  messageId: string;
  element: HTMLElement;
  scrollAnchor: boolean;
}

export interface MessageScrollerContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  registerItem: (id: string, element: HTMLElement, scrollAnchor: boolean) => void;
  unregisterItem: (id: string) => void;
  scrollToMessage: (id: string, options?: ScrollToMessageOptions) => boolean;
  scrollToEnd: (options?: { behavior?: ScrollBehavior }) => boolean;
  scrollToStart: (options?: { behavior?: ScrollBehavior }) => boolean;
  scrollable: { start: boolean; end: boolean };
  visibility: { currentAnchorId: string | null; visibleMessageIds: string[] };
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

const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null);

export function useMessageScrollerContext() {
  const ctx = React.useContext(MessageScrollerContext);
  if (!ctx) {
    throw new Error("MessageScroller components must be wrapped in MessageScrollerProvider");
  }
  return ctx;
}

/* ==========================================================================
   Public Hooks
   ========================================================================== */

export function useMessageScroller() {
  const { scrollToMessage, scrollToEnd, scrollToStart } = useMessageScrollerContext();
  return React.useMemo(
    () => ({ scrollToMessage, scrollToEnd, scrollToStart }),
    [scrollToMessage, scrollToEnd, scrollToStart]
  );
}

export function useMessageScrollerScrollable() {
  return useMessageScrollerContext().scrollable;
}

export function useMessageScrollerVisibility() {
  return useMessageScrollerContext().visibility;
}

function composeRefs<T>(...refs: (React.Ref<T> | undefined | null)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

function mergeElementProps(
  ours: Record<string, any>,
  theirs: Record<string, any>,
  forwardedRef: React.Ref<any>
) {
  const theirsRef = (theirs as any)?.ref ?? (theirs as any)?.props?.ref;
  const merged: Record<string, any> = { ...theirs, ...ours };

  const allKeys = new Set([...Object.keys(ours), ...Object.keys(theirs)]);
  for (const key of allKeys) {
    if (/^on[A-Z]/.test(key)) {
      const ourHandler = ours[key];
      const theirHandler = theirs[key];
      if (typeof ourHandler === "function" && typeof theirHandler === "function") {
        merged[key] = (event: any) => {
          theirHandler(event);
          if (!event?.defaultPrevented) {
            ourHandler(event);
          }
        };
      } else {
        merged[key] = ourHandler ?? theirHandler;
      }
    }
  }

  merged.className = cn(ours.className, theirs.className);

  if (ours.style || theirs.style) {
    merged.style = { ...theirs.style, ...ours.style };
  }

  if (ours.type !== undefined || theirs.type !== undefined) {
    merged.type = ours.type ?? theirs.type;
  }

  merged.ref = composeRefs(forwardedRef, theirsRef);
  merged.children = ours.children ?? theirs.children;

  return merged;
}

/* ==========================================================================
   MessageScrollerProvider
   Owns context only and renders no DOM. Independent providers never share state.
   Tracks reader-follow state, cancels RAF/timers on unmount.
   ========================================================================== */

export interface MessageScrollerProviderProps {
  autoScroll?: boolean;
  defaultScrollPosition?: ScrollPosition;
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  scrollPreviousItemPeek?: number;
  children?: React.ReactNode;
}

export function MessageScrollerProvider({
  autoScroll = false,
  defaultScrollPosition = "end",
  scrollEdgeThreshold = 8,
  scrollMargin = 0,
  scrollPreviousItemPeek = 64,
  children,
}: MessageScrollerProviderProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const itemsMapRef = React.useRef<Map<string, ItemEntry>>(new Map());
  const initialPositionAppliedRef = React.useRef(false);
  const isFollowingEdgeRef = React.useRef(true);
  const [isFollowingEdge, setIsFollowingEdge] = React.useState(true);
  const isProgrammaticScrollRef = React.useRef(false);

  const timersRef = React.useRef<Set<any>>(new Set());
  const rafsRef = React.useRef<Set<number>>(new Set());

  const safeTimeout = React.useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);

  const safeRAF = React.useCallback((fn: () => void) => {
    const id = window.requestAnimationFrame(() => {
      rafsRef.current.delete(id);
      fn();
    });
    rafsRef.current.add(id);
    return id;
  }, []);

  React.useEffect(() => {
    return () => {
      for (const t of timersRef.current) clearTimeout(t);
      for (const r of rafsRef.current) cancelAnimationFrame(r);
      timersRef.current.clear();
      rafsRef.current.clear();
    };
  }, []);

  const pauseFollowing = React.useCallback(() => {
    isFollowingEdgeRef.current = false;
    setIsFollowingEdge(false);
  }, []);

  const resumeFollowing = React.useCallback(() => {
    isFollowingEdgeRef.current = true;
    setIsFollowingEdge(true);
  }, []);

  const [scrollable, setScrollable] = React.useState<{ start: boolean; end: boolean }>({
    start: false,
    end: false,
  });

  const [visibility, setVisibility] = React.useState<{
    currentAnchorId: string | null;
    visibleMessageIds: string[];
  }>({
    currentAnchorId: null,
    visibleMessageIds: [],
  });

  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  const [pendingScroll, setPendingScroll] = React.useState(false);
  const [preserveScrollOnPrepend, setPreserveScrollOnPrepend] = React.useState(true);

  // Update scroll metrics and visible IDs strictly in document DOM order
  const updateScrollMetrics = React.useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const scrollTop = vp.scrollTop;
    const clientHeight = vp.clientHeight;
    const scrollHeight = vp.scrollHeight;

    const distFromBottom = Math.max(0, scrollHeight - (scrollTop + clientHeight));
    const canScrollStart = scrollTop > 1;
    const canScrollEnd = distFromBottom > 1;

    setScrollable((prev) => {
      if (prev.start === canScrollStart && prev.end === canScrollEnd) return prev;
      return { start: canScrollStart, end: canScrollEnd };
    });

    if (distFromBottom <= scrollEdgeThreshold) {
      isFollowingEdgeRef.current = true;
      setIsFollowingEdge(true);
    } else if (!isProgrammaticScrollRef.current && isFollowingEdgeRef.current) {
      // If user scrolled away from edge manually
      isFollowingEdgeRef.current = false;
      setIsFollowingEdge(false);
    }

    // Calculate visibility strictly in DOM order
    const vpRect = vp.getBoundingClientRect();
    const visibleIds: string[] = [];
    let currentAnchor: string | null = null;

    const domItems = Array.from(vp.querySelectorAll<HTMLElement>("[data-message-id]"));
    for (const el of domItems) {
      const id = el.getAttribute("data-message-id");
      if (!id) continue;
      const isAnchor = el.getAttribute("data-scroll-anchor") === "true";
      const elRect = el.getBoundingClientRect();
      const isVisible = elRect.bottom > vpRect.top && elRect.top < vpRect.bottom;
      if (isVisible) {
        visibleIds.push(id);
        if (isAnchor) {
          currentAnchor = id;
        }
      }
    }

    setVisibility((prev) => {
      if (
        prev.currentAnchorId === currentAnchor &&
        prev.visibleMessageIds.length === visibleIds.length &&
        prev.visibleMessageIds.every((id, idx) => id === visibleIds[idx])
      ) {
        return prev;
      }
      return {
        currentAnchorId: currentAnchor ?? (visibleIds[visibleIds.length - 1] ?? null),
        visibleMessageIds: visibleIds,
      };
    });
  }, [scrollEdgeThreshold]);

  // Initial scroll position applied once to first non-empty transcript
  const applyInitialScroll = React.useCallback(() => {
    if (initialPositionAppliedRef.current) return;
    const vp = viewportRef.current;
    if (!vp || itemsMapRef.current.size === 0) return;

    if (defaultScrollPosition === "start") {
      vp.scrollTop = 0;
    } else if (defaultScrollPosition === "last-anchor") {
      const anchorEls = Array.from(vp.querySelectorAll<HTMLElement>('[data-scroll-anchor="true"]'));
      const lastAnchor = anchorEls[anchorEls.length - 1];
      if (lastAnchor) {
        const offset = Math.max(0, lastAnchor.offsetTop - scrollPreviousItemPeek);
        vp.scrollTop = offset;
      } else {
        vp.scrollTop = vp.scrollHeight - vp.clientHeight;
      }
    } else {
      vp.scrollTop = vp.scrollHeight - vp.clientHeight;
    }

    initialPositionAppliedRef.current = true;
    updateScrollMetrics();
  }, [defaultScrollPosition, scrollPreviousItemPeek, updateScrollMetrics]);

  const registerItem = React.useCallback(
    (id: string, element: HTMLElement, scrollAnchor: boolean) => {
      const isNew = !itemsMapRef.current.has(id);
      itemsMapRef.current.set(id, { messageId: id, element, scrollAnchor });

      if (!initialPositionAppliedRef.current) {
        safeRAF(() => {
          applyInitialScroll();
        });
      } else if (isNew && autoScroll && isFollowingEdgeRef.current) {
        // Auto-follow edge only when autoScroll is enabled AND reader is following edge
        safeRAF(() => {
          const vp = viewportRef.current;
          if (!vp) return;
          setIsAutoScrolling(true);
          isProgrammaticScrollRef.current = true;
          if (scrollAnchor) {
            const targetTop = Math.max(0, element.offsetTop - scrollPreviousItemPeek);
            vp.scrollTo({ top: targetTop, behavior: "smooth" });
          } else {
            vp.scrollTo({ top: vp.scrollHeight - vp.clientHeight, behavior: "smooth" });
          }
          safeTimeout(() => {
            setIsAutoScrolling(false);
            isProgrammaticScrollRef.current = false;
            updateScrollMetrics();
          }, 300);
        });
      }

      updateScrollMetrics();
    },
    [autoScroll, scrollPreviousItemPeek, applyInitialScroll, updateScrollMetrics, safeRAF, safeTimeout]
  );

  const unregisterItem = React.useCallback((id: string) => {
    itemsMapRef.current.delete(id);
    updateScrollMetrics();
  }, [updateScrollMetrics]);

  const scrollToMessage = React.useCallback(
    (id: string, options?: ScrollToMessageOptions): boolean => {
      const entry = itemsMapRef.current.get(id);
      const vp = viewportRef.current;
      if (!entry || !vp) {
        return false;
      }

      pauseFollowing();
      const align = options?.align ?? "nearest";
      const margin = options?.scrollMargin ?? scrollMargin;
      const behavior = options?.behavior ?? "smooth";

      setPendingScroll(true);
      setIsAutoScrolling(true);
      isProgrammaticScrollRef.current = true;

      const vpRect = vp.getBoundingClientRect();
      const elRect = entry.element.getBoundingClientRect();

      let targetScrollTop = vp.scrollTop;

      if (align === "start") {
        targetScrollTop = vp.scrollTop + (elRect.top - vpRect.top) - margin;
      } else if (align === "end") {
        targetScrollTop = vp.scrollTop + (elRect.bottom - vpRect.bottom) + margin;
      } else if (align === "center") {
        targetScrollTop =
          vp.scrollTop +
          (elRect.top - vpRect.top) -
          (vp.clientHeight - elRect.height) / 2;
      } else {
        // nearest
        if (elRect.top < vpRect.top) {
          targetScrollTop = vp.scrollTop + (elRect.top - vpRect.top) - margin;
        } else if (elRect.bottom > vpRect.bottom) {
          targetScrollTop = vp.scrollTop + (elRect.bottom - vpRect.bottom) + margin;
        }
      }

      vp.scrollTo({ top: Math.max(0, targetScrollTop), behavior });

      safeTimeout(() => {
        setPendingScroll(false);
        setIsAutoScrolling(false);
        isProgrammaticScrollRef.current = false;
        updateScrollMetrics();
      }, 350);

      return true;
    },
    [pauseFollowing, scrollMargin, safeTimeout, updateScrollMetrics]
  );

  const scrollToEnd = React.useCallback(
    (options?: { behavior?: ScrollBehavior }): boolean => {
      const vp = viewportRef.current;
      if (!vp) return false;

      resumeFollowing();
      setPendingScroll(true);
      setIsAutoScrolling(true);
      isProgrammaticScrollRef.current = true;

      vp.scrollTo({
        top: vp.scrollHeight - vp.clientHeight,
        behavior: options?.behavior ?? "smooth",
      });

      safeTimeout(() => {
        setPendingScroll(false);
        setIsAutoScrolling(false);
        isProgrammaticScrollRef.current = false;
        updateScrollMetrics();
      }, 350);

      return true;
    },
    [resumeFollowing, safeTimeout, updateScrollMetrics]
  );

  const scrollToStart = React.useCallback(
    (options?: { behavior?: ScrollBehavior }): boolean => {
      const vp = viewportRef.current;
      if (!vp) return false;

      pauseFollowing();
      setPendingScroll(true);
      setIsAutoScrolling(true);
      isProgrammaticScrollRef.current = true;

      vp.scrollTo({
        top: 0,
        behavior: options?.behavior ?? "smooth",
      });

      safeTimeout(() => {
        setPendingScroll(false);
        setIsAutoScrolling(false);
        isProgrammaticScrollRef.current = false;
        updateScrollMetrics();
      }, 350);

      return true;
    },
    [pauseFollowing, safeTimeout, updateScrollMetrics]
  );

  const contextValue = React.useMemo<MessageScrollerContextValue>(
    () => ({
      viewportRef,
      contentRef,
      registerItem,
      unregisterItem,
      scrollToMessage,
      scrollToEnd,
      scrollToStart,
      scrollable,
      visibility,
      isAutoScrolling,
      pendingScroll,
      preserveScrollOnPrepend,
      setPreserveScrollOnPrepend,
      updateScrollMetrics,
      isFollowingEdge,
      pauseFollowing,
      resumeFollowing,
      autoScroll,
    }),
    [
      registerItem,
      unregisterItem,
      scrollToMessage,
      scrollToEnd,
      scrollToStart,
      scrollable,
      visibility,
      isAutoScrolling,
      pendingScroll,
      preserveScrollOnPrepend,
      setPreserveScrollOnPrepend,
      updateScrollMetrics,
      isFollowingEdge,
      pauseFollowing,
      resumeFollowing,
      autoScroll,
    ]
  );

  return (
    <MessageScrollerContext.Provider value={contextValue}>
      {children}
    </MessageScrollerContext.Provider>
  );
}

/* ==========================================================================
   MessageScroller (Root)
   ========================================================================== */

export interface MessageScrollerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const MessageScroller = React.forwardRef<
  HTMLDivElement,
  MessageScrollerProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const { scrollable, isAutoScrolling, pendingScroll } = useMessageScrollerContext();
  const Component = asChild ? Slot : "div";

  const isScrollable = scrollable.start || scrollable.end;

  return (
    <Component
      ref={ref}
      data-scrollable={isScrollable ? "true" : "false"}
      data-autoscrolling={isAutoScrolling ? "true" : "false"}
      data-pending-scroll={pendingScroll ? "true" : "false"}
      className={cn("cfui-message-scroller", className)}
      {...props}
    >
      {children}
    </Component>
  );
});
MessageScroller.displayName = "MessageScroller";

/* ==========================================================================
   MessageScrollerViewport
   role region, aria-label Messages, tabIndex=0, preserveScrollOnPrepend
   Composes caller onScroll and tracks prepend DOM anchors accurately.
   ========================================================================== */

export interface MessageScrollerViewportProps
  extends React.HTMLAttributes<HTMLDivElement> {
  preserveScrollOnPrepend?: boolean;
  asChild?: boolean;
}

export const MessageScrollerViewport = React.forwardRef<
  HTMLDivElement,
  MessageScrollerViewportProps
>(
  (
    {
      preserveScrollOnPrepend = true,
      role = "region",
      "aria-label": ariaLabel = "Messages",
      tabIndex = 0,
      asChild = false,
      className,
      children,
      onScroll: callerOnScroll,
      ...props
    },
    forwardedRef
  ) => {
    const {
      viewportRef,
      scrollable,
      isAutoScrolling,
      pendingScroll,
      setPreserveScrollOnPrepend,
      updateScrollMetrics,
      pauseFollowing,
      isFollowingEdge,
      autoScroll,
    } = useMessageScrollerContext();

    const Component = asChild ? Slot : "div";

    React.useEffect(() => {
      setPreserveScrollOnPrepend(preserveScrollOnPrepend);
    }, [preserveScrollOnPrepend, setPreserveScrollOnPrepend]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      updateScrollMetrics();
      callerOnScroll?.(e);
    };

    // User interaction listeners to pause forced auto-scroll when reading away from edge
    React.useEffect(() => {
      const vp = viewportRef.current;
      if (!vp) return;

      const handleUserInteraction = () => {
        const distFromBottom = Math.max(0, vp.scrollHeight - (vp.scrollTop + vp.clientHeight));
        if (distFromBottom > 8) {
          pauseFollowing();
        }
      };

      vp.addEventListener("wheel", handleUserInteraction, { passive: true });
      vp.addEventListener("touchstart", handleUserInteraction, { passive: true });
      vp.addEventListener("keydown", handleUserInteraction);
      vp.addEventListener("selectstart", handleUserInteraction);

      return () => {
        vp.removeEventListener("wheel", handleUserInteraction);
        vp.removeEventListener("touchstart", handleUserInteraction);
        vp.removeEventListener("keydown", handleUserInteraction);
        vp.removeEventListener("selectstart", handleUserInteraction);
      };
    }, [viewportRef, pauseFollowing]);

    // Accurate anchor tracking for prepending and resize/streaming observation
    React.useEffect(() => {
      const vp = viewportRef.current;
      if (!vp) return;

      let currentAnchor: { el: HTMLElement; topOffset: number } | null = null;

      const updateAnchor = () => {
        const items = vp.querySelectorAll<HTMLElement>("[data-message-id]");
        const vpRect = vp.getBoundingClientRect();
        currentAnchor = null;
        for (const el of Array.from(items)) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > vpRect.top + 1) {
            currentAnchor = { el, topOffset: rect.top - vpRect.top };
            break;
          }
        }
      };

      updateAnchor();

      const handleMutations = () => {
        if (preserveScrollOnPrepend && currentAnchor && document.contains(currentAnchor.el)) {
          const vpRect = vp.getBoundingClientRect();
          const rect = currentAnchor.el.getBoundingClientRect();
          const newTopOffset = rect.top - vpRect.top;
          const delta = newTopOffset - currentAnchor.topOffset;
          // Only adjust scrollTop if items were genuinely inserted above the anchor
          if (delta > 0 && vp.scrollTop > 0) {
            vp.scrollTop += delta;
          }
        }
        updateAnchor();
        updateScrollMetrics();
      };

      const mutationObserver = new MutationObserver(handleMutations);
      mutationObserver.observe(vp, { childList: true, subtree: true });

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          if (autoScroll && isFollowingEdge) {
            vp.scrollTop = vp.scrollHeight - vp.clientHeight;
          } else if (preserveScrollOnPrepend && currentAnchor && document.contains(currentAnchor.el)) {
            const vpRect = vp.getBoundingClientRect();
            const rect = currentAnchor.el.getBoundingClientRect();
            const newTopOffset = rect.top - vpRect.top;
            const delta = newTopOffset - currentAnchor.topOffset;
            if (delta > 0 && vp.scrollTop > 0) {
              vp.scrollTop += delta;
            }
          }
          updateAnchor();
          updateScrollMetrics();
        });

        const content = vp.querySelector(".cfui-message-scroller-content") || vp;
        resizeObserver.observe(content);
      }

      return () => {
        mutationObserver.disconnect();
        resizeObserver?.disconnect();
      };
    }, [viewportRef, preserveScrollOnPrepend, autoScroll, isFollowingEdge, updateScrollMetrics]);

    // Merge refs
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        (viewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [viewportRef, forwardedRef]
    );

    const isScrollable = scrollable.start || scrollable.end;

    return (
      <Component
        ref={setRefs}
        role={role}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        data-scrollable={isScrollable ? "true" : "false"}
        data-autoscrolling={isAutoScrolling ? "true" : "false"}
        data-pending-scroll={pendingScroll ? "true" : "false"}
        className={cn("cfui-message-scroller-viewport", className)}
        {...props}
        onScroll={handleScroll}
      >
        {children}
      </Component>
    );
  }
);
MessageScrollerViewport.displayName = "MessageScrollerViewport";

/* ==========================================================================
   MessageScrollerContent
   role log, aria-relevant additions, accepts aria-busy, spacerClassName
   ========================================================================== */

export interface MessageScrollerContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  spacerClassName?: string;
  asChild?: boolean;
}

export const MessageScrollerContent = React.forwardRef<
  HTMLDivElement,
  MessageScrollerContentProps
>(
  (
    {
      role = "log",
      "aria-relevant": ariaRelevant = "additions",
      "aria-busy": ariaBusy,
      spacerClassName,
      asChild = false,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const { contentRef } = useMessageScrollerContext();
    const Component = asChild ? Slot : "div";

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [contentRef, forwardedRef]
    );

    return (
      <Component
        ref={setRefs}
        role={role}
        aria-relevant={ariaRelevant}
        aria-busy={ariaBusy}
        className={cn("cfui-message-scroller-content", className)}
        {...props}
      >
        {children}
        {spacerClassName && (
          <div aria-hidden="true" className={cn("cfui-message-scroller-spacer", spacerClassName)} />
        )}
      </Component>
    );
  }
);
MessageScrollerContent.displayName = "MessageScrollerContent";

/* ==========================================================================
   MessageScrollerItem
   Registers item, data-message-id, data-scroll-anchor
   ========================================================================== */

export interface MessageScrollerItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  messageId: string;
  scrollAnchor?: boolean;
  asChild?: boolean;
}

export const MessageScrollerItem = React.forwardRef<
  HTMLDivElement,
  MessageScrollerItemProps
>(
  (
    {
      messageId,
      scrollAnchor = false,
      asChild = false,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const { registerItem, unregisterItem } = useMessageScrollerContext();
    const itemRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        itemRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    React.useEffect(() => {
      const el = itemRef.current;
      if (el) {
        registerItem(messageId, el, scrollAnchor);
      }
      return () => unregisterItem(messageId);
    }, [messageId, scrollAnchor, registerItem, unregisterItem]);

    const Component = asChild ? Slot : "div";

    return (
      <Component
        ref={setRefs}
        data-message-id={messageId}
        data-scroll-anchor={scrollAnchor ? "true" : "false"}
        className={cn("cfui-message-scroller-item", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MessageScrollerItem.displayName = "MessageScrollerItem";

/* ==========================================================================
   MessageScrollerButton
   direction start|end, smooth default; inert and data-active=false when no destination.
   Supports custom children, asChild, and render adapter.
   ========================================================================== */

export interface MessageScrollerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "start" | "end";
  behavior?: ScrollBehavior;
  asChild?: boolean;
  render?:
    | React.ReactElement<any>
    | ((
        props: React.ButtonHTMLAttributes<HTMLButtonElement>,
        state: { isAvailable: boolean; direction: "start" | "end" }
      ) => React.ReactNode);
}

export const MessageScrollerButton = React.forwardRef<
  HTMLButtonElement,
  MessageScrollerButtonProps
>(
  (
    {
      direction,
      behavior = "smooth",
      asChild = false,
      render,
      className,
      children,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    const { scrollable, scrollToEnd, scrollToStart } = useMessageScrollerContext();

    const isAvailable = direction === "end" ? scrollable.end : scrollable.start;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isAvailable) return;
      if (direction === "end") {
        scrollToEnd({ behavior });
      } else {
        scrollToStart({ behavior });
      }
      onClick?.(e);
    };

    const mergedProps = {
      ref,
      type: asChild ? undefined : type,
      "data-direction": direction,
      "data-active": isAvailable ? "true" : "false",
      "aria-disabled": !isAvailable ? true : undefined,
      tabIndex: isAvailable ? (props.tabIndex ?? 0) : -1,
      inert: !isAvailable ? (true as any) : undefined,
      onClick: handleClick,
      className: cn(
        "cfui-message-scroller-button",
        `cfui-message-scroller-button--${direction}`,
        !isAvailable && "cfui-message-scroller-button--inert",
        className
      ),
      ...props,
    };

    if (asChild) {
      return <Slot {...(mergedProps as any)}>{children}</Slot>;
    }

    if (typeof render === "function") {
      return render(mergedProps as any, { isAvailable, direction });
    }

    if (React.isValidElement(render)) {
      const renderProps = (render.props || {}) as Record<string, any>;
      const merged = mergeElementProps(mergedProps, renderProps, ref);
      return React.cloneElement(render as React.ReactElement<any>, merged);
    }

    const Component = "button";

    return (
      <Component {...(mergedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children ?? (direction === "end" ? "Scroll to latest" : "Scroll to top")}
      </Component>
    );
  }
);
MessageScrollerButton.displayName = "MessageScrollerButton";
