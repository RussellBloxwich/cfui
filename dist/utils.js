import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/** Merge conditional class names; consumers do not need Tailwind to use cfui-* styles. */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
//# sourceMappingURL=utils.js.map