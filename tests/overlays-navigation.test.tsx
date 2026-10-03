import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../src/index.js';

// Consumer-level contracts: use the package's real components and shared test
// setup. Browser API shims belong in tests/setup.ts, not component mocks here.
describe('Dialog keyboard and focus contracts', () => {
  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])('opens an asChild trigger with %s, contains focus, and restores it on Escape', async (_keyName, key) => {
    const user = userEvent.setup();
    const onTriggerClick = vi.fn();
    const onOpenChange = vi.fn();
    const triggerRef = createRef<HTMLButtonElement>();

    render(
      <>
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger asChild ref={triggerRef}>
            <button type="button" onClick={onTriggerClick}>Review changes</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Review candidate</DialogTitle>
            <DialogDescription>Read the evidence before accepting these changes.</DialogDescription>
            <label htmlFor="review-note">Review note</label>
            <input id="review-note" />
            <button type="button">Save note</button>
            <DialogClose asChild>
              <button type="button">Cancel review</button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <button type="button">Outside action</button>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'Review changes' });
    const outsideAction = screen.getByRole('button', { name: 'Outside action' });
    expect(triggerRef.current).toBe(trigger);
    expect(trigger.querySelector('button')).toBeNull();

    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard(key);

    const dialog = await screen.findByRole('dialog', { name: 'Review candidate' });
    expect(dialog).toHaveAccessibleDescription('Read the evidence before accepting these changes.');
    expect(onTriggerClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    // Exercise several full cycles without assuming the wrapper's close-button
    // placement or the number of controls it adds to the dialog.
    for (let step = 0; step < 12; step += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
      expect(outsideAction).not.toHaveFocus();
    }
    for (let step = 0; step < 12; step += 1) {
      await user.tab({ shift: true });
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
      expect(outsideAction).not.toHaveFocus();
    }

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onTriggerClick).toHaveBeenCalledTimes(1);
  });
});

type EnvironmentSelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
};

function EnvironmentSelect({ value, defaultValue, onValueChange }: EnvironmentSelectProps) {
  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger aria-label="Target environment">
        <SelectValue placeholder="Choose an environment" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="preview">Preview</SelectItem>
        <SelectItem value="staging" disabled>Staging unavailable</SelectItem>
        <SelectItem value="production">Production</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select keyboard and controlled-value contracts', () => {
  it('skips a disabled item and commits a keyboard choice once', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<EnvironmentSelect defaultValue="preview" onValueChange={onValueChange} />);

    const trigger = screen.getByRole('combobox', { name: 'Target environment' });
    expect(trigger).toHaveTextContent('Preview');
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');

    await screen.findByRole('listbox');
    const preview = screen.getByRole('option', { name: 'Preview' });
    const unavailable = screen.getByRole('option', { name: 'Staging unavailable' });
    const production = screen.getByRole('option', { name: 'Production' });
    expect(unavailable).toHaveAttribute('aria-disabled', 'true');
    await waitFor(() => expect(preview).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(production).toHaveFocus());
    expect(unavailable).not.toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent('Production');
      expect(trigger).toHaveFocus();
    });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('production');
  });

  it('requests a controlled change and displays the value supplied later by its parent', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<EnvironmentSelect value="preview" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Target environment' });

    await user.tab();
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Preview' })).toHaveFocus());
    await user.keyboard('{End}');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Production' })).toHaveFocus());
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('production');
    expect(trigger).toHaveTextContent('Preview');

    rerender(<EnvironmentSelect value="production" onValueChange={onValueChange} />);
    expect(trigger).toHaveTextContent('Production');
    expect(onValueChange).toHaveBeenCalledTimes(1);

    await user.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    const production = screen.getByRole('option', { name: 'Production' });
    await waitFor(() => expect(production).toHaveFocus());
    expect(production).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveTextContent('Production');
  });
});

type ReviewTabsProps = {
  value?: string;
  activationMode?: 'automatic' | 'manual';
  onValueChange?: (value: string) => void;
};

