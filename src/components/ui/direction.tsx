import * as React from "react";
import {
  DirectionProvider as RadixDirectionProvider,
  useDirection as useRadixDirection,
} from "@radix-ui/react-direction";
import "./direction.css";

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
export function DirectionProvider({
  direction,
  dir,
  children,
}: DirectionProviderProps) {
  const resolvedDir = direction ?? dir ?? "ltr";
  return (
    <RadixDirectionProvider dir={resolvedDir}>
      {children}
    </RadixDirectionProvider>
  );
}

/**
 * Hook to access current direction context.
 */
export function useDirection(localDir?: Direction): Direction {
  return useRadixDirection(localDir);
}
