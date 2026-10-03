import * as React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DateRange } from 'react-day-picker';
import {
  Calendar,
  ClipboardText,
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  NumberField,
  useComboboxAnchor,
} from '../src/index.js';

afterEach(() => vi.restoreAllMocks());

// These tests exercise the public compounds. A CFUI-only options-array wrapper
// would not satisfy the generic collection/value contract checked here.
type Service = {
  id: string;
  label: string;
  group: 'Compute' | 'Storage';
  disabled?: boolean;
};

const services: Service[] = [
  { id: 'workers', label: 'Workers', group: 'Compute' },
  { id: 'legacy', label: 'Legacy Workers', group: 'Compute', disabled: true },
  { id: 'r2', label: 'R2 Object Storage', group: 'Storage' },
];
const serviceLabel = (service: Service) => service.label;

function ServiceResults({ onSelect }: { onSelect?: (service: Service) => void }) {
  return (
    <>
      <ComboboxEmpty>No services match.</ComboboxEmpty>
      <ComboboxList aria-label="Services">
        {(items: Service[]) => (
          <>
            {(['Compute', 'Storage'] as const).map((group, index) => (
              <React.Fragment key={group}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxGroup aria-labelledby={`services-${group}`}>
                  <ComboboxLabel id={`services-${group}`}>{group}</ComboboxLabel>
                  <ComboboxCollection items={items.filter((item) => item.group === group)}>
                    {(item: Service) => (
                      <ComboboxItem
                        key={item.id}
                        value={item}
                        disabled={item.disabled}
                        onSelect={onSelect}
                      >
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              </React.Fragment>
            ))}
          </>
        )}
      </ComboboxList>
    </>
  );
}

function SingleService({
  initialValue = null,
  acceptChanges = true,
  disabled = false,
  onValueChange = () => undefined,
  onOpenChange,
  onInputValueChange,
  onInputChange,
  onInputKeyDown,
  onSelect,
}: {
  initialValue?: Service | null;
  acceptChanges?: boolean;
  disabled?: boolean;
  onValueChange?: (value: Service | null) => void;
  onOpenChange?: (open: boolean) => void;
  onInputValueChange?: (value: string) => void;
  onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onSelect?: (service: Service) => void;
}) {
  const [value, setValue] = React.useState<Service | null>(initialValue);
  return (
    <Combobox<Service>
      items={services}
      itemToStringValue={serviceLabel}
      value={value}
      disabled={disabled}
      onValueChange={(next: Service | null) => {
        onValueChange(next);
        if (acceptChanges) setValue(next);
      }}
      onOpenChange={onOpenChange}
      onInputValueChange={onInputValueChange}
    >
      <ComboboxInput
        aria-label="Choose service"
        showClear
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
      />
      <ComboboxValue data-testid="selected-service">
        {(selected: Service | null) => selected?.label ?? 'No service selected'}
      </ComboboxValue>
      <ComboboxContent>
        <ServiceResults onSelect={onSelect} />
      </ComboboxContent>
    </Combobox>
  );
}

function MultipleServices({
  initialValue = [],
  disabled = false,
  onValueChange = () => undefined,
}: {
  initialValue?: Service[];
  disabled?: boolean;
  onValueChange?: (value: Service[]) => void;
}) {
  const [value, setValue] = React.useState(initialValue);
  const anchor = useComboboxAnchor();
  return (
    <Combobox<Service>
      items={services}
      itemToStringValue={serviceLabel}
      multiple
      value={value}
      disabled={disabled}
      onValueChange={(next: Service[]) => {
        onValueChange(next);
        setValue(next);
      }}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(selected: Service[]) => selected.map((item) => (
            <ComboboxChip key={item.id} value={item} data-testid={`chip-${item.id}`}>
              {item.label}
            </ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput aria-label="Add service" />
      </ComboboxChips>
      <ComboboxTrigger aria-label="Open service picker">Services</ComboboxTrigger>
      <ComboboxContent anchor={anchor}>
        <ServiceResults />
      </ComboboxContent>
    </Combobox>
  );
}

describe('Combobox generic compound composition', () => {
  it('filters grouped object items and preserves input, popup, and selection callbacks', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const onInputValueChange = vi.fn();
    const onInputChange = vi.fn();
    const onInputKeyDown = vi.fn();
    const onSelect = vi.fn();
    render(
      <SingleService
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
        onInputValueChange={onInputValueChange}
        onInputChange={onInputChange}
        onInputKeyDown={onInputKeyDown}
        onSelect={onSelect}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Choose service' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(await screen.findByRole('group', { name: 'Compute' })).toBeVisible();
    expect(screen.getByRole('group', { name: 'Storage' })).toBeVisible();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: 'Services' })).not.toHaveAttribute('aria-multiselectable', 'true');
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(onInputKeyDown).toHaveBeenCalledOnce();

    await user.type(input, 'Workers');
    expect(onInputChange).toHaveBeenCalledTimes('Workers'.length);
    expect(onInputValueChange).toHaveBeenLastCalledWith('Workers');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('option', { name: 'R2 Object Storage' })).not.toBeInTheDocument();
    const legacy = screen.getByRole('option', { name: 'Legacy Workers' });
    expect(legacy).toHaveAttribute('aria-disabled', 'true');
    // Disabled options are protected by behavior even without loading the CSS.
    fireEvent.click(legacy);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByRole('option', { name: 'Workers' }));
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith(services[0]);
    expect(onValueChange.mock.calls[0][0]).toBe(services[0]);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(services[0]);
    expect(screen.getByTestId('selected-service')).toHaveTextContent('Workers');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('shows an empty result and clears a selected object to null exactly once', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SingleService initialValue={services[0]} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Choose service' });

    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(input).toHaveValue('');
    expect(screen.getByTestId('selected-service')).toHaveTextContent('No service selected');
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

    await user.type(input, 'there-is-no-service');
    expect(await screen.findByText('No services match.')).toBeVisible();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it('keeps controlled selection unchanged when the caller rejects a requested value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SingleService acceptChanges={false} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: /toggle popup/i }));
    await user.click(await screen.findByRole('option', { name: 'R2 Object Storage' }));

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith(services[2]);
    expect(screen.getByTestId('selected-service')).toHaveTextContent('No service selected');
    expect(screen.getByRole('combobox', { name: /service/i })).toHaveValue('');
  });

  it('honors caller cancellation of input keyboard behavior', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onInputKeyDown = vi.fn((event: React.KeyboardEvent<HTMLInputElement>) => event.preventDefault());
    render(<SingleService onInputKeyDown={onInputKeyDown} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('combobox', { name: 'Choose service' }));
    await user.keyboard('{ArrowDown}');

    expect(onInputKeyDown).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects with the keyboard while skipping a disabled option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SingleService onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Choose service' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('option', { name: 'Workers' });
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith(services[2]);
    expect(screen.getByTestId('selected-service')).toHaveTextContent('R2 Object Storage');
    expect(input).toHaveFocus();
  });

  it('selects multiple objects, removes a chip, and removes the last chip with Backspace', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MultipleServices onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox', { name: 'Open service picker' }));
    const list = await screen.findByRole('listbox', { name: 'Services' });
    expect(list).toHaveAttribute('aria-multiselectable', 'true');

    await user.click(within(list).getByRole('option', { name: 'Workers' }));
    expect(onValueChange).toHaveBeenLastCalledWith([services[0]]);
    await user.click(within(list).getByRole('option', { name: 'R2 Object Storage' }));
    expect(onValueChange).toHaveBeenLastCalledWith([services[0], services[2]]);
    expect(within(list).getByRole('option', { name: 'Workers' })).toHaveAttribute('aria-selected', 'true');
    expect(within(list).getByRole('option', { name: 'R2 Object Storage' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('chip-workers')).toHaveTextContent('Workers');
    expect(screen.getByTestId('chip-r2')).toHaveTextContent('R2 Object Storage');

    await user.click(within(screen.getByTestId('chip-workers')).getByRole('button', { name: /remove/i }));
    expect(onValueChange).toHaveBeenLastCalledWith([services[2]]);
    expect(screen.queryByTestId('chip-workers')).not.toBeInTheDocument();
    expect(within(list).getByRole('option', { name: 'Workers' })).toHaveAttribute('aria-selected', 'false');

    const input = screen.getByRole('combobox', { name: 'Add service' });
    await user.click(input);
    await user.keyboard('{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(onValueChange).toHaveBeenCalledTimes(4);
    expect(screen.queryByTestId('chip-r2')).not.toBeInTheDocument();
  });

  it('protects disabled input, popup, clear, and chip-removal actions', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SingleService disabled initialValue={services[0]} onValueChange={onValueChange} />,
    );
    const single = screen.getByRole('combobox', { name: 'Choose service' });
    expect(single).toBeDisabled();
    await user.type(single, 'changed');
    await user.click(screen.getByRole('button', { name: /toggle popup/i }));
    const clear = screen.queryByRole('button', { name: /clear/i });
    if (clear) {
      expect(clear).toBeDisabled();
      await user.click(clear);
    }
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(<MultipleServices disabled initialValue={[services[0]]} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Add service' });
    const trigger = screen.getByRole('combobox', { name: 'Open service picker' });
    expect(input).toBeDisabled();
    expect(trigger).toBeDisabled();
    await user.type(input, 'changed{Backspace}');
    await user.click(trigger);
    const remove = within(screen.getByTestId('chip-workers')).queryByRole('button', { name: /remove/i });
    if (remove) {
      expect(remove).toBeDisabled();
      await user.click(remove);
    }
    expect(screen.getByTestId('chip-workers')).toBeVisible();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

describe('Calendar DayPicker 9 contracts', () => {
  it('selects a controlled range and navigates to the next displayed month', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onMonthChange = vi.fn();
    function RangeCalendar() {
      const [selected, setSelected] = React.useState<DateRange>();
      return (
        <Calendar
          mode="range"
          min={1}
          defaultMonth={new Date(2026, 0, 1)}
          today={new Date(2026, 5, 1)}
          selected={selected}
          onSelect={(range, day, modifiers, event) => {
            onSelect(range, day, modifiers, event);
            setSelected(range);
          }}
          onMonthChange={onMonthChange}
        />
      );
    }
    render(<RangeCalendar />);

    await user.click(screen.getByRole('button', { name: /January 10th, 2026/i }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0]).toEqual({ from: new Date(2026, 0, 10), to: undefined });
    await user.click(screen.getByRole('button', { name: /January 13th, 2026/i }));
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect.mock.calls[1][0]).toEqual({ from: new Date(2026, 0, 10), to: new Date(2026, 0, 13) });
    expect(screen.getByRole('button', { name: /January 10th, 2026, selected/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /January 13th, 2026, selected/i })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /next month/i }));
    expect(onMonthChange).toHaveBeenCalledOnce();
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 1, 1));
    expect(screen.getByText('February 2026')).toBeVisible();
    expect(screen.getByRole('button', { name: /February 10th, 2026/i })).toBeVisible();
    expect(screen.queryByRole('button', { name: /January 10th, 2026/i })).not.toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('never selects a disabled day and forwards the enabled-day selection details', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const blockedDate = new Date(2026, 0, 12);
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 0, 1)}
        today={new Date(2026, 5, 1)}
        disabled={blockedDate}
        onSelect={onSelect}
      />,
    );
    const blocked = screen.getByRole('button', { name: /January 12th, 2026/i });
    expect(blocked).toBeDisabled();
    await user.click(blocked);
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /January 14th, 2026/i }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0]).toEqual(new Date(2026, 0, 14));
    expect(onSelect.mock.calls[0][1]).toEqual(new Date(2026, 0, 14));
    expect(onSelect.mock.calls[0][2]).toEqual(expect.objectContaining({ disabled: false }));
    expect(onSelect.mock.calls[0][3]).toHaveProperty('type', 'click');
  });
});

