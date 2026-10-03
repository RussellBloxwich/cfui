import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => cleanup());
if (typeof window !== 'undefined' && typeof Element !== 'undefined') {
  if (!window.PointerEvent) window.PointerEvent = MouseEvent as typeof PointerEvent;
  if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
  if (!Element.prototype.hasPointerCapture) Element.prototype.hasPointerCapture = function () { return false; };
  if (!Element.prototype.setPointerCapture) Element.prototype.setPointerCapture = function () {};
  if (!Element.prototype.releasePointerCapture) Element.prototype.releasePointerCapture = function () {};
  if (!window.matchMedia) window.matchMedia = (query: string) => ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
  if (!globalThis.ResizeObserver) globalThis.ResizeObserver = class ResizeObserver {
    private callback: ResizeObserverCallback;
    private targets = new Set<Element>();
    constructor(callback: ResizeObserverCallback) { this.callback = callback; }
    observe(target: Element) {
      this.targets.add(target);
      queueMicrotask(() => {
        if (!this.targets.has(target)) return;
        const rect = target.getBoundingClientRect();
        this.callback([{ target, contentRect: rect, borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }], contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }], devicePixelContentBoxSize: [] } as unknown as ResizeObserverEntry], this);
      });
    }
    unobserve(target: Element) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
  };
}
