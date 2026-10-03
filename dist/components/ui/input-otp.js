import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../utils.js";
                         
const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (_jsx(OTPInput, { ref: ref, containerClassName: cn("cfui-input-otp-container", containerClassName), className: cn("cfui-input-otp-input", className), ...props })));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("cfui-input-otp-group", className), ...props })));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const slot = inputOTPContext?.slots[index];
    const char = slot?.char;
    const hasFakeCaret = slot?.hasFakeCaret;
    const isActive = slot?.isActive;
    return (_jsxs("div", { ref: ref, className: cn("cfui-input-otp-slot", isActive && "cfui-input-otp-slot--active", className), ...props, children: [char, hasFakeCaret && _jsx("div", { className: "cfui-input-otp-caret" })] }));
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = React.forwardRef(({ className, children, ...props }, ref) => (_jsx("div", { ref: ref, role: "separator", className: cn("cfui-input-otp-separator", className), ...props, children: children ?? _jsx(MinusIcon, { weight: "bold" }) })));
InputOTPSeparator.displayName = "InputOTPSeparator";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
//# sourceMappingURL=input-otp.js.map