import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { DirectionProvider as RadixDirectionProvider, useDirection as useRadixDirection, } from "@radix-ui/react-direction";
                         
/**
 * DirectionProvider sets the text and layout direction ('ltr' or 'rtl')
 * for all nested Radix and CFUI components without altering document or body.
 */
export function DirectionProvider({ direction, dir, children, }) {
    const resolvedDir = direction ?? dir ?? "ltr";
    return (_jsx(RadixDirectionProvider, { dir: resolvedDir, children: children }));
}
/**
 * Hook to access current direction context.
 */
export function useDirection(localDir) {
    return useRadixDirection(localDir);
}
//# sourceMappingURL=direction.js.map