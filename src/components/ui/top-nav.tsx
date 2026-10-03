import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./top-nav.css";

export interface TopNavItemData {
  id?: string;
  label: React.ReactNode;
  href?: string;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  external?: boolean;
}

export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  items?: TopNavItemData[];
  actions?: React.ReactNode;
  activeId?: string;
  onItemSelect?: (item: TopNavItemData, event: React.MouseEvent<HTMLElement>) => void;
  asChild?: boolean;
}

interface TopNavContextValue {
  activeId?: string;
  onItemSelect?: (item: TopNavItemData, event: React.MouseEvent<HTMLElement>) => void;
}

const TopNavContext = React.createContext<TopNavContextValue | null>(null);

export function useTopNavContext() {
  return React.useContext(TopNavContext);
}

export const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  (
    {
      className,
      brand,
      items,
      actions,
      activeId,
      onItemSelect,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "header";

    return (
      <TopNavContext.Provider value={{ activeId, onItemSelect }}>
        <Comp
          ref={ref}
          className={cn("cfui-top-nav", className)}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              <div className="flex items-center gap-4 overflow-hidden">
                {brand && <TopNavBrand>{brand}</TopNavBrand>}
                {items && (
                  <TopNavList>
                    {items.map((item, idx) => {
                      const isActive = Boolean(
                        item.active ?? (item.id ? activeId === item.id : false)
                      );
                      return (
                        <TopNavItem
                          key={item.id ?? idx}
                          href={item.href}
                          active={isActive}
                          disabled={item.disabled}
                          onClick={(e) => {
                            item.onClick?.(e);
                            if (!e.defaultPrevented) {
                              onItemSelect?.(item, e);
                            }
                          }}
                        >
                          {item.label}
                        </TopNavItem>
                      );
                    })}
                  </TopNavList>
                )}
              </div>
              {actions && <TopNavActions>{actions}</TopNavActions>}
            </>
          )}
        </Comp>
      </TopNavContext.Provider>
    );
  }
);
TopNav.displayName = "TopNav";

export interface TopNavBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const TopNavBrand = React.forwardRef<HTMLDivElement, TopNavBrandProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-top-nav-brand", className)}
        {...props}
      />
    );
  }
);
TopNavBrand.displayName = "TopNavBrand";

export const TopNavMasthead = TopNavBrand;

export interface TopNavListProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const TopNavList = React.forwardRef<HTMLElement, TopNavListProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "nav";
    return (
      <Comp
        ref={ref}
        aria-label="Main Navigation"
        className={cn("cfui-top-nav-list", className)}
        {...props}
      />
    );
  }
);
TopNavList.displayName = "TopNavList";

export interface TopNavItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> {
  active?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const TopNavItem = React.forwardRef<HTMLElement, TopNavItemProps>(
  (
    {
      className,
      active = false,
      disabled = false,
      href,
      onClick,
      asChild = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const itemClassName = cn(
      "cfui-top-nav-item",
      active && "cfui-top-nav-item--active",
      disabled && "cfui-top-nav-item--disabled",
      className
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-current={active ? "page" : undefined}
          aria-disabled={disabled || undefined}
          onClick={
            disabled
              ? (e: React.MouseEvent<HTMLElement>) => e.preventDefault()
              : onClick
          }
          className={itemClassName}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : href}
          aria-current={active ? "page" : undefined}
          aria-disabled={disabled || undefined}
          onClick={
            disabled
              ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()
              : (onClick as React.MouseEventHandler<HTMLAnchorElement>)
          }
          className={itemClassName}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        onClick={
          disabled
            ? (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()
            : (onClick as React.MouseEventHandler<HTMLButtonElement>)
        }
        className={itemClassName}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);
TopNavItem.displayName = "TopNavItem";

export interface TopNavActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const TopNavActions = React.forwardRef<HTMLDivElement, TopNavActionsProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-top-nav-actions", className)}
        {...props}
      />
    );
  }
);
TopNavActions.displayName = "TopNavActions";

export const TopNavEnd = TopNavActions;
