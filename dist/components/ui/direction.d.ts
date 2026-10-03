import * as React from "react";
                         
export type Direction = "ltr" | "rtl";
export interface DirectionProviderProps {
    direction?: Direction;
    dir?: Direction;
    children?: React.ReactNode;
}
/**
 * DirectionProvider sets the text and layout direction ('ltr' or 'rtl')
 * for all nested Radix and CFUI components without altering document or body.
 */
export declare function DirectionProvider({ direction, dir, children, }: DirectionProviderProps): React.JSX.Element;
/**
 * Hook to access current direction context.
 */
export declare function useDirection(localDir?: Direction): Direction;
//# sourceMappingURL=direction.d.ts.map