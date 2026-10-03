import * as React from 'react';
import * as UI from 'cfui';
import { Example } from '../shared.js';

function SidebarExampleContent({ page }: { page: string }) {
  const { isMobile, openMobile, open } = UI.useSidebar();
  const expanded = isMobile ? openMobile : open;
  return (
    <div className="gallery-stack">
      <UI.SidebarTrigger aria-expanded={expanded} />
      <strong>{page}</strong>
      <p>This content changes with the project navigation.</p>
      <p role="status">Selected section: {page}. {isMobile ? 'Mobile drawer' : 'Desktop sidebar'} is {isMobile ? (expanded ? 'open' : 'closed') : (expanded ? 'expanded' : 'collapsed')}.</p>
    </div>
  );
}

export default function OverlaysNavigationExamples() {
  const dialogNameId = React.useId();
  const sheetNameId = React.useId();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [workName, setWorkName] = React.useState('Improve the storefront');
  const [dialogStatus, setDialogStatus] = React.useState('No changes saved.');
  const [integrationStatus, setIntegrationStatus] = React.useState('Integration is awaiting approval.');
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [reviewer, setReviewer] = React.useState('Alex');
  const [sheetStatus, setSheetStatus] = React.useState('Reviewer: Alex');
  const [drawerStatus, setDrawerStatus] = React.useState('No environment selected.');
  const [popoverStatus, setPopoverStatus] = React.useState('Preview visibility: private');
  const [menuStatus, setMenuStatus] = React.useState('No work action selected.');
  const [activityVisible, setActivityVisible] = React.useState(true);
  const [menuEnvironment, setMenuEnvironment] = React.useState('preview');
  const [contextStatus, setContextStatus] = React.useState('No context action selected.');
  const [contextPinned, setContextPinned] = React.useState(false);
  const [navStatus, setNavStatus] = React.useState('No destination selected.');
  const [menubarStatus, setMenubarStatus] = React.useState('No project action selected.');
  const [showEvidence, setShowEvidence] = React.useState(true);
  const [accordionValue, setAccordionValue] = React.useState('evidence');
  const [tabValue, setTabValue] = React.useState('overview');
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [breadcrumbStatus, setBreadcrumbStatus] = React.useState('Current location: Storefront');
  const [page, setPage] = React.useState(1);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [sidebarPage, setSidebarPage] = React.useState('Overview');
  const [toolbarStatus, setToolbarStatus] = React.useState('No toolbar action selected.');
  const [toolbarView, setToolbarView] = React.useState('list');

  function goToPage(event: React.MouseEvent<HTMLAnchorElement>, nextPage: number) {
    event.preventDefault();
    setPage(Math.max(1, Math.min(3, nextPage)));
  }

  return (
    <>
      <Example title="Dialog" modules={['dialog']} note="Open, submit, cancel, or press Escape. Focus should return to the trigger.">
        <UI.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <UI.DialogTrigger asChild><UI.Button variant="outline">Edit work name</UI.Button></UI.DialogTrigger>
          <UI.DialogContent>
            <UI.DialogHeader>
              <UI.DialogTitle>Edit work name</UI.DialogTitle>
              <UI.DialogDescription>Rename this example work item. Changes stay in this gallery.</UI.DialogDescription>
            </UI.DialogHeader>
            <form className="gallery-stack" onSubmit={(event) => {
              event.preventDefault();
              setDialogStatus(`Saved work name: ${workName.trim()}`);
              setDialogOpen(false);
            }}>
              <UI.Label htmlFor={dialogNameId}>Work name</UI.Label>
              <UI.Input id={dialogNameId} value={workName} onChange={(event) => setWorkName(event.target.value)} required />
              <UI.DialogFooter>
                <UI.DialogClose asChild><UI.Button variant="outline">Cancel</UI.Button></UI.DialogClose>
                <UI.Button type="submit" disabled={!workName.trim()}>Save name</UI.Button>
              </UI.DialogFooter>
            </form>
          </UI.DialogContent>
        </UI.Dialog>
        <p role="status">{dialogStatus}</p>
      </Example>

      <Example title="Alert dialog" modules={['alert-dialog']} note="A deliberate action with distinct cancel and confirm controls.">
        <UI.AlertDialog>
          <UI.AlertDialogTrigger asChild><UI.Button>Authorize integration</UI.Button></UI.AlertDialogTrigger>
          <UI.AlertDialogContent>
            <UI.AlertDialogHeader>
              <UI.AlertDialogTitle>Integrate this work?</UI.AlertDialogTitle>
              <UI.AlertDialogDescription>All validation has passed. This gallery action updates the status below.</UI.AlertDialogDescription>
            </UI.AlertDialogHeader>
            <UI.AlertDialogFooter>
              <UI.AlertDialogCancel>Keep reviewing</UI.AlertDialogCancel>
              <UI.AlertDialogAction onClick={() => setIntegrationStatus('Integration authorized.')}>Authorize integration</UI.AlertDialogAction>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        </UI.AlertDialog>
        <p role="status">{integrationStatus}</p>
      </Example>

      <Example title="Sheet" modules={['sheet']} note="The side panel uses the same accessible dialog composition.">
        <UI.Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <UI.SheetTrigger asChild><UI.Button variant="outline">Manage reviewer</UI.Button></UI.SheetTrigger>
          <UI.SheetContent side="right">
            <UI.SheetHeader>
              <UI.SheetTitle>Work reviewer</UI.SheetTitle>
              <UI.SheetDescription>Choose who validates the evidence before integration.</UI.SheetDescription>
            </UI.SheetHeader>
            <form className="gallery-stack" onSubmit={(event) => {
              event.preventDefault();
              setSheetStatus(`Reviewer: ${reviewer.trim()}`);
              setSheetOpen(false);
            }}>
              <UI.Label htmlFor={sheetNameId}>Reviewer name</UI.Label>
              <UI.Input id={sheetNameId} value={reviewer} onChange={(event) => setReviewer(event.target.value)} required />
              <UI.SheetFooter>
                <UI.SheetClose asChild><UI.Button variant="outline">Cancel</UI.Button></UI.SheetClose>
                <UI.Button type="submit" disabled={!reviewer.trim()}>Save reviewer</UI.Button>
              </UI.SheetFooter>
            </form>
          </UI.SheetContent>
        </UI.Sheet>
        <p role="status">{sheetStatus}</p>
      </Example>

      <Example title="Drawer" modules={['drawer']} note="A bottom dialog presentation. The CFUI Radix port does not imply touch swipe physics.">
        <UI.Drawer>
          <UI.DrawerTrigger asChild><UI.Button variant="outline">Choose environment</UI.Button></UI.DrawerTrigger>
          <UI.DrawerContent>
            <UI.DrawerHeader>
              <UI.DrawerTitle>Preview environment</UI.DrawerTitle>
              <UI.DrawerDescription>Select an example environment for this work deploy.</UI.DrawerDescription>
            </UI.DrawerHeader>
            <div className="gallery-row">
              {['Preview', 'Staging'].map((environment) => (
                <UI.DrawerClose asChild key={environment}>
                  <UI.Button onClick={() => setDrawerStatus(`Selected environment: ${environment}`)}>{environment}</UI.Button>
                </UI.DrawerClose>
              ))}
            </div>
            <UI.DrawerFooter>
              <UI.DrawerClose asChild><UI.Button variant="outline">Cancel</UI.Button></UI.DrawerClose>
            </UI.DrawerFooter>
          </UI.DrawerContent>
        </UI.Drawer>
        <p role="status">{drawerStatus}</p>
      </Example>

      <Example title="Popover" modules={['popover']} note="A compact, dismissible panel anchored to its trigger.">
        <UI.Popover>
          <UI.PopoverTrigger asChild><UI.Button variant="outline">Preview visibility</UI.Button></UI.PopoverTrigger>
          <UI.PopoverContent align="start" aria-label="Preview visibility">
            <div className="gallery-stack">
              <strong>Who can view this preview?</strong>
              <p>Choose a visibility option for the local example.</p>
              <UI.PopoverClose asChild><UI.Button onClick={() => setPopoverStatus('Preview visibility: team')}>Team</UI.Button></UI.PopoverClose>
              <UI.PopoverClose asChild><UI.Button variant="outline" onClick={() => setPopoverStatus('Preview visibility: private')}>Private</UI.Button></UI.PopoverClose>
            </div>
          </UI.PopoverContent>
        </UI.Popover>
        <p role="status">{popoverStatus}</p>
      </Example>

      <Example title="Hover card" modules={['hover-card']} note="Hover or focus the link to inspect supporting context.">
        <UI.HoverCard openDelay={150}>
          <UI.HoverCardTrigger asChild>
            <a href="#reviewer" onClick={(event) => event.preventDefault()}>Alex · reviewer</a>
          </UI.HoverCardTrigger>
          <UI.HoverCardContent>
            <div className="gallery-stack">
              <strong>Alex Morgan</strong>
              <p>Maintainer of the storefront. Reviewing accessibility and checkout evidence.</p>
              <span>Last active: 5 minutes ago</span>
            </div>
          </UI.HoverCardContent>
        </UI.HoverCard>
      </Example>

      <Example title="Tooltip" modules={['tooltip']} note="Hover or focus the button. Escape dismisses the tooltip.">
        <UI.TooltipProvider delayDuration={150}>
          <UI.Tooltip>
            <UI.TooltipTrigger asChild><UI.Button variant="outline">Evidence retention</UI.Button></UI.TooltipTrigger>
            <UI.TooltipContent>Artifacts remain attached to this work item.</UI.TooltipContent>
          </UI.Tooltip>
        </UI.TooltipProvider>
      </Example>

      <Example title="Dropdown menu" modules={['dropdown-menu']} note="Use arrow keys, nested menus, checkboxes, radio items, and disabled actions.">
        <UI.DropdownMenu>
          <UI.DropdownMenuTrigger asChild><UI.Button variant="outline">Work actions</UI.Button></UI.DropdownMenuTrigger>
          <UI.DropdownMenuContent align="start">
            <UI.DropdownMenuLabel>Work item</UI.DropdownMenuLabel>
            <UI.DropdownMenuItem onSelect={() => setMenuStatus('Work link copied in this example.')}>Copy work link</UI.DropdownMenuItem>
            <UI.DropdownMenuSub>
              <UI.DropdownMenuSubTrigger>Move to</UI.DropdownMenuSubTrigger>
              <UI.DropdownMenuPortal>
                <UI.DropdownMenuSubContent>
                  <UI.DropdownMenuItem onSelect={() => setMenuStatus('Moved to In progress.')}>In progress</UI.DropdownMenuItem>
                  <UI.DropdownMenuItem onSelect={() => setMenuStatus('Moved to In review.')}>In review</UI.DropdownMenuItem>
                </UI.DropdownMenuSubContent>
              </UI.DropdownMenuPortal>
            </UI.DropdownMenuSub>
            <UI.DropdownMenuItem disabled>Integrate without approval</UI.DropdownMenuItem>
            <UI.DropdownMenuSeparator />
            <UI.DropdownMenuCheckboxItem checked={activityVisible} onCheckedChange={(checked) => setActivityVisible(checked === true)}>Show activity</UI.DropdownMenuCheckboxItem>
            <UI.DropdownMenuLabel>Environment</UI.DropdownMenuLabel>
            <UI.DropdownMenuRadioGroup value={menuEnvironment} onValueChange={setMenuEnvironment}>
              <UI.DropdownMenuRadioItem value="preview">Preview</UI.DropdownMenuRadioItem>
              <UI.DropdownMenuRadioItem value="staging">Staging</UI.DropdownMenuRadioItem>
            </UI.DropdownMenuRadioGroup>
          </UI.DropdownMenuContent>
        </UI.DropdownMenu>
        <p role="status">{menuStatus} Activity: {activityVisible ? 'visible' : 'hidden'}. Environment: {menuEnvironment}.</p>
      </Example>

      <Example title="Context menu" modules={['context-menu']} note="Right-click the target or focus it and press Shift+F10.">
        <UI.ContextMenu>
          <UI.ContextMenuTrigger asChild><UI.Button variant="outline">Open work context menu</UI.Button></UI.ContextMenuTrigger>
          <UI.ContextMenuContent>
            <UI.ContextMenuLabel>Storefront work</UI.ContextMenuLabel>
            <UI.ContextMenuItem onSelect={() => setContextStatus('Opened evidence in this example.')}>Open evidence</UI.ContextMenuItem>
            <UI.ContextMenuItem onSelect={() => setContextStatus('Work link copied in this example.')}>Copy work link</UI.ContextMenuItem>
            <UI.ContextMenuSeparator />
            <UI.ContextMenuCheckboxItem checked={contextPinned} onCheckedChange={(checked) => setContextPinned(checked === true)}>Pin work</UI.ContextMenuCheckboxItem>
            <UI.ContextMenuItem disabled>Delete integrated work</UI.ContextMenuItem>
          </UI.ContextMenuContent>
        </UI.ContextMenu>
        <p role="status">{contextStatus} Work is {contextPinned ? 'pinned' : 'unpinned'}.</p>
      </Example>

      <Example title="Navigation menu" modules={['navigation-menu']} note="Open a section, then choose a destination without leaving the gallery.">
        <UI.NavigationMenu>
          <UI.NavigationMenuList>
            <UI.NavigationMenuItem>
              <UI.NavigationMenuTrigger>Project</UI.NavigationMenuTrigger>
              <UI.NavigationMenuContent>
                <ul className="gallery-stack">
                  {['Overview', 'Work', 'Repositories'].map((destination) => (
                    <li key={destination}><UI.NavigationMenuLink href={`#project-${destination.toLowerCase()}`} onClick={(event) => {
                      event.preventDefault();
                      setNavStatus(`Selected destination: ${destination}`);
                    }}>{destination}</UI.NavigationMenuLink></li>
                  ))}
                </ul>
              </UI.NavigationMenuContent>
            </UI.NavigationMenuItem>
            <UI.NavigationMenuItem>
              <UI.NavigationMenuLink href="#project-settings" onClick={(event) => {
                event.preventDefault();
                setNavStatus('Selected destination: Settings');
              }}>Settings</UI.NavigationMenuLink>
            </UI.NavigationMenuItem>
          </UI.NavigationMenuList>
        </UI.NavigationMenu>
        <p role="status">{navStatus}</p>
      </Example>

      <Example title="Menubar" modules={['menubar']} note="Desktop-style menus with keyboard navigation and persistent choices.">
        <UI.Menubar>
          <UI.MenubarMenu>
            <UI.MenubarTrigger>Work</UI.MenubarTrigger>
            <UI.MenubarContent>
              <UI.MenubarItem onSelect={() => setMenubarStatus('Created an example work item.')}>New work</UI.MenubarItem>
              <UI.MenubarItem onSelect={() => setMenubarStatus('Opened example work details.')}>Open details</UI.MenubarItem>
              <UI.MenubarSeparator />
              <UI.MenubarItem disabled>Delete integrated work</UI.MenubarItem>
            </UI.MenubarContent>
          </UI.MenubarMenu>
          <UI.MenubarMenu>
            <UI.MenubarTrigger>View</UI.MenubarTrigger>
            <UI.MenubarContent>
              <UI.MenubarCheckboxItem checked={showEvidence} onCheckedChange={(checked) => setShowEvidence(checked === true)}>Show evidence</UI.MenubarCheckboxItem>
              <UI.MenubarSeparator />
              <UI.MenubarSub>
                <UI.MenubarSubTrigger>Layout</UI.MenubarSubTrigger>
                <UI.MenubarSubContent>
                  <UI.MenubarItem onSelect={() => setMenubarStatus('Selected compact layout.')}>Compact</UI.MenubarItem>
                  <UI.MenubarItem onSelect={() => setMenubarStatus('Selected comfortable layout.')}>Comfortable</UI.MenubarItem>
                </UI.MenubarSubContent>
              </UI.MenubarSub>
            </UI.MenubarContent>
          </UI.MenubarMenu>
        </UI.Menubar>
        <p role="status">{menubarStatus} Evidence is {showEvidence ? 'visible' : 'hidden'}.</p>
      </Example>

      <Example title="Accordion" modules={['accordion']} note="One panel at a time; the current panel can also be collapsed.">
        <UI.Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
          <UI.AccordionItem value="evidence">
            <UI.AccordionTrigger>Validation evidence</UI.AccordionTrigger>
            <UI.AccordionContent>12 tests passed. The checkout recording is ready for human review.</UI.AccordionContent>
          </UI.AccordionItem>
          <UI.AccordionItem value="dependencies">
            <UI.AccordionTrigger>Release dependencies</UI.AccordionTrigger>
            <UI.AccordionContent>This example work has no dependencies and can be promoted independently.</UI.AccordionContent>
          </UI.AccordionItem>
          <UI.AccordionItem value="unavailable" disabled>
            <UI.AccordionTrigger>Archived environment</UI.AccordionTrigger>
            <UI.AccordionContent>The archived environment is unavailable.</UI.AccordionContent>
          </UI.AccordionItem>
        </UI.Accordion>
        <p role="status">Open panel: {accordionValue || 'none'}.</p>
      </Example>

      <Example title="Tabs" modules={['tabs']} note="Use arrow keys to move between tabs. Tabs belong to the same work item.">
        <UI.Tabs value={tabValue} onValueChange={setTabValue}>
          <UI.TabsList aria-label="Work panels">
            <UI.TabsTrigger value="overview">Overview</UI.TabsTrigger>
            <UI.TabsTrigger value="evidence">Evidence</UI.TabsTrigger>
            <UI.TabsTrigger value="files">Files</UI.TabsTrigger>
            <UI.TabsTrigger value="unavailable" disabled>Archived</UI.TabsTrigger>
          </UI.TabsList>
          <UI.TabsContent value="overview">Improve the storefront checkout. Assigned to Alex, awaiting review.</UI.TabsContent>
          <UI.TabsContent value="evidence">12 tests passed. Browser recording and build artifacts are attached.</UI.TabsContent>
          <UI.TabsContent value="files">Three changed files across the storefront and shared-components repositories.</UI.TabsContent>
        </UI.Tabs>
        <p role="status">Active tab: {tabValue}.</p>
      </Example>

      <Example title="Collapsible" modules={['collapsible']} note="The trigger exposes its expanded state to assistive technology.">
        <UI.Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <UI.CollapsibleTrigger asChild><UI.Button variant="outline">{detailsOpen ? 'Hide' : 'Show'} additional artifacts</UI.Button></UI.CollapsibleTrigger>
          <UI.CollapsibleContent>
            <ul><li>Checkout browser recording</li><li>Accessibility report</li><li>Build log</li></ul>
          </UI.CollapsibleContent>
        </UI.Collapsible>
        <p role="status">Additional artifacts are {detailsOpen ? 'expanded' : 'collapsed'}.</p>
      </Example>

      <Example title="Breadcrumb" modules={['breadcrumb']}>
        <UI.Breadcrumb>
          <UI.BreadcrumbList>
            <UI.BreadcrumbItem><UI.BreadcrumbLink href="#projects" onClick={(event) => {
              event.preventDefault();
              setBreadcrumbStatus('Selected parent: Projects');
            }}>Projects</UI.BreadcrumbLink></UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem><UI.BreadcrumbLink href="#commerce" onClick={(event) => {
              event.preventDefault();
              setBreadcrumbStatus('Selected parent: Commerce');
            }}>Commerce</UI.BreadcrumbLink></UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem><UI.BreadcrumbPage>Storefront</UI.BreadcrumbPage></UI.BreadcrumbItem>
          </UI.BreadcrumbList>
        </UI.Breadcrumb>
        <p role="status">{breadcrumbStatus}</p>
      </Example>

      <Example title="Pagination" modules={['pagination']} note="The links update a local page and expose the current page.">
        <UI.Pagination>
          <UI.PaginationContent>
            <UI.PaginationItem><UI.PaginationPrevious href={`#page-${Math.max(1, page - 1)}`} aria-disabled={page === 1} onClick={(event) => goToPage(event, page - 1)} /></UI.PaginationItem>
            {[1, 2, 3].map((number) => (
              <UI.PaginationItem key={number}><UI.PaginationLink href={`#page-${number}`} isActive={page === number} onClick={(event) => goToPage(event, number)}>{number}</UI.PaginationLink></UI.PaginationItem>
            ))}
            <UI.PaginationItem><UI.PaginationNext href={`#page-${Math.min(3, page + 1)}`} aria-disabled={page === 3} onClick={(event) => goToPage(event, page + 1)} /></UI.PaginationItem>
          </UI.PaginationContent>
        </UI.Pagination>
        <p role="status">Page {page} of 3 · showing work items {(page - 1) * 10 + 1}–{page * 10}.</p>
      </Example>

      <Example title="Sidebar" modules={['sidebar']} note="This sidebar is bounded inside the example; its choices update the adjacent content.">
        <div style={{ height: 300, overflow: 'hidden' }}>
          <UI.SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} style={{ minHeight: '100%', height: '100%' }}>
            <UI.Sidebar collapsible="icon" style={{ height: '100%' }}>
              <UI.SidebarHeader><strong>Storefront</strong></UI.SidebarHeader>
              <UI.SidebarContent>
                <UI.SidebarGroup>
                  <UI.SidebarGroupLabel>Project</UI.SidebarGroupLabel>
                  <UI.SidebarGroupContent>
                    <UI.SidebarMenu>
                      {['Overview', 'Work', 'Repositories'].map((destination) => (
                        <UI.SidebarMenuItem key={destination}>
                          <UI.SidebarMenuButton isActive={sidebarPage === destination} aria-label={destination} onClick={() => setSidebarPage(destination)}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" /></svg>
                            <span>{destination}</span>
                          </UI.SidebarMenuButton>
                        </UI.SidebarMenuItem>
                      ))}
                    </UI.SidebarMenu>
                  </UI.SidebarGroupContent>
                </UI.SidebarGroup>
              </UI.SidebarContent>
              <UI.SidebarFooter><small>Demo workspace</small></UI.SidebarFooter>
            </UI.Sidebar>
            <SidebarExampleContent page={sidebarPage} />
          </UI.SidebarProvider>
        </div>
      </Example>

      <Example title="Toolbar" modules={['toolbar']} note="Arrow keys move through toolbar controls; the view choice is controlled.">
        <UI.Toolbar aria-label="Work toolbar">
          <UI.ToolbarButton onClick={() => setToolbarStatus('Created an example work item.')}>New work</UI.ToolbarButton>
          <UI.ToolbarButton onClick={() => setToolbarStatus('Refreshed the example work list.')}>Refresh</UI.ToolbarButton>
          <UI.ToolbarSeparator />
          <UI.ToolbarToggleGroup type="single" value={toolbarView} onValueChange={(value) => { if (value) setToolbarView(value); }} aria-label="Work view">
            <UI.ToolbarToggleItem value="list" aria-label="List view">List</UI.ToolbarToggleItem>
            <UI.ToolbarToggleItem value="board" aria-label="Board view">Board</UI.ToolbarToggleItem>
          </UI.ToolbarToggleGroup>
          <UI.ToolbarSeparator />
          <UI.ToolbarLink href="#toolbar-help" onClick={(event) => {
            event.preventDefault();
            setToolbarStatus('Opened toolbar help in this example.');
          }}>Help</UI.ToolbarLink>
        </UI.Toolbar>
        <p role="status">{toolbarStatus} Current view: {toolbarView}.</p>
      </Example>
    </>
  );
}
