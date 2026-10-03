import { useState, type ComponentProps } from 'react';
import { act, cleanup, createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from '../src/index.js';

function QuestionnaireButtons({ preventNext = false }: { preventNext?: boolean }) {
  return (
    <QuestionnaireActions>
      <QuestionnairePrevious />
      <QuestionnaireSkip />
      <QuestionnaireNext onClick={preventNext ? (event) => event.preventDefault() : undefined} />
      <QuestionnaireSubmit />
      <button type="reset">Reset answers</button>
    </QuestionnaireActions>
  );
}

function getForm() {
  const form = document.querySelector('form');
  if (!form) throw new Error('Expected a native questionnaire form');
  return form;
}

describe('Questionnaire native answer and navigation contracts', () => {
  it('discovers child-defined items when items is omitted, retains prior answers, and focuses the next step', async () => {
    const user = userEvent.setup();
    render(
      <Questionnaire>
        <QuestionnaireProgress />
        <QuestionnaireItem name="first" required>
          <QuestionnaireTitle>First question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="First answer" defaultValue="Saved answer" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="second">
          <QuestionnaireTitle>Second question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Second answer" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireButtons />
      </Questionnaire>,
    );

    const first = await screen.findByRole('group', { name: 'First question' });
    expect(first).toBeVisible();
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-total', '2');
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-current', '1');
    await user.click(screen.getByRole('button', { name: 'Next' }));

    const second = await screen.findByRole('group', { name: 'Second question' });
    await waitFor(() => expect(second).toHaveFocus());
    expect(first).not.toBeVisible();
    expect(new FormData(getForm()).get('first')).toBe('Saved answer');
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-current', '2');
  });

  it('validates default-filled required answers and navigates with callback form and fieldset refs', async () => {
    const user = userEvent.setup();
    const formRef = vi.fn();
    const itemRef = vi.fn();
    const onSubmit = vi.fn((event: Parameters<NonNullable<ComponentProps<typeof Questionnaire>['onSubmit']>>[0]) => event.preventDefault());
    render(
      <Questionnaire ref={formRef} items={[{ name: 'first', required: true }, { name: 'second', required: true }]} onSubmit={onSubmit}>
        <QuestionnaireItem name="first" required>
          <QuestionnaireTitle>First question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="First answer" defaultValue="One" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="second" required ref={itemRef}>
          <QuestionnaireTitle>Second question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Second answer" defaultValue="Two" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireButtons />
      </Questionnaire>,
    );

    expect(formRef).toHaveBeenCalledWith(getForm());
    await user.click(screen.getByRole('button', { name: 'Next' }));
    const second = await screen.findByRole('group', { name: 'Second question' });
    expect(itemRef).toHaveBeenCalledWith(second);
    await waitFor(() => expect(second).toHaveFocus());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect([...new FormData(getForm())]).toEqual([['first', 'One'], ['second', 'Two']]);
  });

  it('starts at the first enabled definition and excludes disabled definitions from progress', () => {
    render(
      <Questionnaire items={[{ name: 'disabled', disabled: true }, { name: 'enabled' }]}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="disabled">
          <QuestionnaireTitle>Disabled question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Disabled answer" defaultValue="Omit this" />
        </QuestionnaireItem>
        <QuestionnaireItem name="enabled">
          <QuestionnaireTitle>Enabled question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Enabled answer" />
        </QuestionnaireItem>
        <QuestionnaireButtons />
      </Questionnaire>,
    );

    expect(screen.getByRole('group', { name: 'Enabled question' })).toBeVisible();
    expect(screen.queryByRole('group', { name: 'Disabled question' })).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-total', '1');
  });

  it('does not serialize disabled root definitions even when the child does not repeat disabled', () => {
    render(
      <Questionnaire defaultItem="enabled" items={[{ name: 'enabled' }, { name: 'disabled', disabled: true }]}>
        <QuestionnaireItem name="enabled">
          <QuestionnaireTitle>Enabled question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Enabled answer" defaultValue="Include this" />
        </QuestionnaireItem>
        <QuestionnaireItem name="disabled">
          <QuestionnaireTitle>Disabled question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Disabled answer" defaultValue="Omit this" />
        </QuestionnaireItem>
      </Questionnaire>,
    );

    const answers = new FormData(getForm());
    expect(answers.get('enabled')).toBe('Include this');
    expect(answers.has('disabled')).toBe(false);
  });

  it('allows revisiting a skipped optional step and replacing the skip with an answer', async () => {
    const user = userEvent.setup();
    render(
      <Questionnaire items={[{ name: 'optional' }, { name: 'last' }]}>
        <QuestionnaireItem name="optional">
          <QuestionnaireTitle>Optional question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Optional answer" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="last">
          <QuestionnaireTitle>Last question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Last answer" defaultValue="Ready" />
        </QuestionnaireItem>
        <QuestionnaireButtons />
      </Questionnaire>,
    );

    await user.click(screen.getByRole('button', { name: 'Skip' }));
    expect(new FormData(getForm()).has('optional')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    const optional = screen.getByRole('group', { name: 'Optional question' });
    expect(optional).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Optional answer' })).not.toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: 'Optional answer' }), 'Revised answer');
    expect(new FormData(getForm()).get('optional')).toBe('Revised answer');
    expect(optional).toHaveAttribute('data-status', 'answered');
  });

  it('native reset restores default answers, active default, statuses, skipped answers, and validation state', async () => {
    const user = userEvent.setup();
    render(
      <Questionnaire defaultItem="first" items={[{ name: 'first', required: true, multiple: true }, { name: 'second' }]}>
        <QuestionnaireItem name="first" required multiple>
          <QuestionnaireTitle>First question</QuestionnaireTitle>
          <QuestionnaireChoice value="original" defaultChecked>Original choice</QuestionnaireChoice>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="second">
          <QuestionnaireTitle>Second question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Second answer" defaultValue="Original text" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireButtons />
      </Questionnaire>,
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.clear(screen.getByRole('textbox', { name: 'Second answer' }));
    await user.type(screen.getByRole('textbox', { name: 'Second answer' }), 'Changed');
    await user.click(screen.getByRole('button', { name: 'Skip' }));
    expect(new FormData(getForm()).has('second')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Reset answers' }));

    expect(screen.getByRole('group', { name: 'First question' })).toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Original choice' })).toBeChecked();
    expect(screen.getByRole('group', { name: 'First question' })).toHaveAttribute('data-status', 'answered');
    expect(new FormData(getForm()).get('second')).toBe('Original text');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Original choice' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('alert')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Reset answers' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Original choice' })).toBeChecked();
  });

  it('respects a caller-prevented reset', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn((event: Parameters<NonNullable<ComponentProps<typeof Questionnaire>['onReset']>>[0]) => event.preventDefault());
    render(
      <Questionnaire items={[{ name: 'answer' }]} onReset={onReset}>
        <QuestionnaireItem name="answer">
          <QuestionnaireTitle>Answer question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Answer" defaultValue="Original" />
        </QuestionnaireItem>
        <QuestionnaireButtons />
      </Questionnaire>,
    );
    await user.clear(screen.getByRole('textbox', { name: 'Answer' }));
    await user.type(screen.getByRole('textbox', { name: 'Answer' }), 'Changed');
    await user.click(screen.getByRole('button', { name: 'Reset answers' }));
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox', { name: 'Answer' })).toHaveValue('Changed');
    expect(screen.getByRole('group', { name: 'Answer question' })).toHaveAttribute('data-status', 'answered');
  });

  it('lets the caller prevent Next before changing the active step', async () => {
    const user = userEvent.setup();
    render(
      <Questionnaire items={[{ name: 'first' }, { name: 'second' }]}>
        <QuestionnaireItem name="first">
          <QuestionnaireTitle>First question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="First answer" defaultValue="Ready" />
        </QuestionnaireItem>
        <QuestionnaireItem name="second">
          <QuestionnaireTitle>Second question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Second answer" />
        </QuestionnaireItem>
        <QuestionnaireButtons preventNext />
      </Questionnaire>,
    );
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('group', { name: 'First question' })).toBeVisible();
    expect(screen.queryByRole('group', { name: 'Second question' })).not.toBeInTheDocument();
  });

  it('delivers an uncanceled valid native submit event and lets the caller prevent it', () => {
    let wasAlreadyPrevented: boolean | undefined;
    const onSubmit = vi.fn((event: Parameters<NonNullable<ComponentProps<typeof Questionnaire>['onSubmit']>>[0]) => {
      wasAlreadyPrevented = event.defaultPrevented;
      expect(new FormData(event.currentTarget).get('answer')).toBe('Default answer');
      event.preventDefault();
    });
    render(
      <Questionnaire items={[{ name: 'answer', required: true }]} onSubmit={onSubmit}>
        <QuestionnaireItem name="answer" required>
          <QuestionnaireTitle>Answer question</QuestionnaireTitle>
          <QuestionnaireInput aria-label="Answer" defaultValue="Default answer" />
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireSubmit />
      </Questionnaire>,
    );
    const event = createEvent.submit(getForm());
    fireEvent(getForm(), event);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(wasAlreadyPrevented).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});

// jsdom does not calculate layout or scroll as a consequence of wheel input.
// These fixtures model actual DOM row order and native clamped scroll geometry;
// they do not invoke the component's context helpers or simulate anchoring for it.
const VIEWPORT_SELECTOR = '[data-fixture-viewport]';
const ROW_SELECTOR = '[data-message-id]';

function viewportFor(element: Element): HTMLElement | null {
  return element.matches(VIEWPORT_SELECTOR) ? element as HTMLElement : element.closest<HTMLElement>(VIEWPORT_SELECTOR);
}

function rowsFor(viewport: HTMLElement) {
  return Array.from(viewport.querySelectorAll<HTMLElement>(ROW_SELECTOR));
}

function rowTop(element: HTMLElement, viewport: HTMLElement) {
  const rows = rowsFor(viewport);
  const index = rows.indexOf(element);
  return index < 0 ? 0 : index * 100;
}

function makeRect(top: number, height: number): DOMRect {
  return { top, bottom: top + height, left: 0, right: 200, width: 200, height, x: 0, y: top, toJSON: () => ({ top, height }) } as DOMRect;
}

function ScrollState() {
  const visibility = useMessageScrollerVisibility();
  const scrollable = useMessageScrollerScrollable();
  const controls = useMessageScroller();
  const [commandResult, setCommandResult] = useState<boolean | null>(null);
  return (
    <>
      <output data-testid="visible-ids">{JSON.stringify(visibility.visibleMessageIds)}</output>
      <output data-testid="scrollable">{JSON.stringify(scrollable)}</output>
      <output data-testid="command-result">{String(commandResult)}</output>
      <button type="button" onClick={() => setCommandResult(controls.scrollToMessage('missing'))}>Jump to absent row</button>
    </>
  );
}

function Transcript({ rows, autoScroll = false, preserveScrollOnPrepend = true, onScroll }: {
  rows: readonly string[];
  autoScroll?: boolean;
  preserveScrollOnPrepend?: boolean;
  onScroll?: ComponentProps<typeof MessageScrollerViewport>['onScroll'];
}) {
  return (
    <MessageScrollerProvider autoScroll={autoScroll}>
      <MessageScroller>
        <MessageScrollerViewport data-fixture-viewport preserveScrollOnPrepend={preserveScrollOnPrepend} {...(onScroll ? { onScroll } : {})} style={{ height: 100, padding: 0, border: 0 }}>
          <MessageScrollerContent data-fixture-content style={{ padding: 0, gap: 0, position: 'relative' }}>
            {rows.map((id) => <MessageScrollerItem key={id} messageId={id} style={{ height: 100, flexShrink: 0 }}>{id}</MessageScrollerItem>)}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
      <ScrollState />
    </MessageScrollerProvider>
  );
}

describe('MessageScroller real-row reader preservation', () => {
  let frames: Map<number, FrameRequestCallback>;
  let frameId: number;
  let resizeObservers: Set<FixtureResizeObserver>;
  let restoreGeometry: () => void;

  class FixtureResizeObserver implements ResizeObserver {
    readonly targets = new Set<Element>();
    readonly sizes = new Map<Element, { width: number; height: number }>();
    constructor(readonly callback: ResizeObserverCallback) { resizeObservers.add(this); }
    observe(target: Element) { this.targets.add(target); }
    unobserve(target: Element) { this.targets.delete(target); this.sizes.delete(target); }
    disconnect() { this.targets.clear(); this.sizes.clear(); resizeObservers.delete(this); }
  }

  beforeEach(() => {
    vi.useFakeTimers();
    frames = new Map();
    frameId = 0;
    resizeObservers = new Set();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.set(++frameId, callback); return frameId; });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    vi.stubGlobal('ResizeObserver', FixtureResizeObserver);

    const prototype = HTMLElement.prototype;
    const names = ['clientHeight', 'scrollHeight', 'scrollTop', 'offsetTop', 'offsetHeight', 'scrollTo', 'getBoundingClientRect'] as const;
    const originals = new Map(names.map((name) => [name, Object.getOwnPropertyDescriptor(prototype, name)]));
    const nativeRect = prototype.getBoundingClientRect;
    const nativeScrollTop = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop');
    const nativeClientHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight');
    const nativeScrollHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
    const nativeOffsetHeight = Object.getOwnPropertyDescriptor(prototype, 'offsetHeight');
    const positions = new WeakMap<HTMLElement, number>();
    const scheduledScrolls = new WeakSet<HTMLElement>();
    const fixtureHeight = (element: HTMLElement): number | undefined => {
      const viewport = viewportFor(element);
      if (!viewport) return undefined;
      if (element === viewport || element.matches(ROW_SELECTOR)) return 100;
      if (element.matches('[data-fixture-content]')) return rowsFor(viewport).length * 100;
      return undefined;
    };
    Object.defineProperties(prototype, {
      clientHeight: { configurable: true, get(this: HTMLElement) { return fixtureHeight(this) ?? (nativeClientHeight?.get?.call(this) ?? 0); } },
      scrollHeight: { configurable: true, get(this: HTMLElement) { return this.matches(VIEWPORT_SELECTOR) ? rowsFor(this).length * 100 : (fixtureHeight(this) ?? nativeScrollHeight?.get?.call(this) ?? 0); } },
      scrollTop: {
        configurable: true,
        get(this: HTMLElement) { return this.matches(VIEWPORT_SELECTOR) ? (positions.get(this) ?? 0) : (nativeScrollTop?.get?.call(this) ?? 0); },
        set(this: HTMLElement, value: number) {
          if (!this.matches(VIEWPORT_SELECTOR)) { nativeScrollTop?.set?.call(this, value); return; }
          const maximum = Math.max(0, this.scrollHeight - this.clientHeight);
          const next = Math.min(maximum, Math.max(0, Number(value)));
          if (next === (positions.get(this) ?? 0)) return;
          positions.set(this, next);
          if (!scheduledScrolls.has(this)) {
            scheduledScrolls.add(this);
            queueMicrotask(() => {
              scheduledScrolls.delete(this);
              if (this.isConnected) this.dispatchEvent(new Event('scroll'));
            });
          }
        },
      },
      offsetTop: { configurable: true, get(this: HTMLElement) { const viewport = viewportFor(this); return viewport ? rowTop(this, viewport) : 0; } },
      offsetHeight: { configurable: true, get(this: HTMLElement) { return fixtureHeight(this) ?? (nativeOffsetHeight?.get?.call(this) ?? 0); } },
      scrollTo: {
        configurable: true,
        value(this: HTMLElement, optionsOrX: ScrollToOptions | number, y?: number) {
          const top = typeof optionsOrX === 'number' ? y : optionsOrX.top;
          if (top !== undefined) this.scrollTop = top;
        },
      },
      getBoundingClientRect: {
        configurable: true,
        value(this: HTMLElement) {
          const viewport = viewportFor(this);
          if (!viewport) return nativeRect.call(this);
          if (this === viewport) return makeRect(40, 100);
          if (this.matches(ROW_SELECTOR)) return makeRect(40 + rowTop(this, viewport) - viewport.scrollTop, 100);
          return makeRect(40 - viewport.scrollTop, viewport.scrollHeight);
        },
      },
    });
    restoreGeometry = () => {
      for (const name of names) {
        const original = originals.get(name);
        if (original) Object.defineProperty(prototype, name, original);
        else delete (prototype as unknown as Record<string, unknown>)[name];
      }
    };
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    restoreGeometry();
  });

  async function settleGeometry() {
    const pendingResize = () => [...resizeObservers].some((observer) => [...observer.targets].some((target) => {
      const rect = target.getBoundingClientRect();
      const previous = observer.sizes.get(target);
      return previous?.width !== rect.width || previous?.height !== rect.height;
    }));
    for (let turn = 0; turn < 20; turn++) {
      await act(async () => {
        await Promise.resolve();
        for (const observer of [...resizeObservers]) {
          const entries: ResizeObserverEntry[] = [];
          for (const target of observer.targets) {
            const rect = target.getBoundingClientRect();
            const previous = observer.sizes.get(target);
            if (previous?.width === rect.width && previous.height === rect.height) continue;
            observer.sizes.set(target, { width: rect.width, height: rect.height });
            const box = { inlineSize: rect.width, blockSize: rect.height };
            entries.push({target, contentRect: makeRect(0, rect.height), borderBoxSize: [box], contentBoxSize: [box], devicePixelContentBoxSize: [box]});
          }
          if (entries.length > 0) observer.callback(entries, observer);
        }
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((callback) => callback(performance.now()));
        await Promise.resolve();
        if (vi.getTimerCount() > 0) await vi.runOnlyPendingTimersAsync();
        await Promise.resolve();
      });
      if (frames.size === 0 && vi.getTimerCount() === 0 && !pendingResize()) {
        await act(async () => { await Promise.resolve(); });
        if (frames.size === 0 && vi.getTimerCount() === 0 && !pendingResize()) return;
      }
    }
    throw new Error('DOM geometry, ResizeObserver, RAF and timers did not settle');
  }

  function getViewport() {
    return screen.getByRole('region', { name: 'Messages' });
  }

  async function readAt(top: number, wheel = false) {
    const viewport = getViewport();
    if (wheel) fireEvent.wheel(viewport, { deltaY: -100 });
    act(() => {
      viewport.scrollTop = top;
    });
    await settleGeometry();
  }

  it('applies its default opening position once when an empty transcript receives rows', async () => {
    const { rerender } = render(<Transcript rows={[]} />);
    await settleGeometry();
    rerender(<Transcript rows={['a', 'b', 'c']} />);
    await settleGeometry();
    expect(getViewport().scrollTop).toBe(200);
    await readAt(50);
    rerender(<Transcript rows={['a', 'b', 'c', 'd']} />);
    await settleGeometry();
    expect(getViewport().scrollTop).toBe(50);
  });

  it('leaves a history reader in place on append with default preservation and autoScroll=false', async () => {
    const { rerender } = render(<Transcript rows={['a', 'b', 'c']} />);
    await settleGeometry();
    await readAt(50);
    expect(screen.getByTestId('visible-ids')).toHaveTextContent('["a","b"]');
    const before = screen.getByTestId('visible-ids').textContent;
    rerender(<Transcript rows={['a', 'b', 'c', 'd']} />);
    await settleGeometry();
    expect(getViewport().scrollTop).toBe(50);
    expect(screen.getByTestId('visible-ids').textContent).toBe(before);
  });

  it('preserves the same visible row and pixel position when history is prepended', async () => {
    const { rerender } = render(<Transcript rows={['a', 'b', 'c']} />);
    await settleGeometry();
    await readAt(150);
    const row = document.querySelector<HTMLElement>('[data-message-id="b"]')!;
    const before = row.getBoundingClientRect().top;
    rerender(<Transcript rows={['older', 'a', 'b', 'c']} />);
    await settleGeometry();
    expect(getViewport().scrollTop).toBe(250);
    expect(row.getBoundingClientRect().top).toBe(before);
    expect(screen.getByTestId('visible-ids')).toHaveTextContent('["b","c"]');
  });

  it('pauses following after wheel and manual scroll while autoScroll is enabled', async () => {
    const { rerender } = render(<Transcript rows={['a', 'b', 'c']} autoScroll preserveScrollOnPrepend={false} />);
    await settleGeometry();
    expect(getViewport().scrollTop).toBe(200);
    await readAt(50, true);
    rerender(<Transcript rows={['a', 'b', 'c', 'd']} autoScroll preserveScrollOnPrepend={false} />);
    await settleGeometry();
    expect(getViewport().scrollTop).toBe(50);
    expect(screen.getByTestId('visible-ids')).toHaveTextContent('["a","b"]');
  });

  it('reports visible message ids in DOM order after reordering stable keyed rows', async () => {
    const { rerender } = render(<Transcript rows={['a', 'b', 'c']} />);
    await settleGeometry();
    await readAt(50);
    expect(screen.getByTestId('visible-ids')).toHaveTextContent('["a","b"]');
    rerender(<Transcript rows={['b', 'a', 'c']} />);
    await settleGeometry();
    await readAt(50);
    expect(screen.getByTestId('visible-ids')).toHaveTextContent('["b","a"]');
  });

  it('preserves caller onScroll and still updates public direction availability', async () => {
    const onScroll = vi.fn();
    render(<Transcript rows={['a', 'b', 'c']} onScroll={onScroll} />);
    await settleGeometry();
    expect(screen.getByTestId('scrollable')).toHaveTextContent('{"start":true,"end":false}');
    onScroll.mockClear();
    await readAt(50);
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('scrollable')).toHaveTextContent('{"start":true,"end":true}');
  });

  it('returns false for an absent mounted message id without changing reader position', async () => {
    render(<Transcript rows={['a', 'b', 'c']} />);
    await settleGeometry();
    await readAt(50);
    fireEvent.click(screen.getByRole('button', { name: 'Jump to absent row' }));
    await settleGeometry();
    expect(screen.getByTestId('command-result')).toHaveTextContent('false');
    expect(getViewport().scrollTop).toBe(50);
  });
});
