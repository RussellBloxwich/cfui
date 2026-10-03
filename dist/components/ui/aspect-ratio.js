import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "../../utils.js";
                            
const AspectRatio = React.forwardRef(({ className, ...props }, ref) => (_jsx(AspectRatioPrimitive.Root, { ref: ref, className: cn("cfui-aspect-ratio", className), ...props })));
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;
export { AspectRatio };
//# sourceMappingURL=aspect-ratio.js.map