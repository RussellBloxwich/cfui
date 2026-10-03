import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { CopyIcon, CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./clipboard-text.css";

export type ClipboardStatus = "idle" | "copied" | "error";

export interface ClipboardTextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  displayText?: string;
  timeout?: number;
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
  variant?: "inline" | "button" | "ghost" | "badge";
  asChild?: boolean;
}

interface ClipboardTextContextValue {
  text: string;
  status: ClipboardStatus;
  copy: () => Promise<void>;
  variant: "inline" | "button" | "ghost" | "badge";
}

const ClipboardTextContext =
  React.createContext<ClipboardTextContextValue | null>(null);

export function useClipboardTextContext() {
  const context = React.useContext(ClipboardTextContext);
  if (!context) {
    throw new Error(
      "ClipboardText compound subcomponents must be used within ClipboardText"
    );
  }
  return context;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Try modern Clipboard API first
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback using execCommand with selection preservation
  try {
    const selection = window.getSelection();
    const originalRange =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    let successful = false;
    try {
      successful = document.execCommand("copy");
    } catch {
      successful = false;
    }

    document.body.removeChild(textarea);

    // Restore original user selection
    if (selection && originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }

    return Boolean(successful);
  } catch {
    return false;
  }
}

export const ClipboardText = React.forwardRef<
  HTMLButtonElement,
  ClipboardTextProps
>(
  (
    {
      className,
      text,
      displayText,
      timeout = 2000,
      onCopySuccess,
      onCopyError,
      variant = "inline",
      asChild = false,
      type = "button",
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const [status, setStatus] = React.useState<ClipboardStatus>("idle");
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const performCopy = React.useCallback(async () => {
      try {
        const success = await copyToClipboard(text);
        if (success) {
          setStatus("copied");
          onCopySuccess?.(text);
        } else {
          setStatus("error");
          onCopyError?.(new Error("Failed to copy text using clipboard APIs"));
        }
      } catch (err) {
        setStatus("error");
        onCopyError?.(err instanceof Error ? err : new Error(String(err)));
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setStatus("idle");
      }, timeout);
    }, [text, timeout, onCopySuccess, onCopyError]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        await performCopy();
      }
    };

    const Comp = asChild ? Slot : "button";

    return (
      <ClipboardTextContext.Provider
        value={{ text, status, copy: performCopy, variant }}
      >
        <Comp
          ref={ref}
          type={asChild ? undefined : type}
          aria-label={
            status === "copied"
              ? "Copied to clipboard"
              : status === "error"
              ? "Failed to copy"
              : `Copy ${text} to clipboard`
          }
          onClick={handleClick}
          className={cn(
            "cfui-clipboard-text",
            `cfui-clipboard-text--${variant}`,
            className
          )}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              <ClipboardTextValue>
                {displayText ?? text}
              </ClipboardTextValue>
              <ClipboardTextIcon />
            </>
          )}
        </Comp>
      </ClipboardTextContext.Provider>
    );
  }
);
ClipboardText.displayName = "ClipboardText";

export interface ClipboardTextValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const ClipboardTextValue = React.forwardRef<
  HTMLSpanElement,
  ClipboardTextValueProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-clipboard-text-value", className)}
      {...props}
    />
  );
});
ClipboardTextValue.displayName = "ClipboardTextValue";

export interface ClipboardTextIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const ClipboardTextIcon = React.forwardRef<
  HTMLSpanElement,
  ClipboardTextIconProps
>(({ className, asChild = false, children, ...props }, ref) => {
  const { status } = useClipboardTextContext();
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      aria-hidden="true"
      className={cn(
        "cfui-clipboard-text-icon",
        status === "copied" && "cfui-clipboard-text-icon--copied",
        status === "error" && "cfui-clipboard-text-icon--error",
        status === "idle" && "cfui-clipboard-text-icon--idle",
        className
      )}
      {...props}
    >
      {children ??
        (status === "copied" ? (
          <CheckIcon size={14} weight="bold" />
        ) : status === "error" ? (
          <WarningCircleIcon size={14} weight="bold" />
        ) : (
          <CopyIcon size={14} />
        ))}
    </Comp>
  );
});
ClipboardTextIcon.displayName = "ClipboardTextIcon";

export const ClipboardTextTrigger = ClipboardText;
export const ClipboardTextButton = ClipboardText;

/* InlineCopyText Alias */
export const InlineCopyText = ClipboardText;
export type InlineCopyTextProps = ClipboardTextProps;
