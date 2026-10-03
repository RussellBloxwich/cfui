export type FamilyId = "actions" | "fields" | "selection" | "overlays" | "menus" | "navigation" | "content" | "data" | "advanced" | "dashboard" | "messaging";
export type ModuleEntry = { id: string; exports: string[] };
export type Family = { id: FamilyId; title: string; description: string; modules: ModuleEntry[] };
const entry = (id: string, ...exports: string[]): ModuleEntry => ({ id, exports });

// Export checks are observable API coverage; they do not claim behavioral or visual validation.
export const families: Family[] = [
  { id: "actions", title: "Actions & identity", description: "Control sizes, emphasis, pressed states, avatars and media proportions.", modules: [
    entry("button", "Button", "buttonVariants"), entry("button-group", "ButtonGroup", "ButtonGroupSeparator", "ButtonGroupText"),
    entry("badge", "Badge"), entry("toggle", "Toggle"), entry("toggle-group", "ToggleGroup", "ToggleGroupItem"),
    entry("avatar", "Avatar", "AvatarImage", "AvatarFallback"), entry("aspect-ratio", "AspectRatio"),
  ] },
  { id: "fields", title: "Fields & forms", description: "Native input behavior, validation, labels, grouped controls and selection states.", modules: [
    entry("input", "Input"), entry("textarea", "Textarea"), entry("label", "Label"),
    entry("field", "Field", "FieldLabel", "FieldDescription", "FieldError"),
    entry("input-group", "InputGroup", "InputGroupInput", "InputGroupAddon", "InputGroupButton"),
    entry("checkbox", "Checkbox"), entry("radio-group", "RadioGroup", "RadioGroupItem"), entry("switch", "Switch"),
    entry("form", "Form", "FormField", "FormItem", "FormLabel", "FormControl", "FormDescription", "FormMessage"),
    entry("search-field", "SearchField"), entry("input-otp", "InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"),
    entry("native-select", "NativeSelect", "NativeSelectOption", "NativeSelectOptGroup"),
  ] },
  { id: "selection", title: "Search & selection", description: "Portaled selection, typeahead, searchable results and command shortcuts.", modules: [
    entry("select", "Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem"),
    entry("combobox", "Combobox", "ComboboxInput", "ComboboxContent", "ComboboxList", "ComboboxItem", "ComboboxEmpty", "ComboboxChips", "ComboboxChip"),
    entry("command", "Command", "CommandInput", "CommandList", "CommandEmpty", "CommandGroup", "CommandItem"),
  ] },
  { id: "overlays", title: "Overlays & feedback", description: "Focus, Escape, accessible descriptions, layered content and return to trigger.", modules: [
    entry("dialog", "Dialog", "DialogTrigger", "DialogContent", "DialogTitle", "DialogDescription", "DialogClose"),
    entry("alert-dialog", "AlertDialog", "AlertDialogContent", "AlertDialogTitle", "AlertDialogDescription", "AlertDialogAction", "AlertDialogCancel"),
    entry("sheet", "Sheet", "SheetTrigger", "SheetContent", "SheetTitle", "SheetDescription"),
    entry("drawer", "Drawer", "DrawerTrigger", "DrawerContent", "DrawerTitle", "DrawerDescription"),
    entry("popover", "Popover", "PopoverTrigger", "PopoverContent"),
    entry("hover-card", "HoverCard", "HoverCardTrigger", "HoverCardContent"),
    entry("tooltip", "TooltipProvider", "Tooltip", "TooltipTrigger", "TooltipContent"),
  ] },
  { id: "menus", title: "Menus", description: "Roving focus, nested items, checked options, disabled choices and contextual actions.", modules: [
    entry("dropdown-menu", "DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuSub"),
    entry("context-menu", "ContextMenu", "ContextMenuTrigger", "ContextMenuContent", "ContextMenuItem"),
    entry("navigation-menu", "NavigationMenu", "NavigationMenuList", "NavigationMenuItem", "NavigationMenuTrigger", "NavigationMenuContent", "NavigationMenuLink"),
    entry("menubar", "Menubar", "MenubarMenu", "MenubarTrigger", "MenubarContent", "MenubarItem"),
  ] },
  { id: "navigation", title: "Navigation", description: "Single and multiple disclosure, per-view tabs, persistent navigation and compact toolbars.", modules: [
    entry("accordion", "Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"),
    entry("tabs", "Tabs", "TabsList", "TabsTrigger", "TabsContent"), entry("collapsible", "Collapsible", "CollapsibleTrigger", "CollapsibleContent"),
    entry("breadcrumb", "Breadcrumb", "BreadcrumbList", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbPage"),
    entry("pagination", "Pagination", "PaginationContent", "PaginationItem", "PaginationLink", "PaginationNext", "PaginationPrevious"),
    entry("sidebar", "SidebarProvider", "Sidebar", "SidebarTrigger", "SidebarContent", "SidebarMenu", "SidebarMenuButton"),
    entry("toolbar", "Toolbar", "ToolbarButton", "ToolbarToggleGroup", "ToolbarToggleItem"),
  ] },
  { id: "content", title: "Content & states", description: "Surface hierarchy, notices, empty results, list items, loading and typography.", modules: [
    entry("card", "Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"),
    entry("alert", "Alert", "AlertTitle", "AlertDescription"), entry("empty", "Empty", "EmptyTitle", "EmptyDescription"),
    entry("item", "Item", "ItemContent", "ItemTitle", "ItemDescription"), entry("separator", "Separator"),
    entry("typography", "Typography"), entry("kbd", "Kbd", "KbdGroup"), entry("spinner", "Spinner"), entry("skeleton", "Skeleton"), entry("progress", "Progress"),
  ] },
  { id: "data", title: "Data & layout", description: "Tables, sorting, paging, scrolling, split panels, sliders and notification systems.", modules: [
    entry("table", "Table", "TableHeader", "TableBody", "TableRow", "TableHead", "TableCell"),
    entry("data-table", "DataTable"), entry("scroll-area", "ScrollArea", "ScrollBar"),
    entry("resizable", "ResizablePanelGroup", "ResizablePanel", "ResizableHandle"), entry("slider", "Slider"),
    entry("carousel", "Carousel", "CarouselContent", "CarouselItem", "CarouselPrevious", "CarouselNext"),
    entry("toast", "Toast", "ToastProvider", "ToastTitle", "ToastDescription", "ToastAction"), entry("toaster", "Toaster"), entry("use-toast", "toast", "useToast"),
  ] },
  { id: "advanced", title: "Dates & charts", description: "Calendar selection, date range composition, chart legends and a second toast renderer.", modules: [
    entry("calendar", "Calendar"), entry("date-picker", "DatePicker"), entry("date-range-picker", "DateRangePicker"),
    entry("chart", "ChartContainer", "ChartTooltip", "ChartTooltipContent", "ChartLegend", "ChartLegendContent"), entry("sonner", "SonnerToaster", "sonnerToast"),
  ] },
  { id: "dashboard", title: "Dashboard patterns", description: "Reference-led administrative patterns composed from the same token system.", modules: [
    entry("banner", "Banner", "BannerTitle", "BannerDescription", "BannerDismiss"), entry("surface", "Surface", "SurfaceHeader", "SurfaceTitle", "SurfaceContent"),
    entry("meter", "Meter"), entry("tag-input", "TagInput"), entry("sensitive-input", "SensitiveInput"), entry("clipboard-text", "ClipboardText"),
    entry("code", "Code"), entry("table-of-contents", "TableOfContents"), entry("number-field", "NumberField", "NumberFieldInput"),
    entry("top-nav", "TopNav"), entry("layer-card", "LayerCard"), entry("inline-copy-text", "InlineCopyText"),
  ] },
  { id: "messaging", title: "Messaging", description: "Current shadcn compositions adapted to Radix; appearance inferred from the dashboard foundation.", modules: [
    entry("direction", "DirectionProvider", "useDirection"), entry("attachment", "Attachment", "AttachmentMedia", "AttachmentContent", "AttachmentTitle", "AttachmentAction"),
    entry("bubble", "Bubble", "BubbleContent", "BubbleReactions"), entry("message", "Message", "MessageAvatar", "MessageContent", "MessageHeader", "MessageFooter"),
    entry("message-scroller", "MessageScrollerProvider", "MessageScroller", "MessageScrollerViewport", "MessageScrollerContent", "MessageScrollerItem", "MessageScrollerButton"),
    entry("marker", "Marker", "MarkerIcon", "MarkerContent"),
    entry("questionnaire", "Questionnaire", "QuestionnaireItem", "QuestionnaireTitle", "QuestionnaireChoices", "QuestionnaireChoice", "QuestionnaireActions", "QuestionnaireNext", "QuestionnaireSubmit"),
  ] },
];
export const moduleCount = families.reduce((sum, family) => sum + family.modules.length, 0);
