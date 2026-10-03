import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils.js";
                                 
const TocContext = React.createContext(null);
export function useTocContext() {
    const context = React.useContext(TocContext);
    if (!context) {
        throw new Error("TableOfContents compound subcomponents must be used within TableOfContents");
    }
    return context;
}
export const TableOfContents = React.forwardRef(({ className, items, activeId: controlledActiveId, defaultActiveId, onActiveIdChange, onItemClick, title = "On this page", asChild = false, children, ...props }, ref) => {
    const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState(defaultActiveId);
    const activeId = controlledActiveId !== undefined ? controlledActiveId : uncontrolledActiveId;
    const setActiveId = React.useCallback((id) => {
        if (controlledActiveId === undefined) {
            setUncontrolledActiveId(id);
        }
        onActiveIdChange?.(id);
    }, [controlledActiveId, onActiveIdChange]);
    const Comp = asChild ? Slot : "nav";
    const renderItems = (itemList) => {
        return (_jsx(TableOfContentsList, { children: itemList.map((item) => (_jsxs(TableOfContentsItem, { level: item.level ?? 1, children: [_jsx(TableOfContentsLink, { id: item.id, href: item.href ?? `#${item.id}`, level: item.level ?? 1, children: item.title }), item.children && item.children.length > 0 && renderItems(item.children)] }, item.id))) }));
    };
    return (_jsx(TocContext.Provider, { value: { activeId, setActiveId, onItemClick }, children: _jsx(Comp, { ref: ref, "aria-label": "Table of contents", className: cn("cfui-toc", className), ...props, children: children ? (children) : (_jsxs(_Fragment, { children: [title && _jsx(TableOfContentsTitle, { children: title }), items && items.length > 0 && renderItems(items)] })) }) }));
});
TableOfContents.displayName = "TableOfContents";
export const TableOfContentsTitle = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h4";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-toc-title", className), ...props }));
});
TableOfContentsTitle.displayName = "TableOfContentsTitle";
export const TableOfContentsHeader = TableOfContentsTitle;
export const TableOfContentsList = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "ul";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-toc-list", className), ...props }));
});
TableOfContentsList.displayName = "TableOfContentsList";
export const TableOfContentsItem = React.forwardRef(({ className, level = 1, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "li";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-toc-item", level === 2 && "cfui-toc-item--level-2", level >= 3 && "cfui-toc-item--level-3", className), ...props }));
});
TableOfContentsItem.displayName = "TableOfContentsItem";
export const TableOfContentsLink = React.forwardRef(({ className, id, level = 1, href, onClick, asChild = false, children, ...props }, ref) => {
    const { activeId, setActiveId, onItemClick } = useTocContext();
    const isActive = activeId === id;
    const handleClick = (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
            setActiveId(id);
            onItemClick?.(id, e);
        }
    };
    const Comp = asChild ? Slot : "a";
    return (_jsx(Comp, { ref: ref, href: href ?? `#${id}`, "aria-current": isActive ? "location" : undefined, onClick: handleClick, className: cn("cfui-toc-link", isActive && "cfui-toc-link--active", className), ...props, children: children }));
});
TableOfContentsLink.displayName = "TableOfContentsLink";
//# sourceMappingURL=table-of-contents.js.map