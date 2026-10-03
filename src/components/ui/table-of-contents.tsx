import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
import "./table-of-contents.css";

export interface TocItem {
  id: string;
  title: string;
  level?: number;
  href?: string;
  children?: TocItem[];
}

export interface TableOfContentsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  items?: TocItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  onItemClick?: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: React.ReactNode;
  asChild?: boolean;
}

interface TocContextValue {
  activeId?: string;
  setActiveId: (id: string) => void;
  onItemClick?: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const TocContext = React.createContext<TocContextValue | null>(null);

export function useTocContext() {
  const context = React.useContext(TocContext);
  if (!context) {
    throw new Error(
      "TableOfContents compound subcomponents must be used within TableOfContents"
    );
  }
  return context;
}

export const TableOfContents = React.forwardRef<
  HTMLElement,
  TableOfContentsProps
>(
  (
    {
      className,
      items,
      activeId: controlledActiveId,
      defaultActiveId,
      onActiveIdChange,
      onItemClick,
      title = "On this page",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState<
      string | undefined
    >(defaultActiveId);

    const activeId =
      controlledActiveId !== undefined ? controlledActiveId : uncontrolledActiveId;

    const setActiveId = React.useCallback(
      (id: string) => {
        if (controlledActiveId === undefined) {
          setUncontrolledActiveId(id);
        }
        onActiveIdChange?.(id);
      },
      [controlledActiveId, onActiveIdChange]
    );

    const Comp = asChild ? Slot : "nav";

    const renderItems = (itemList: TocItem[]) => {
      return (
        <TableOfContentsList>
          {itemList.map((item) => (
            <TableOfContentsItem key={item.id} level={item.level ?? 1}>
              <TableOfContentsLink
                id={item.id}
                href={item.href ?? `#${item.id}`}
                level={item.level ?? 1}
              >
                {item.title}
              </TableOfContentsLink>
              {item.children && item.children.length > 0 && renderItems(item.children)}
            </TableOfContentsItem>
          ))}
        </TableOfContentsList>
      );
    };

    return (
      <TocContext.Provider value={{ activeId, setActiveId, onItemClick }}>
        <Comp
          ref={ref}
          aria-label="Table of contents"
          className={cn("cfui-toc", className)}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              {title && <TableOfContentsTitle>{title}</TableOfContentsTitle>}
              {items && items.length > 0 && renderItems(items)}
            </>
          )}
        </Comp>
      </TocContext.Provider>
    );
  }
);
TableOfContents.displayName = "TableOfContents";

export interface TableOfContentsTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export const TableOfContentsTitle = React.forwardRef<
  HTMLHeadingElement,
  TableOfContentsTitleProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "h4";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-toc-title", className)}
      {...props}
    />
  );
});
TableOfContentsTitle.displayName = "TableOfContentsTitle";

export const TableOfContentsHeader = TableOfContentsTitle;

export interface TableOfContentsListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  asChild?: boolean;
}

export const TableOfContentsList = React.forwardRef<
  HTMLUListElement,
  TableOfContentsListProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "ul";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-toc-list", className)}
      {...props}
    />
  );
});
TableOfContentsList.displayName = "TableOfContentsList";

export interface TableOfContentsItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  level?: number;
  asChild?: boolean;
}

export const TableOfContentsItem = React.forwardRef<
  HTMLLIElement,
  TableOfContentsItemProps
>(({ className, level = 1, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "li";
  return (
    <Comp
      ref={ref}
      className={cn(
        "cfui-toc-item",
        level === 2 && "cfui-toc-item--level-2",
        level >= 3 && "cfui-toc-item--level-3",
        className
      )}
      {...props}
    />
  );
});
TableOfContentsItem.displayName = "TableOfContentsItem";

export interface TableOfContentsLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  id: string;
  level?: number;
  asChild?: boolean;
}

export const TableOfContentsLink = React.forwardRef<
  HTMLAnchorElement,
  TableOfContentsLinkProps
>(
  (
    {
      className,
      id,
      level = 1,
      href,
      onClick,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const { activeId, setActiveId, onItemClick } = useTocContext();
    const isActive = activeId === id;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setActiveId(id);
        onItemClick?.(id, e);
      }
    };

    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        href={href ?? `#${id}`}
        aria-current={isActive ? "location" : undefined}
        onClick={handleClick}
        className={cn(
          "cfui-toc-link",
          isActive && "cfui-toc-link--active",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
TableOfContentsLink.displayName = "TableOfContentsLink";
