"use client";

import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";
import {
  CheckCircle,
  Info,
  Warning,
  WarningCircle,
  CircleNotch,
} from "@phosphor-icons/react";
import { cn } from "../../utils.js";
import "./sonner.css";

export type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toast notifications powered by sonner, customized to match Cloudflare design tokens,
 * typography, and dark mode palette.
 */
const Toaster = ({ className, toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn("cfui-toaster group", className)}
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast group-[.toaster]:bg-[var(--cfui-base,var(--color-kumo-base,#ffffff))]",
            "group-[.toaster]:text-[var(--cfui-text,var(--text-color-kumo-default,#1f1f1f))]",
            "group-[.toaster]:border-[var(--cfui-line,var(--color-kumo-line,rgba(0,0,0,0.1)))]",
            "group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:p-3.5 group-[.toaster]:gap-3 group-[.toaster]:font-sans text-sm",
            toastOptions?.classNames?.toast
          ),
          description: cn(
            "group-[.toast]:text-[var(--cfui-text-muted,var(--text-color-kumo-subtle,#71717a))] group-[.toast]:text-xs font-normal",
            toastOptions?.classNames?.description
          ),
          actionButton: cn(
            "group-[.toast]:bg-[var(--cfui-brand,var(--color-kumo-brand,#f6821f))] group-[.toast]:text-white",
            "group-[.toast]:hover:bg-[var(--cfui-brand-hover,var(--color-kumo-brand-hover,#ea580c))]",
            "group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:px-2.5 group-[.toast]:py-1.5 transition-colors border-0 cursor-pointer",
            toastOptions?.classNames?.actionButton
          ),
          cancelButton: cn(
            "group-[.toast]:bg-[var(--cfui-tint,var(--color-kumo-tint,#f4f4f5))]",
            "group-[.toast]:text-[var(--cfui-text,var(--text-color-kumo-default,#1f1f1f))]",
            "group-[.toast]:hover:bg-[var(--cfui-fill,var(--color-kumo-fill,#e4e4e7))]",
            "group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:px-2.5 group-[.toast]:py-1.5 transition-colors border-0 cursor-pointer",
            toastOptions?.classNames?.cancelButton
          ),
          closeButton: cn(
            "group-[.toast]:bg-[var(--cfui-base,var(--color-kumo-base,#ffffff))]",
            "group-[.toast]:text-[var(--cfui-text-muted,var(--text-color-kumo-subtle,#71717a))]",
            "group-[.toast]:border-[var(--cfui-line,var(--color-kumo-line,rgba(0,0,0,0.1)))]",
            "group-[.toast]:hover:text-[var(--cfui-text,var(--text-color-kumo-default,#1f1f1f))] rounded-md transition-colors",
            toastOptions?.classNames?.closeButton
          ),
          success: cn(
            "group-[.toaster]:border-[var(--cfui-success,var(--color-kumo-success,#16a34a))] group-[.toast]:text-[var(--cfui-text,var(--text-color-kumo-default,#1f1f1f))]",
            toastOptions?.classNames?.success
          ),
          error: cn(
            "group-[.toaster]:border-[var(--cfui-danger,var(--color-kumo-danger,#dc2626))] group-[.toast]:text-[var(--cfui-text,var(--text-color-kumo-default,#1f1f1f))]",
            toastOptions?.classNames?.error
          ),
          warning: cn(
            "group-[.toaster]:border-[var(--cfui-warning,var(--color-kumo-warning,#ca8a04))] group-[.toast]:text-[var(--cfui-text,var(--text-color-kumo-default,#1f1f1f))]",
            toastOptions?.classNames?.warning
          ),
          info: cn(
            "group-[.toaster]:border-[var(--cfui-info,var(--color-kumo-info,#2563eb))] group-[.toast]:text-[var(--cfui-text,var(--text-color-kumo-default,#1f1f1f))]",
            toastOptions?.classNames?.info
          ),
        },
        ...toastOptions,
      }}
      icons={{
        success: (
          <CheckCircle
            className="cfui-toast-icon cfui-toast-icon-success"
            weight="fill"
          />
        ),
        info: (
          <Info
            className="cfui-toast-icon cfui-toast-icon-info"
            weight="fill"
          />
        ),
        warning: (
          <Warning
            className="cfui-toast-icon cfui-toast-icon-warning"
            weight="fill"
          />
        ),
        error: (
          <WarningCircle
            className="cfui-toast-icon cfui-toast-icon-danger"
            weight="fill"
          />
        ),
        loading: (
          <CircleNotch className="cfui-toast-icon cfui-toast-icon-loading" />
        ),
        ...props.icons,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
