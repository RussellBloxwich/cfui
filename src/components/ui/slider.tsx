import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../utils.js";
import "./slider.css";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, min = 0, ...props }, ref) => {
  const values = value ?? defaultValue ?? [min];
  const thumbCount = Array.isArray(values) ? Math.max(1, values.length) : 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("cfui-slider", className)}
      value={value}
      defaultValue={defaultValue}
      min={min}
      {...props}
    >
      <SliderPrimitive.Track className="cfui-slider-track">
        <SliderPrimitive.Range className="cfui-slider-range" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="cfui-slider-thumb"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
