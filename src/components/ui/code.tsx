import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { copyToClipboard } from "./clipboard-text.js";
import "./code.css";

export interface CodeProps extends React.HTMLAttributes<HTMLDivElement> {
  code?: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  copyTimeout?: number;
  asChild?: boolean;
}

interface CodeContextValue {
  code: string;
  language?: string;
  filename?: string;
  copied: boolean;
  copy: () => Promise<void>;
  showLineNumbers: boolean;
}

const CodeContext = React.createContext<CodeContextValue | null>(null);

export function useCodeContext() {
  const context = React.useContext(CodeContext);
  if (!context) {
    throw new Error("Code compound subcomponents must be used within Code");
  }
  return context;
}

export const Code = React.forwardRef<HTMLDivElement, CodeProps>(
  (
    {
      className,
      code = "",
      language,
      filename,
      showLineNumbers = false,
      copyable = true,
      copyTimeout = 2000,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const resolvedCode =
      code || (typeof children === "string" ? children : "");

    const copy = React.useCallback(async () => {
      if (!resolvedCode) return;
      const ok = await copyToClipboard(resolvedCode);
      if (ok) {
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, copyTimeout);
      }
    }, [resolvedCode, copyTimeout]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const Comp = asChild ? Slot : "div";

    return (
      <CodeContext.Provider
        value={{
          code: resolvedCode,
          language,
          filename,
          copied,
          copy,
          showLineNumbers,
        }}
      >
        <Comp
          ref={ref}
          data-language={language}
          className={cn("cfui-code", className)}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              {(filename || language || copyable) && (
                <CodeHeader>
                  <div className="cfui-code-header-meta">
                    {filename && <CodeFilename>{filename}</CodeFilename>}
                    {language && <CodeLanguage>{language}</CodeLanguage>}
                  </div>
                  {copyable && <CodeCopyButton />}
                </CodeHeader>
              )}
              <CodeContent>{resolvedCode}</CodeContent>
            </>
          )}
        </Comp>
      </CodeContext.Provider>
    );
  }
);
Code.displayName = "Code";

export interface CodeHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const CodeHeader = React.forwardRef<HTMLDivElement, CodeHeaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-code-header", className)}
        {...props}
      />
    );
  }
);
CodeHeader.displayName = "CodeHeader";

export interface CodeFilenameProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const CodeFilename = React.forwardRef<
  HTMLSpanElement,
  CodeFilenameProps
>(({ className, asChild = false, children, ...props }, ref) => {
  const { filename } = useCodeContext();
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-code-filename", className)}
      {...props}
    >
      {children ?? filename}
    </Comp>
  );
});
CodeFilename.displayName = "CodeFilename";

export const CodeTitle = CodeFilename;

export interface CodeLanguageProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const CodeLanguage = React.forwardRef<
  HTMLSpanElement,
  CodeLanguageProps
>(({ className, asChild = false, children, ...props }, ref) => {
  const { language } = useCodeContext();
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      ref={ref}
      className={cn("cfui-code-language", className)}
      {...props}
    >
      {children ?? language}
    </Comp>
  );
});
CodeLanguage.displayName = "CodeLanguage";

export interface CodeCopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const CodeCopyButton = React.forwardRef<
  HTMLButtonElement,
  CodeCopyButtonProps
>(({ className, asChild = false, type = "button", onClick, children, ...props }, ref) => {
  const { copy, copied } = useCodeContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      copy();
    }
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type={type}
      aria-label={copied ? "Copied code" : "Copy code"}
      onClick={handleClick}
      className={cn(
        "cfui-code-copy",
        copied && "cfui-code-copy--copied",
        className
      )}
      {...props}
    >
      {children ??
        (copied ? (
          <CheckIcon size={13} weight="bold" />
        ) : (
          <CopyIcon size={13} weight="regular" />
        ))}
    </Comp>
  );
});
CodeCopyButton.displayName = "CodeCopyButton";

export const CodeCopy = CodeCopyButton;

export interface CodeContentProps
  extends React.HTMLAttributes<HTMLPreElement> {
  asChild?: boolean;
}

export const CodeContent = React.forwardRef<HTMLPreElement, CodeContentProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const { code, showLineNumbers } = useCodeContext();
    const Comp = asChild ? Slot : "pre";

    const contentText =
      typeof children === "string" ? children : code;

    const lines = contentText ? contentText.split("\n") : [];

    return (
      <Comp
        ref={ref}
        className={cn("cfui-code-content", className)}
        {...props}
      >
        <code>
          {showLineNumbers && lines.length > 0 ? (
            <div className="cfui-code-line-numbers">
              <div className="cfui-code-line-number-gutter">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="cfui-code-line-number-code">
                {lines.map((line, i) => (
                  <div key={i}>{line || " "}</div>
                ))}
              </div>
            </div>
          ) : (
            children ?? code
          )}
        </code>
      </Comp>
    );
  }
);
CodeContent.displayName = "CodeContent";

export const CodePre = CodeContent;

/* InlineCode component */
export interface InlineCodeProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const InlineCode = React.forwardRef<HTMLElement, InlineCodeProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "code";
    return (
      <Comp
        ref={ref}
        className={cn("cfui-inline-code", className)}
        {...props}
      />
    );
  }
);
InlineCode.displayName = "InlineCode";
