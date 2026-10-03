import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Input,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Toaster,
  toast,
  useToast,
} from '../src/index.js';
import { toast as componentToast } from '../src/components/ui/use-toast.js';

describe('portable leaf controls', () => {
  it('forwards input refs, native form props, validation and controlled change', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    const changed = vi.fn();
    function ControlledInput() {
      const [value, setValue] = React.useState('');
      return <form aria-label="Project settings">
        <label htmlFor="project-name">Project name</label>
        <Input
          ref={ref}
          id="project-name"
          name="project"
          value={value}
          onChange={(event) => { changed(event.currentTarget.value); setValue(event.currentTarget.value); }}
          required
          aria-invalid="true"
          aria-describedby="project-error"
          data-consumer="settings"
        />
        <p id="project-error">Use a unique project name</p>
      </form>;
    }
    render(<ControlledInput />);
    const input = screen.getByRole('textbox', { name: 'Project name' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('data-consumer', 'settings');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Use a unique project name');
    await user.type(input, 'CFUI');
    expect(input).toHaveValue('CFUI');
    expect(changed).toHaveBeenLastCalledWith('CFUI');
    const form = screen.getByRole('form', { name: 'Project settings' }) as HTMLFormElement;
    expect(new FormData(form).get('project')).toBe('CFUI');
  });

  it('composes a single slotted button and preserves both refs and click handlers', async () => {
    const user = userEvent.setup();
    const parentClick = vi.fn();
    const childClick = vi.fn();
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button asChild ref={ref} onClick={parentClick} data-consumer="slotted">
      <button type="button" onClick={childClick}>Open details</button>
    </Button>);
    const button = screen.getByRole('button', { name: 'Open details' });
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('data-consumer', 'slotted');
    await user.click(button);
    expect(parentClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
  });

  it('does not submit a surrounding form for ordinary utility-button activation', async () => {
    const user = userEvent.setup();
    const submitted = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(<form onSubmit={submitted}>
      <Button>Copy code</Button>
      <Button type="submit">Save settings</Button>
    </form>);
    await user.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(submitted).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save settings' }));
    expect(submitted).toHaveBeenCalledTimes(1);
  });

  it('blocks activation of disabled and loading buttons', async () => {
    const user = userEvent.setup();
    const clicked = vi.fn();
    render(<>
      <Button disabled onClick={clicked}>Unavailable</Button>
      <Button loading onClick={clicked}>Saving</Button>
    </>);
    const saving = screen.getByRole('button', { name: 'Saving' });
    expect(saving).toBeDisabled();
    expect(saving).toHaveAttribute('aria-busy', 'true');
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));
    await user.click(saving);
    expect(clicked).not.toHaveBeenCalled();
  });

  it('preserves the disabled contract when Button is slotted onto a link', () => {
    const clicked = vi.fn();
    render(<Button asChild disabled onClick={clicked}>
      <a href="#unavailable">Unavailable environment</a>
    </Button>);
    const link = screen.getByRole('link', { name: 'Unavailable environment' });
    // Programmatic/native activation bypasses pointer-only CSS. The wrapper
    // must protect its event contract and expose disabled semantics as well.
    fireEvent.click(link);
    expect(clicked).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('exposes standard ButtonGroup compounds while keeping caller content intact', () => {
    render(<ButtonGroup aria-label="Pagination controls">
      <Button>Previous</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>Page 2</ButtonGroupText>
      <Button>Next</Button>
    </ButtonGroup>);
    expect(screen.getByRole('group', { name: 'Pagination controls' })).toHaveTextContent('Page 2');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });
});

describe('caller-owned toggle state', () => {
  it('requests a controlled state change without changing an unaccepted value', async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    const { rerender } = render(<Toggle pressed={false} onPressedChange={changed}>Pin work</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Pin work' });
    await user.click(toggle);
    expect(changed).toHaveBeenCalledOnce();
    expect(changed).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    rerender(<Toggle pressed onPressedChange={changed}>Pin work</Toggle>);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('updates multiple selection with original values and skips disabled options', async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    function Filters() {
      const [value, setValue] = React.useState<string[]>([]);
      return <ToggleGroup type="multiple" value={value} onValueChange={(next) => { changed(next); setValue(next); }} aria-label="Work filters">
        <ToggleGroupItem value="assigned">Assigned</ToggleGroupItem>
        <ToggleGroupItem value="incoming" disabled>Incoming</ToggleGroupItem>
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
      </ToggleGroup>;
    }
    render(<Filters />);
    await user.click(screen.getByRole('button', { name: 'Assigned' }));
    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(changed).toHaveBeenLastCalledWith(['assigned', 'active']);
    await user.click(screen.getByRole('button', { name: 'Incoming' }));
    expect(changed).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: 'Assigned' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('functional shared toast wiring', () => {
  afterEach(() => {
    // Dismiss any remaining shared notifications so subsequent consumers do
    // not inherit a visible toast from an earlier acceptance case.
    act(() => toastProbeDismiss?.());
    toastProbeDismiss = undefined;
  });

  let toastProbeDismiss: (() => void) | undefined;

  function ToastProbe() {
    const state = useToast();
    toastProbeDismiss = () => state.dismiss();
    return <output aria-label="Open notifications">{state.toasts.filter((entry) => entry.open !== false).length}</output>;
  }

  it('shares one store between root and module imports, renders updates and dismisses', async () => {
    expect(toast).toBe(componentToast);
    render(<><ToastProbe /><Toaster /></>);
    let receipt: ReturnType<typeof toast>;
    act(() => { receipt = componentToast({ title: 'Work saved', description: 'Draft preserved', duration: 60_000 }); });
    expect(await screen.findByText('Work saved')).toBeVisible();
    expect(screen.getByLabelText('Open notifications')).toHaveTextContent('1');
    act(() => receipt!.update({ id: receipt!.id, title: 'Work validated', description: 'Checks finished' }));
    expect(await screen.findByText('Work validated')).toBeVisible();
    expect(screen.queryByText('Work saved')).not.toBeInTheDocument();
    act(() => receipt!.dismiss());
    await waitFor(() => expect(screen.queryByText('Work validated')).not.toBeInTheDocument());
    expect(screen.getByLabelText('Open notifications')).toHaveTextContent('0');
  });

  it('can enqueue from a real keyboard-activated consumer action', async () => {
    const user = userEvent.setup();
    render(<><ToastProbe /><Button onClick={() => toast({ title: 'Artifact copied', duration: 60_000 })}>Copy artifact</Button><Toaster /></>);
    const button = screen.getByRole('button', { name: 'Copy artifact' });
    button.focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByText('Artifact copied')).toBeVisible();
    expect(screen.getByLabelText('Open notifications')).toHaveTextContent('1');
  });
});
