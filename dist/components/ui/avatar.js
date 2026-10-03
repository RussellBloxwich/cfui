import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import { cn } from "../../utils.js";
                      
const avatarVariants = cva("cfui-avatar", {
    variants: {
        size: {
            default: "cfui-avatar--size-default",
            sm: "cfui-avatar--size-sm",
            lg: "cfui-avatar--size-lg",
            xl: "cfui-avatar--size-xl",
        },
        shape: {
            circle: "cfui-avatar--circle",
            square: "cfui-avatar--square",
        },
    },
    defaultVariants: {
        size: "default",
        shape: "circle",
    },
});
const Avatar = React.forwardRef(({ className, size, shape, ...props }, ref) => (_jsx(AvatarPrimitive.Root, { ref: ref, className: cn(avatarVariants({ size, shape }), className), ...props })));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (_jsx(AvatarPrimitive.Image, { ref: ref, className: cn("cfui-avatar__image", className), ...props })));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (_jsx(AvatarPrimitive.Fallback, { ref: ref, className: cn("cfui-avatar__fallback", className), ...props })));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
//# sourceMappingURL=avatar.js.map