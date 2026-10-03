import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  SearchField,
  FieldSet,
  FieldLegend,
  FieldError,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuIndicator,
} from '../src/index.js';

// These are consumer contracts, not snapshots of generated markup or CSS.
// Shared jsdom setup must supply a ResizeObserver that delivers observations
// (NavigationMenuIndicator mounts after measuring), plus requestAnimationFrame.

describe('SearchField clear and native form contracts', () => {
  it('notifies a controlled caller without replacing a rejected value or form value', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onChange = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const inputRef = createRef<HTMLInputElement>();
    render(
      <form aria-label="Controlled search" onSubmit={onSubmit}>
        <SearchField
          ref={inputRef}
          aria-label="Find a project"
          name="query"
          value="locked"
          onChange={(event) => onChange(event.currentTarget.value)}
          onClear={onClear}
        />
      </form>,
    );
    const input = screen.getByRole('searchbox', { name: 'Find a project' });
    const form = screen.getByRole('form', { name: 'Controlled search' }) as HTMLFormElement;
    expect(inputRef.current).toBe(input);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onClear).toHaveBeenCalledExactlyOnceWith();
    expect(input).toHaveValue('locked');
    expect(new FormData(form).get('query')).toBe('locked');
    expect(input).toHaveFocus();
    expect(inputRef.current).toBe(input);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears an accepting value/onChange consumer through its native change callback', async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    function ControlledSearch() {
      const [value, setValue] = useState('notes');
      return (
        <SearchField
          aria-label="Search notes"
          value={value}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            changed(nextValue);
            setValue(nextValue);
          }}
        />
      );
    }
    render(<ControlledSearch />);
    const input = screen.getByRole('searchbox', { name: 'Search notes' });

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(changed).toHaveBeenCalledExactlyOnceWith('');
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('clears an uncontrolled input, keeps its ref and focus, and does not submit', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const inputRef = createRef<HTMLInputElement>();
    render(
      <form aria-label="Project search" onSubmit={onSubmit}>
        <SearchField
          ref={inputRef}
          id="project-search"
          aria-label="Project search query"
          name="query"
          defaultValue="initial"
          data-consumer="project-search"
          onClear={onClear}
        />
      </form>,
    );
    const input = screen.getByRole('searchbox', { name: 'Project search query' });
    const form = screen.getByRole('form', { name: 'Project search' }) as HTMLFormElement;
    expect(input).toHaveValue('initial');
    expect(input).toHaveAttribute('data-consumer', 'project-search');
    expect(new FormData(form).get('query')).toBe('initial');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
    expect(new FormData(form).get('query')).toBe('');
    expect(input).toHaveFocus();
    expect(inputRef.current).toBe(input);
    expect(onClear).toHaveBeenCalledExactlyOnceWith();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not clear or notify from a disabled clear action', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onChange = vi.fn();
    render(<SearchField aria-label="Disabled search" defaultValue="saved" disabled onClear={onClear} onChange={onChange} />);
    const input = screen.getByRole('searchbox', { name: 'Disabled search' });
    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(input).toBeDisabled();
    expect(clear).toBeDisabled();
    await user.click(clear);
    expect(input).toHaveValue('saved');
    expect(onClear).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Field and InputGroup native composition', () => {
  it('renders standard validation errors once and hides an empty error state', () => {
    const errors = [
      { message: 'Repository name is required.' },
      { message: 'Use a unique repository name.' },
      { message: 'Repository name is required.' },
      undefined,
    ];
    const { rerender } = render(<FieldError errors={errors} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Repository name is required.');
    expect(screen.getByRole('alert')).toHaveTextContent('Use a unique repository name.');
    expect(screen.getAllByText('Repository name is required.')).toHaveLength(1);
    rerender(<FieldError errors={[undefined, {}]} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('prioritizes caller content even when validation errors are empty', () => {
    const { rerender } = render(
      <FieldError errors={[{ message: 'Repository name is required.' }]}>
        Choose another repository name.
      </FieldError>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Choose another repository name.');
    expect(screen.queryByText('Repository name is required.')).not.toBeInTheDocument();
    rerender(<FieldError errors={[]}>Ask the repository owner for access.</FieldError>);
    expect(screen.getByRole('alert')).toHaveTextContent('Ask the repository owner for access.');
  });

  it('uses a fieldset and legend for named, disabled native grouping', async () => {
    const user = userEvent.setup();
    const fieldsetRef = createRef<HTMLFieldSetElement>();
    const legendRef = createRef<HTMLLegendElement>();
    render(
      <form aria-label="Contact settings">
        <FieldSet ref={fieldsetRef} disabled data-consumer="contact-group">
          <FieldLegend ref={legendRef}>Contact details</FieldLegend>
          <label htmlFor="contact-email">Email</label>
          <Input id="contact-email" name="email" defaultValue="saved@example.test" />
        </FieldSet>
      </form>,
    );
    const group = screen.getByRole('group', { name: 'Contact details' });
    const input = screen.getByRole('textbox', { name: 'Email' });
    const form = screen.getByRole('form', { name: 'Contact settings' }) as HTMLFormElement;
    expect(group.tagName).toBe('FIELDSET');
    expect(fieldsetRef.current).toBe(group);
    expect(legendRef.current?.tagName).toBe('LEGEND');
    expect(legendRef.current?.parentElement).toBe(group);
    expect(group).toHaveAttribute('data-consumer', 'contact-group');
    expect(input).toBeDisabled();
    await user.type(input, 'changed');
    expect(input).toHaveValue('saved@example.test');
    expect(new FormData(form).has('email')).toBe(false);
  });

  it('preserves textarea form values and refs, and keeps addon actions form-safe', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const textareaRef = createRef<HTMLTextAreaElement>();
    const buttonRef = createRef<HTMLButtonElement>();
    const textRef = createRef<HTMLSpanElement>();
    render(
      <form aria-label="Review note" onSubmit={onSubmit}>
        <label htmlFor="review-note">Review note text</label>
        <InputGroup>
          <InputGroupTextarea ref={textareaRef} id="review-note" name="note" defaultValue="Initial note" />
          <InputGroupAddon align="block-end">
            <InputGroupText ref={textRef}>Markdown supported</InputGroupText>
            <InputGroupButton ref={buttonRef} onClick={onAction}>Format note</InputGroupButton>
            <InputGroupButton type="submit">Save note</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>,
    );
    const textarea = screen.getByRole('textbox', { name: 'Review note text' });
    const action = screen.getByRole('button', { name: 'Format note' });
    const form = screen.getByRole('form', { name: 'Review note' }) as HTMLFormElement;
    expect(textareaRef.current).toBe(textarea);
    expect(buttonRef.current).toBe(action);
    expect(textRef.current).toBe(screen.getByText('Markdown supported'));
    expect(action).toHaveAttribute('type', 'button');
    await user.type(textarea, ' amended');
    expect(new FormData(form).get('note')).toBe('Initial note amended');
    await user.click(action);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save note' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  // Passing the exact align union also supplies a consumer declaration fixture.
  // Placement itself needs browser geometry, not assertions about CSS classes.
  it.each(['inline-start', 'inline-end', 'block-start', 'block-end'] as const)(
    'accepts %s addon composition with control-first DOM and native caller props',
    async (align) => {
      const user = userEvent.setup();
      const groupRef = createRef<HTMLDivElement>();
      const inputRef = createRef<HTMLInputElement>();
      const addonRef = createRef<HTMLDivElement>();
      const onClick = vi.fn();
      render(
        <InputGroup ref={groupRef}>
          <InputGroupInput ref={inputRef} aria-label="Resource name" name="resource" defaultValue="worker" />
          <InputGroupAddon ref={addonRef} align={align} data-consumer="addon" onClick={onClick}>
            <InputGroupText>Resource suffix</InputGroupText>
          </InputGroupAddon>
        </InputGroup>,
      );
      const input = screen.getByRole('textbox', { name: 'Resource name' });
      const addon = screen.getByText('Resource suffix').parentElement;
      expect(inputRef.current).toBe(input);
      expect(addonRef.current).toBe(addon);
      expect(addon).toHaveAttribute('data-consumer', 'addon');
      expect(groupRef.current?.firstElementChild).toBe(input);
      expect(input.nextElementSibling).toBe(addon);
      await user.click(addon!);
      expect(onClick).toHaveBeenCalledTimes(1);
    },
  );
});

describe('decorated DropdownMenu asChild contracts', () => {
  it('slots a checkbox into one caller button and retains callbacks and prevented dismissal', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const childRef = createRef<HTMLButtonElement>();
    const wrapperClick = vi.fn();
    const childClick = vi.fn();
    const checkedChange = vi.fn();
    const selected = vi.fn();
    render(
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild><button type="button">Display options</button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            asChild ref={ref} checked={false} onClick={wrapperClick} onCheckedChange={checkedChange}
            onSelect={(event) => { selected(); event.preventDefault(); }}
            data-consumer="checkbox-item"
          >
            <button type="button" ref={childRef} onClick={childClick}>Show line numbers</button>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const item = await screen.findByRole('menuitemcheckbox', { name: 'Show line numbers' });
    expect(item.tagName).toBe('BUTTON');
    expect(ref.current).toBe(item);
    expect(childRef.current).toBe(item);
    expect(item.querySelector('button')).toBeNull();
    expect(item).toHaveAttribute('data-consumer', 'checkbox-item');
    await user.click(item);
    expect(wrapperClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(selected).toHaveBeenCalledTimes(1);
    expect(checkedChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('menu')).toContainElement(item);
  });

  it('slots a radio into its caller button without overriding a rejected controlled value', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const childRef = createRef<HTMLButtonElement>();
    const childClick = vi.fn();
    const valueChange = vi.fn();
    render(
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild><button type="button">Density options</button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="compact" onValueChange={valueChange}>
            <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
            <DropdownMenuRadioItem asChild ref={ref} value="comfortable" onSelect={(event) => event.preventDefault()}>
              <button type="button" ref={childRef} onClick={childClick}>Comfortable</button>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const item = await screen.findByRole('menuitemradio', { name: 'Comfortable' });
    expect(item.tagName).toBe('BUTTON');
    expect(ref.current).toBe(item);
    expect(childRef.current).toBe(item);
    expect(item.querySelector('button')).toBeNull();
    await user.click(item);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(valueChange).toHaveBeenCalledExactlyOnceWith('comfortable');
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('menuitemradio', { name: 'Compact' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menu')).toContainElement(item);
  });

  it('slots a submenu trigger and retains click and keyboard selection behavior', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const childRef = createRef<HTMLButtonElement>();
    const wrapperClick = vi.fn();
    const childClick = vi.fn();
    const selected = vi.fn();
    render(
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild><button type="button">Project actions</button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger asChild ref={ref} onClick={wrapperClick}>
              <button type="button" ref={childRef} onClick={childClick}>More tools</button>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={selected}>Duplicate project</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = await screen.findByRole('menuitem', { name: 'More tools' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(ref.current).toBe(trigger);
    expect(childRef.current).toBe(trigger);
    expect(trigger.querySelector('button')).toBeNull();
    await user.click(trigger);
    expect(wrapperClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{ArrowRight}');
    const item = await screen.findByRole('menuitem', { name: 'Duplicate project' });
    await waitFor(() => expect(item).toHaveFocus());
    await user.keyboard('{Enter}');
    expect(selected).toHaveBeenCalledTimes(1);
  });
});

describe('NavigationMenu caller-owned elements', () => {
  it('slots its root into one caller nav and forwards refs, native props and handlers', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLElement>();
    const childRef = createRef<HTMLElement>();
    const wrapperClick = vi.fn();
    const childClick = vi.fn();
    render(
      <NavigationMenu asChild ref={ref} onClick={wrapperClick} data-consumer="navigation-root">
        <nav aria-label="Workspace areas" ref={childRef} onClick={childClick}>
          <NavigationMenuList>
            <NavigationMenuItem><NavigationMenuLink href="/reviews">Reviews</NavigationMenuLink></NavigationMenuItem>
          </NavigationMenuList>
        </nav>
      </NavigationMenu>,
    );
    const nav = screen.getByRole('navigation', { name: 'Workspace areas' });
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(nav.tagName).toBe('NAV');
    expect(ref.current).toBe(nav);
    expect(childRef.current).toBe(nav);
    expect(nav).toHaveAttribute('data-consumer', 'navigation-root');
    expect(screen.getByRole('link', { name: 'Reviews' })).toHaveAttribute('href', '/reviews');
    await user.click(nav);
    expect(wrapperClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
  });

  it('slots its decorated trigger and requests a controlled value without forcing it open', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const childRef = createRef<HTMLButtonElement>();
    const wrapperClick = vi.fn();
    const childClick = vi.fn();
    const valueChange = vi.fn();
    render(
      <NavigationMenu value="" onValueChange={valueChange}>
        <NavigationMenuList>
          <NavigationMenuItem value="tools">
            <NavigationMenuTrigger asChild ref={ref} onClick={wrapperClick}>
              <button type="button" ref={childRef} onClick={childClick}>Workspace tools</button>
            </NavigationMenuTrigger>
            <NavigationMenuContent>Available tools</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    const trigger = screen.getByRole('button', { name: 'Workspace tools' });
    expect(ref.current).toBe(trigger);
    expect(childRef.current).toBe(trigger);
    expect(trigger.querySelector('button')).toBeNull();
    await user.click(trigger);
    expect(wrapperClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(valueChange).toHaveBeenCalledExactlyOnceWith('tools');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the caller indicator element instead of replacing its content, ref or handlers', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const childRef = createRef<HTMLDivElement>();
    const wrapperClick = vi.fn();
    const childClick = vi.fn();
    render(
      <NavigationMenu defaultValue="tools">
        <NavigationMenuList>
          <NavigationMenuItem value="tools">
            <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
            <NavigationMenuContent>Tools for the selected project</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator asChild forceMount ref={ref} onClick={wrapperClick}>
          <div ref={childRef} data-testid="caller-indicator" onClick={childClick}>Selected tools</div>
        </NavigationMenuIndicator>
      </NavigationMenu>,
    );
    const indicator = await screen.findByTestId('caller-indicator');
    expect(ref.current).toBe(indicator);
    expect(childRef.current).toBe(indicator);
    expect(indicator).toHaveTextContent('Selected tools');
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    await user.click(indicator);
    expect(wrapperClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
  });
});
