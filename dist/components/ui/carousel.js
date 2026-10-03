import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import useEmblaCarousel, {} from "embla-carousel-react";
import { cn } from "../../utils.js";
                        
const CarouselContext = React.createContext(null);
function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}
const Carousel = React.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel({
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
    }, plugins);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const onSelect = React.useCallback((emblaApi) => {
        if (!emblaApi)
            return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, []);
    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev();
    }, [api]);
    const scrollNext = React.useCallback(() => {
        api?.scrollNext();
    }, [api]);
    const handleKeyDown = React.useCallback((event) => {
        if (orientation === "horizontal") {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                scrollPrev();
            }
            else if (event.key === "ArrowRight") {
                event.preventDefault();
                scrollNext();
            }
        }
        else {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                scrollPrev();
            }
            else if (event.key === "ArrowDown") {
                event.preventDefault();
                scrollNext();
            }
        }
    }, [orientation, scrollPrev, scrollNext]);
    React.useEffect(() => {
        if (!api || !setApi)
            return;
        setApi(api);
    }, [api, setApi]);
    React.useEffect(() => {
        if (!api)
            return;
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api, onSelect]);
    return (_jsx(CarouselContext.Provider, { value: {
            carouselRef,
            api,
            opts,
            orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext,
        }, children: _jsx("div", { ref: ref, onKeyDownCapture: handleKeyDown, className: cn("cfui-carousel", className), role: "region", "aria-roledescription": "carousel", ...props, children: children }) }));
});
Carousel.displayName = "Carousel";
const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return (_jsx("div", { ref: carouselRef, className: "cfui-carousel-viewport", children: _jsx("div", { ref: ref, className: cn("cfui-carousel-content", orientation === "horizontal"
                ? "cfui-carousel-content-horizontal"
                : "cfui-carousel-content-vertical", className), ...props }) }));
});
CarouselContent.displayName = "CarouselContent";
const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return (_jsx("div", { ref: ref, role: "group", "aria-roledescription": "slide", className: cn("cfui-carousel-item", orientation === "horizontal"
            ? "cfui-carousel-item-horizontal"
            : "cfui-carousel-item-vertical", className), ...props }));
});
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = React.forwardRef(({ className, ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (_jsxs("button", { ref: ref, type: "button", className: cn("cfui-carousel-previous", orientation === "horizontal"
            ? "cfui-carousel-previous-horizontal"
            : "cfui-carousel-previous-vertical", className), disabled: !canScrollPrev, onClick: scrollPrev, "aria-label": "Previous slide", ...props, children: [_jsx("svg", { className: "cfui-carousel-icon", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" }) }), _jsx("span", { className: "cfui-carousel-sr-only", children: "Previous slide" })] }));
});
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = React.forwardRef(({ className, ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (_jsxs("button", { ref: ref, type: "button", className: cn("cfui-carousel-next", orientation === "horizontal"
            ? "cfui-carousel-next-horizontal"
            : "cfui-carousel-next-vertical", className), disabled: !canScrollNext, onClick: scrollNext, "aria-label": "Next slide", ...props, children: [_jsx("svg", { className: "cfui-carousel-icon", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" }) }), _jsx("span", { className: "cfui-carousel-sr-only", children: "Next slide" })] }));
});
CarouselNext.displayName = "CarouselNext";
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, };
//# sourceMappingURL=carousel.js.map