describe('ClipboardText asynchronous feedback', () => {
  it('exposes failed-copy feedback after rejection and never reports success while pending or failed', async () => {
    const user = userEvent.setup();
    let rejectCopy!: (error: Error) => void;
    const pendingCopy = new Promise<void>((_resolve, reject) => { rejectCopy = reject; });
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockReturnValue(pendingCopy);
    const onCopySuccess = vi.fn();
    const onCopyError = vi.fn();
    const originalExecCommand = Object.getOwnPropertyDescriptor(document, 'execCommand');
    const fallbackCopy = vi.fn(() => false);
    // A legacy fallback is permitted, but this test makes both copy APIs fail.
    Object.defineProperty(document, 'execCommand', { configurable: true, value: fallbackCopy });

    try {
      render(
        <ClipboardText
          text="worker-prod"
          displayText="Worker name"
          onCopySuccess={onCopySuccess}
          onCopyError={onCopyError}
        />,
      );
      expect(writeText).not.toHaveBeenCalled();
      expect(fallbackCopy).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: /copy .*worker-prod.*clipboard/i }));
      expect(writeText).toHaveBeenCalledOnce();
      expect(writeText).toHaveBeenCalledWith('worker-prod');
      expect(onCopySuccess).not.toHaveBeenCalled();
      expect(onCopyError).not.toHaveBeenCalled();
      expect(screen.queryByRole('button', { name: /copied/i })).not.toBeInTheDocument();

      await act(async () => {
        rejectCopy(new Error('Clipboard permission denied'));
        await pendingCopy.catch(() => undefined);
      });
      // Visible labelled error feedback may be an error control/icon or text.
      expect(await screen.findByRole('button', { name: /failed to copy|unable to copy|could not copy/i })).toBeVisible();
      expect(onCopyError).toHaveBeenCalledOnce();
      expect(onCopyError.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(onCopySuccess).not.toHaveBeenCalled();
      expect(screen.queryByRole('button', { name: /copied/i })).not.toBeInTheDocument();
      expect(screen.getByText('Worker name')).toBeVisible();
    } finally {
      if (originalExecCommand) {
        Object.defineProperty(document, 'execCommand', originalExecCommand);
      } else {
        Reflect.deleteProperty(document, 'execCommand');
      }
    }
  });

  it('reports success only after writeText resolves and preserves the caller click handler', async () => {
    const user = userEvent.setup();
    let resolveCopy!: () => void;
    const pendingCopy = new Promise<void>((resolve) => { resolveCopy = resolve; });
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockReturnValue(pendingCopy);
    const onCopySuccess = vi.fn();
    const onCopyError = vi.fn();
    const onClick = vi.fn();
    render(
      <ClipboardText
        text="worker-preview"
        onClick={onClick}
        onCopySuccess={onCopySuccess}
        onCopyError={onCopyError}
      />,
    );
    await user.click(screen.getByRole('button', { name: /copy .*worker-preview.*clipboard/i }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledOnce();
    expect(onCopySuccess).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /copied/i })).not.toBeInTheDocument();

    await act(async () => { resolveCopy(); await pendingCopy; });
    expect(await screen.findByRole('button', { name: /copied.*clipboard/i })).toBeVisible();
    expect(onCopySuccess).toHaveBeenCalledOnce();
    expect(onCopySuccess).toHaveBeenCalledWith('worker-preview');
    expect(onCopyError).not.toHaveBeenCalled();
  });
});

