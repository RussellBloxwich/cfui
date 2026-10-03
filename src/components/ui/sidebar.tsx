import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./sidebar.css";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextType = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((value: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((value: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  setTriggerRef: (
    node: HTMLButtonElement | null,
    unmountedNode?: HTMLButtonElement | null
  ) => void;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const triggersRef = React.useRef<Set<HTMLButtonElement>>(new Set());
    const [isMobile, setIsMobile] = React.useState(false);
    const [openMobile, setOpenMobile] = React.useState(false);

    const setTriggerRef = React.useCallback(
      (
        node: HTMLButtonElement | null,
        unmountedNode?: HTMLButtonElement | null
      ) => {
        if (node) {
          triggersRef.current.add(node);
          triggerRef.current = node;
          return;
        }

        if (unmountedNode) {
          triggersRef.current.delete(unmountedNode);
          if (triggerRef.current === unmountedNode) {
            triggerRef.current = null;
          }
        }

        // Clean up disconnected triggers from tracking
        for (const trigger of Array.from(triggersRef.current)) {
          if (!trigger || trigger === unmountedNode || !trigger.isConnected) {
            triggersRef.current.delete(trigger);
          }
        }

        // Validate current trigger ref; clear if unmounted or disconnected
        if (
          triggerRef.current &&
          (triggerRef.current === unmountedNode ||
            !triggerRef.current.isConnected)
        ) {
          triggersRef.current.delete(triggerRef.current);
          triggerRef.current = null;
        }

        // If explicitly called setTriggerRef(null) without a specified unmountedNode and only 1 or 0 triggers exist
        if (!unmountedNode && triggersRef.current.size <= 1) {
          triggersRef.current.clear();
          triggerRef.current = null;
          return;
        }

        // If triggerRef.current is cleared or null, find another still-valid trigger
        if (!triggerRef.current) {
          let nextTrigger: HTMLButtonElement | null = null;
          for (const trigger of triggersRef.current) {
            if (trigger && trigger.isConnected) {
              nextTrigger = trigger;
              break;
            }
          }

          // Check inside this provider's wrapper only, avoiding other providers
          if (!nextTrigger && wrapperRef.current) {
            const candidates =
              wrapperRef.current.querySelectorAll<HTMLButtonElement>(
                '[data-sidebar="trigger"]'
              );
            for (let i = 0; i < candidates.length; i++) {
              const el = candidates[i];
              if (el && el.isConnected && el !== unmountedNode) {
                nextTrigger = el;
                triggersRef.current.add(el);
                break;
              }
            }
          }

          triggerRef.current = nextTrigger;
        }
      },
      []
    );

    React.useEffect(() => {
      if (typeof window === "undefined") return;
      const mql = window.matchMedia("(max-width: 768px)");
      const onChange = () => {
        setIsMobile(mql.matches);
      };
      mql.addEventListener("change", onChange);
      setIsMobile(mql.matches);
      return () => mql.removeEventListener("change", onChange);
    }, []);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (!isControlled) {
          _setOpen(openState);
        }
        setOpenProp?.(openState);
        try {
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        } catch {
          // ignore cookie errors in test/restricted environments
        }
      },
      [isControlled, setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
      if (
        typeof document !== "undefined" &&
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
      ) {
        const active = document.activeElement;
        if (
          !wrapperRef.current ||
          wrapperRef.current.contains(active) ||
          active.closest?.(".cfui-sidebar-wrapper") === wrapperRef.current
        ) {
          triggerRef.current = active as HTMLButtonElement;
          triggersRef.current.add(active as HTMLButtonElement);
        }
      }
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          const target = event.target as HTMLElement | null;
          const isEditor =
            target &&
            (target.isContentEditable ||
              target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.tagName === "SELECT");

          if (event.defaultPrevented || isEditor) {
            return;
          }

          if ((event as any).__cfui_sidebar_handled__) {
            return;
          }

          const currentWrapper = wrapperRef.current;
          const focusedWrapper = (
            document.activeElement as HTMLElement | null
          )?.closest?.(".cfui-sidebar-wrapper");

          if (focusedWrapper && focusedWrapper !== currentWrapper) {
            return;
          }

          (event as any).__cfui_sidebar_handled__ = true;
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextType>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        triggerRef,
        setTriggerRef,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, setTriggerRef]
    );

    const handleRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipPrimitive.Provider delayDuration={0}>
          <div
            style={
              {
                "--cfui-sidebar-width": SIDEBAR_WIDTH,
                "--cfui-sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn("cfui-sidebar-wrapper", className)}
            ref={handleRef}
            {...props}
          >
            {children}
          </div>
        </TooltipPrimitive.Provider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
    onCloseAutoFocus?: (event: Event) => void;
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      style,
      onCloseAutoFocus,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile, triggerRef } = useSidebar();

    if (collapsible === "none") {
      return (
        <aside
          ref={ref}
          data-state="expanded"
          data-collapsible="none"
          data-variant={variant}
          data-side={side}
          className={cn("cfui-sidebar", className)}
          style={style}
          {...props}
        >
          <div className="cfui-sidebar-inner">{children}</div>
        </aside>
      );
    }

    if (isMobile) {
      return (
        <DialogPrimitive.Root open={openMobile} onOpenChange={setOpenMobile}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="cfui-sidebar-mobile-overlay" />
            <DialogPrimitive.Content
              ref={ref}
              data-sidebar="sidebar"
              data-mobile="true"
              data-side={side}
              className={cn("cfui-sidebar-mobile", className)}
              style={
                {
                  "--cfui-sidebar-width": SIDEBAR_WIDTH_MOBILE,
                  ...style,
                } as React.CSSProperties
              }
              onCloseAutoFocus={(event) => {
                onCloseAutoFocus?.(event);
                if (!event.defaultPrevented) {
                  const trigger = triggerRef.current;
                  if (
                    trigger &&
                    typeof trigger.focus === "function" &&
                    (trigger.isConnected ?? true)
                  ) {
                    event.preventDefault();
                    trigger.focus();
                  }
                }
              }}
              {...props}
            >
              <DialogPrimitive.Title className="cfui-sr-only">
                Sidebar
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="cfui-sr-only">
                Sidebar navigation
              </DialogPrimitive.Description>
              <div className="cfui-sidebar-inner">{children}</div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      );
    }

    return (
      <aside
        ref={ref}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        className={cn("cfui-sidebar", className)}
        style={style}
        {...props}
      >
        <div className="cfui-sidebar-inner">{children}</div>
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(
  (
    {
      className,
      onClick,
      "aria-expanded": ariaExpandedProp,
      ...props
    },
    ref
  ) => {
    const { isMobile, openMobile, open, toggleSidebar, setTriggerRef } =
      useSidebar();

    const nodeRef = React.useRef<HTMLButtonElement | null>(null);

    const handleRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        if (node) {
          nodeRef.current = node;
          setTriggerRef(node);
        } else {
          const oldNode = nodeRef.current;
          nodeRef.current = null;
          setTriggerRef(null, oldNode);
        }
        if (typeof ref === "function") {
          ref(node);
        } else if (ref && typeof ref === "object") {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
        }
      },
      [ref, setTriggerRef]
    );

    React.useEffect(() => {
      return () => {
        if (nodeRef.current) {
          setTriggerRef(null, nodeRef.current);
          nodeRef.current = null;
        }
      };
    }, [setTriggerRef]);

    const ariaExpanded =
      ariaExpandedProp !== undefined
        ? ariaExpandedProp
        : isMobile
        ? openMobile
        : open;

    return (
      <button
        ref={handleRef}
        type="button"
        data-sidebar="trigger"
        aria-label="Toggle Sidebar"
        aria-expanded={ariaExpanded}
        className={cn("cfui-sidebar-trigger", className)}
        onClick={(event) => {
          setTriggerRef(event.currentTarget);
          onClick?.(event);
          if (!event.defaultPrevented) {
            toggleSidebar();
          }
        }}
        {...props}
      >
        <SidebarSimpleIcon size={18} weight="bold" />
        <span className="cfui-sr-only">Toggle Sidebar</span>
      </button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      title="Toggle Sidebar"
      className={cn("cfui-sidebar-rail", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn("cfui-sidebar-inset", className)}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      data-sidebar="input"
      className={cn("cfui-sidebar-input", className)}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("cfui-sidebar-header", className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("cfui-sidebar-footer", className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="separator"
      className={cn("cfui-sidebar-separator", className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn("cfui-sidebar-content", className)}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("cfui-sidebar-group", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn("cfui-sidebar-group-label", className)}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, type = "button", ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      data-sidebar="group-action"
      className={cn("cfui-sidebar-group-action", className)}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("cfui-sidebar-group-content", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("cfui-sidebar-menu", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("cfui-sidebar-menu-item", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipPrimitive.Content>;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
};

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        data-variant={variant}
        className={cn(
          "cfui-sidebar-menu-button",
          isActive && "cfui-sidebar-menu-button--active",
          variant === "outline" && "cfui-sidebar-menu-button--outline",
          size === "sm" && "cfui-sidebar-menu-button--sm",
          size === "lg" && "cfui-sidebar-menu-button--lg",
          className
        )}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{button}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </TooltipPrimitive.Root>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(
  (
    {
      className,
      asChild = false,
      showOnHover = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        data-sidebar="menu-action"
        data-show-on-hover={showOnHover}
        className={cn(
          "cfui-sidebar-menu-action",
          showOnHover && "cfui-sidebar-menu-action--show-on-hover",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-sidebar="menu-badge"
    className={cn("cfui-sidebar-menu-badge", className)}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("cfui-sidebar-menu-skeleton", className)}
      {...props}
    />
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn("cfui-sidebar-menu-sub", className)}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "cfui-sidebar-menu-sub-button",
        isActive && "cfui-sidebar-menu-sub-button--active",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