function ReviewTabs({ value, activationMode, onValueChange }: ReviewTabsProps) {
  return (
    <Tabs value={value} defaultValue="overview" activationMode={activationMode} onValueChange={onValueChange}>
      <TabsList aria-label="Review sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="checks">Checks</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Summary of the candidate.</TabsContent>
      <TabsContent value="checks">Verification results.</TabsContent>
      <TabsContent value="history">Previous candidate events.</TabsContent>
    </Tabs>
  );
}

function expectRovingTabStop(tabs: HTMLElement[], focusedTab: HTMLElement) {
  for (const tab of tabs) {
    expect(tab).toHaveAttribute('tabindex', tab === focusedTab ? '0' : '-1');
  }
}

describe('Tabs roving focus and activation contracts', () => {
  it('moves with ArrowRight, Home, and End and automatically activates the focused tab', async () => {
    const user = userEvent.setup();
    render(<ReviewTabs activationMode="automatic" />);
    const overview = screen.getByRole('tab', { name: 'Overview' });
    const checks = screen.getByRole('tab', { name: 'Checks' });
    const history = screen.getByRole('tab', { name: 'History' });
    const tabs = [overview, checks, history];

    await user.tab();
    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expectRovingTabStop(tabs, overview);

    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(checks).toHaveFocus());
    expect(checks).toHaveAttribute('aria-selected', 'true');
    expect(overview).toHaveAttribute('aria-selected', 'false');
    expectRovingTabStop(tabs, checks);
    expect(screen.getByRole('tabpanel', { name: 'Checks' })).toHaveTextContent('Verification results.');
    expect(screen.queryByRole('tabpanel', { name: 'Overview' })).not.toBeInTheDocument();

    await user.keyboard('{Home}');
    await waitFor(() => expect(overview).toHaveFocus());
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expectRovingTabStop(tabs, overview);

    await user.keyboard('{End}');
    await waitFor(() => expect(history).toHaveFocus());
    expect(history).toHaveAttribute('aria-selected', 'true');
    expectRovingTabStop(tabs, history);
    expect(screen.getByRole('tabpanel', { name: 'History' })).toHaveTextContent('Previous candidate events.');
  });

  it('keeps manual activation separate from arrow-key focus until Enter or Space', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ReviewTabs activationMode="manual" onValueChange={onValueChange} />);
    const overview = screen.getByRole('tab', { name: 'Overview' });
    const checks = screen.getByRole('tab', { name: 'Checks' });
    const history = screen.getByRole('tab', { name: 'History' });
    const tabs = [overview, checks, history];

    await user.tab();
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(checks).toHaveFocus());
    expectRovingTabStop(tabs, checks);
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(checks).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Summary of the candidate.');
    expect(screen.queryByRole('tabpanel', { name: 'Checks' })).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{End}');
    await waitFor(() => expect(history).toHaveFocus());
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');
    expect(history).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'History' })).toHaveTextContent('Previous candidate events.');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('history');

    await user.keyboard('{Home}');
    await waitFor(() => expect(overview).toHaveFocus());
    expectRovingTabStop(tabs, overview);
    expect(history).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Summary of the candidate.');
    expect(onValueChange).toHaveBeenNthCalledWith(2, 'overview');
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('emits a requested controlled value without overriding its parent', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<ReviewTabs value="overview" onValueChange={onValueChange} />);
    const overview = screen.getByRole('tab', { name: 'Overview' });
    const checks = screen.getByRole('tab', { name: 'Checks' });
    const history = screen.getByRole('tab', { name: 'History' });

    await user.tab();
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(checks).toHaveFocus());
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('checks');
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(checks).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Summary of the candidate.');

    rerender(<ReviewTabs value="history" onValueChange={onValueChange} />);
    expect(history).toHaveAttribute('aria-selected', 'true');
    expect(overview).toHaveAttribute('aria-selected', 'false');
    expect(checks).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel', { name: 'History' })).toHaveTextContent('Previous candidate events.');
    expect(onValueChange).toHaveBeenCalledTimes(1);

    await user.keyboard('{Home}');
    await waitFor(() => expect(overview).toHaveFocus());
    expect(onValueChange).toHaveBeenNthCalledWith(2, 'overview');
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(history).toHaveAttribute('aria-selected', 'true');
    expect(overview).toHaveAttribute('aria-selected', 'false');
  });
});
