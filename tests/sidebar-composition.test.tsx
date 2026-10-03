import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Sidebar,
  SidebarContent,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '../src/index.js';

function SidebarStatus({ name }: { name: string }) {
  const { state } = useSidebar();
  return <span data-testid={`${name}-state`}>{state}</span>;
}

describe('sidebar state ownership and navigation composition', () => {
  it('returns focus to the mobile sidebar trigger after Escape dismisses its modal', async () => {
    const user = userEvent.setup();
    const widthDescriptor = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('max-width'),
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    }));
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
    const triggerRef = React.createRef<HTMLButtonElement>();
    try {
      render(
        <SidebarProvider>
          <SidebarTrigger ref={triggerRef} aria-label="Open mobile workspace" />
          <Sidebar>
            <SidebarContent>
              <button type="button">Open assigned work</button>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      );
      const trigger = screen.getByRole('button', { name: 'Open mobile workspace' });
      expect(triggerRef.current).toBe(trigger);
      await user.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
      });
    } finally {
      matchMedia.mockRestore();
      if (widthDescriptor) Object.defineProperty(window, 'innerWidth', widthDescriptor);
    }
  });

  it('updates an uncontrolled sidebar when a change observer is supplied and leaves other providers alone', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <>
        <SidebarProvider defaultOpen onOpenChange={onOpenChange}>
          <SidebarStatus name="first" />
          <SidebarTrigger aria-label="Toggle first workspace" />
        </SidebarProvider>
        <SidebarProvider defaultOpen>
          <SidebarStatus name="second" />
          <SidebarTrigger aria-label="Toggle second workspace" />
        </SidebarProvider>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle first workspace' }));
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.getByTestId('first-state')).toHaveTextContent('collapsed');
    expect(screen.getByTestId('second-state')).toHaveTextContent('expanded');
    await user.click(screen.getByRole('button', { name: 'Toggle first workspace' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByTestId('first-state')).toHaveTextContent('expanded');
  });

  it('requests controlled changes while preserving a parent-rejected open value', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const view = (open: boolean) => (
      <SidebarProvider open={open} onOpenChange={onOpenChange}>
        <SidebarStatus name="controlled" />
        <SidebarTrigger aria-label="Toggle controlled workspace" />
      </SidebarProvider>
    );
    const { rerender } = render(view(true));
    await user.click(screen.getByRole('button', { name: 'Toggle controlled workspace' }));
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.getByTestId('controlled-state')).toHaveTextContent('expanded');
    rerender(view(false));
    expect(screen.getByTestId('controlled-state')).toHaveTextContent('collapsed');
  });

  it('composes rail click callbacks and respects a canceled trigger action', async () => {
    const user = userEvent.setup();
    const observeRail = vi.fn();
    const cancelTrigger = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <SidebarProvider defaultOpen>
        <SidebarStatus name="composition" />
        <SidebarTrigger aria-label="Canceled toggle" onClick={cancelTrigger} />
        <SidebarRail aria-label="Workspace rail" onClick={observeRail} />
      </SidebarProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Canceled toggle' }));
    expect(cancelTrigger).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('composition-state')).toHaveTextContent('expanded');
    await user.click(screen.getByRole('button', { name: 'Workspace rail' }));
    expect(observeRail).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('composition-state')).toHaveTextContent('collapsed');
  });

  it('keeps sidebar utility actions out of form submission while allowing an explicit submit button', async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <SidebarProvider>
        <form onSubmit={submit}>
          <SidebarGroupAction aria-label="Add workspace" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Open work</SidebarMenuButton>
              <SidebarMenuAction aria-label="Work actions" />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton type="submit">Save settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </form>
      </SidebarProvider>,
    );
    for (const name of ['Add workspace', 'Open work', 'Work actions']) {
      await user.click(screen.getByRole('button', { name }));
    }
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save settings' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('opens an accordion through the actual slotted button and composes its refs and callbacks', async () => {
    const user = userEvent.setup();
    const outerRef = React.createRef<HTMLButtonElement>();
    const innerRef = React.createRef<HTMLButtonElement>();
    const outerClick = vi.fn();
    const innerClick = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" collapsible onValueChange={onValueChange}>
        <AccordionItem value="evidence">
          <AccordionTrigger asChild ref={outerRef} onClick={outerClick}>
            <button type="button" ref={innerRef} onClick={innerClick}>Review evidence</button>
          </AccordionTrigger>
          <AccordionContent>Validation artifacts</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: 'Review evidence' });
    expect(outerRef.current).toBe(trigger);
    expect(innerRef.current).toBe(trigger);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(outerClick).toHaveBeenCalledTimes(1);
    expect(innerClick).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('evidence');
    expect(screen.getByText('Validation artifacts')).toBeVisible();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('preserves the supplied pagination links and the current-page native anchor ref', async () => {
    const user = userEvent.setup();
    const currentRef = React.createRef<HTMLAnchorElement>();
    const childRef = React.createRef<HTMLAnchorElement>();
    const callerClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const childClick = vi.fn();
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious asChild>
              <a href="?page=1">Older work</a>
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink ref={currentRef} isActive href="?page=2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext asChild onClick={callerClick}>
              <a ref={childRef} href="?page=3" onClick={childClick}>Newer work</a>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    const previous = screen.getByRole('link', { name: 'Go to previous page' });
    const current = screen.getByRole('link', { name: '2' });
    const next = screen.getByRole('link', { name: 'Go to next page' });
    expect(previous).toHaveAttribute('href', '?page=1');
    expect(next).toHaveAttribute('href', '?page=3');
    expect(childRef.current).toBe(next);
    expect(currentRef.current).toBe(current);
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByRole('link')).toHaveLength(3);
    await user.click(next);
    expect(callerClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
  });
});
