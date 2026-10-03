import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { CaretLeftIcon, CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./pagination.css";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("cfui-pagination", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("cfui-pagination-content", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("cfui-pagination-item", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "sm" | "icon";
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<"a">;

const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({ className, isActive, size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "cfui-pagination-link",
        isActive && "cfui-pagination-link--active",
        size === "sm" && "cfui-pagination-link--sm",
        size === "icon" && "cfui-pagination-link--icon",
        className
      )}
      {...props}
    />
  );
});
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof PaginationLink>
>(({ className, children, asChild = false, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return (
      <PaginationLink
        ref={ref}
        asChild
        aria-label="Go to previous page"
        size="default"
        className={cn("cfui-pagination-previous", className)}
        {...props}
      >
        {React.cloneElement(
          child,
          {
            ...child.props,
            className: cn(child.props.className),
          },
          <>
            <CaretLeftIcon size={16} weight="bold" />
            <span>{child.props.children ?? "Previous"}</span>
          </>
        )}
      </PaginationLink>
    );
  }

  return (
    <PaginationLink
      ref={ref}
      asChild={asChild}
      aria-label="Go to previous page"
      size="default"
      className={cn("cfui-pagination-previous", className)}
      {...props}
    >
      <CaretLeftIcon size={16} weight="bold" />
      <span>{children ?? "Previous"}</span>
    </PaginationLink>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof PaginationLink>
>(({ className, children, asChild = false, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return (
      <PaginationLink
        ref={ref}
        asChild
        aria-label="Go to next page"
        size="default"
        className={cn("cfui-pagination-next", className)}
        {...props}
      >
        {React.cloneElement(
          child,
          {
            ...child.props,
            className: cn(child.props.className),
          },
          <>
            <span>{child.props.children ?? "Next"}</span>
            <CaretRightIcon size={16} weight="bold" />
          </>
        )}
      </PaginationLink>
    );
  }

  return (
    <PaginationLink
      ref={ref}
      asChild={asChild}
      aria-label="Go to next page"
      size="default"
      className={cn("cfui-pagination-next", className)}
      {...props}
    >
      <span>{children ?? "Next"}</span>
      <CaretRightIcon size={16} weight="bold" />
    </PaginationLink>
  );
});
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cn("cfui-pagination-ellipsis", className)}
    {...props}
  >
    <DotsThreeIcon size={16} weight="bold" className="cfui-pagination-ellipsis-icon" />
    <span
      className="sr-only"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      More pages
    </span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
