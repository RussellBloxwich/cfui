import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";
                      
export type ToasterProps = React.ComponentProps<typeof Sonner>;
/**
 * Toast notifications powered by sonner, customized to match Cloudflare design tokens,
 * typography, and dark mode palette.
 */
declare const Toaster: ({ className, toastOptions, ...props }: ToasterProps) => React.JSX.Element;
export { Toaster, toast };
//# sourceMappingURL=sonner.d.ts.map