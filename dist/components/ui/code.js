import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import { copyToClipboard } from "./clipboard-text.js";
                    
const CodeContext = React.createContext(null);
export function useCodeContext() {
    const context = React.useContext(CodeContext);
    if (!context) {
        throw new Error("Code compound subcomponents must be used within Code");
    }
    return context;
}
export const Code = React.forwardRef(({ className, code = "", language, filename, showLineNumbers = false, copyable = true, copyTimeout = 2000, asChild = false, children, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const timeoutRef = React.useRef(null);
    const resolvedCode = code || (typeof children === "string" ? children : "");
    const copy = React.useCallback(async () => {
        if (!resolvedCode)
            return;
        const ok = await copyToClipboard(resolvedCode);
        if (ok) {
            setCopied(true);
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, copyTimeout);
        }
    }, [resolvedCode, copyTimeout]);
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        };
    }, []);
    const Comp = asChild ? Slot : "div";
    return (_jsx(CodeContext.Provider, { value: {
            code: resolvedCode,
            language,
            filename,
            copied,
            copy,
            showLineNumbers,
        }, children: _jsx(Comp, { ref: ref, "data-language": language, className: cn("cfui-code", className), ...props, children: children ? (children) : (_jsxs(_Fragment, { children: [(filename || language || copyable) && (_jsxs(CodeHeader, { children: [_jsxs("div", { className: "cfui-code-header-meta", children: [filename && _jsx(CodeFilename, { children: filename }), language && _jsx(CodeLanguage, { children: language })] }), copyable && _jsx(CodeCopyButton, {})] })), _jsx(CodeContent, { children: resolvedCode })] })) }) }));
});
Code.displayName = "Code";
export const CodeHeader = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-code-header", className), ...props }));
});
CodeHeader.displayName = "CodeHeader";
export const CodeFilename = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
    const { filename } = useCodeContext();
    const Comp = asChild ? Slot : "span";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-code-filename", className), ...props, children: children ?? filename }));
});
CodeFilename.displayName = "CodeFilename";
export const CodeTitle = CodeFilename;
export const CodeLanguage = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
    const { language } = useCodeContext();
    const Comp = asChild ? Slot : "span";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-code-language", className), ...props, children: children ?? language }));
});
CodeLanguage.displayName = "CodeLanguage";
export const CodeCopyButton = React.forwardRef(({ className, asChild = false, type = "button", onClick, children, ...props }, ref) => {
    const { copy, copied } = useCodeContext();
    const handleClick = (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
            copy();
        }
    };
    const Comp = asChild ? Slot : "button";
    return (_jsx(Comp, { ref: ref, type: type, "aria-label": copied ? "Copied code" : "Copy code", onClick: handleClick, className: cn("cfui-code-copy", copied && "cfui-code-copy--copied", className), ...props, children: children ??
            (copied ? (_jsx(CheckIcon, { size: 13, weight: "bold" })) : (_jsx(CopyIcon, { size: 13, weight: "regular" }))) }));
});
CodeCopyButton.displayName = "CodeCopyButton";
export const CodeCopy = CodeCopyButton;
export const CodeContent = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
    const { code, showLineNumbers } = useCodeContext();
    const Comp = asChild ? Slot : "pre";
    const contentText = typeof children === "string" ? children : code;
    const lines = contentText ? contentText.split("\n") : [];
    return (_jsx(Comp, { ref: ref, className: cn("cfui-code-content", className), ...props, children: _jsx("code", { children: showLineNumbers && lines.length > 0 ? (_jsxs("div", { className: "cfui-code-line-numbers", children: [_jsx("div", { className: "cfui-code-line-number-gutter", children: lines.map((_, i) => (_jsx("div", { children: i + 1 }, i))) }), _jsx("div", { className: "cfui-code-line-number-code", children: lines.map((line, i) => (_jsx("div", { children: line || " " }, i))) })] })) : (children ?? code) }) }));
});
CodeContent.displayName = "CodeContent";
export const CodePre = CodeContent;
export const InlineCode = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "code";
    return (_jsx(Comp, { ref: ref, className: cn("cfui-inline-code", className), ...props }));
});
InlineCode.displayName = "InlineCode";
//# sourceMappingURL=code.js.map