function ControlledNumber({
  initialValue = 1,
  onChange = () => undefined,
}: {
  initialValue?: number;
  onChange?: (value: number) => void;
}) {
  const [value, setValue] = React.useState(initialValue);
  return (
    <NumberField
      label="Replicas"
      value={value}
      min={1}
      max={5}
      step={2}
      onChange={(next) => { onChange(next); setValue(next); }}
    />
  );
}

describe('NumberField controlled numeric interactions', () => {
  it('steps by the configured amount, stops at both bounds, and does not submit a surrounding form', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(<form onSubmit={onSubmit}><ControlledNumber onChange={onChange} /></form>);
    const input = screen.getByRole('spinbutton', { name: 'Replicas' });
    const increase = screen.getByRole('button', { name: /increase|increment/i });
    const decrease = screen.getByRole('button', { name: /decrease|decrement/i });
    expect(input).toHaveAttribute('aria-valuenow', '1');
    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).toHaveAttribute('aria-valuemax', '5');
    expect(decrease).toBeDisabled();

    await user.click(increase);
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(input).toHaveValue('3');
    await user.click(increase);
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(increase).toBeDisabled();
    await user.click(increase);
    expect(onChange).toHaveBeenCalledTimes(2);
    await user.click(decrease);
    await user.click(decrease);
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([3, 5, 3, 1]);
    expect(input).toHaveValue('1');
    expect(decrease).toBeDisabled();
    await user.click(decrease);
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('accepts numeric edits, bounds committed input, and handles empty or invalid drafts without NaN', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledNumber initialValue={3} onChange={onChange} />);
    const input = screen.getByRole('spinbutton', { name: 'Replicas' });

    await user.clear(input);
    await user.type(input, '4');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect(input).toHaveValue('4');

    await user.clear(input);
    await user.type(input, '99');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(input).toHaveValue('5');
    await user.clear(input);
    await user.type(input, '-10');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(input).toHaveValue('1');

    await user.clear(input);
    await user.tab();
    expect(input).toHaveValue('1');
    await user.clear(input);
    await user.type(input, 'not-a-number');
    await user.tab();
    expect(input).toHaveValue('1');
    expect(input).toHaveAttribute('aria-valuenow', '1');
    for (const [value] of onChange.mock.calls) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    }
  });

  it('keeps a controlled value when the caller declines a proposed increment', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberField aria-label="Limit" value={2} min={0} max={10} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /increase|increment/i }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('spinbutton', { name: 'Limit' })).toHaveValue('2');
  });

  it.each(['disabled', 'readOnly'] as const)('does not emit changes from %s buttons, typing, keys, or blur', async (state) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <NumberField
        aria-label="Limit"
        value={3}
        min={1}
        max={5}
        disabled={state === 'disabled'}
        readOnly={state === 'readOnly'}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Limit' });
    const increase = screen.getByRole('button', { name: /increase|increment/i });
    const decrease = screen.getByRole('button', { name: /decrease|decrement/i });
    expect(increase).toBeDisabled();
    expect(decrease).toBeDisabled();
    if (state === 'disabled') {
      expect(input).toBeDisabled();
    } else {
      expect(input).not.toBeDisabled();
      expect(input).toHaveAttribute('readonly');
      await user.click(input);
      expect(input).toHaveFocus();
      await user.keyboard('{ArrowUp}{ArrowDown}');
    }
    await user.type(input, '9');
    await user.click(increase);
    await user.click(decrease);
    await user.tab();

    expect(input).toHaveValue('3');
    expect(onChange).not.toHaveBeenCalled();
  });
});
