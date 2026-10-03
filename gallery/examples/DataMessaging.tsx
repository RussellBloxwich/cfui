import * as React from 'react';
import * as UI from 'cfui';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Example } from '../shared.js';

type WorkRow = {
  id: string;
  title: string;
  repository: string;
  status: 'Validated' | 'In progress' | 'Needs review';
  evidence: number;
};

const workRows: WorkRow[] = [
  { id: 'WORK-104', title: 'Improve checkout resilience', repository: 'storefront', status: 'Needs review', evidence: 8 },
  { id: 'WORK-105', title: 'Reduce image payloads', repository: 'storefront', status: 'Validated', evidence: 6 },
  { id: 'WORK-106', title: 'Refresh the search index', repository: 'catalog', status: 'In progress', evidence: 3 },
  { id: 'WORK-107', title: 'Document release permissions', repository: 'platform', status: 'Validated', evidence: 4 },
  { id: 'WORK-108', title: 'Add receipt translations', repository: 'storefront', status: 'Needs review', evidence: 5 },
  { id: 'WORK-109', title: 'Support inventory webhooks', repository: 'catalog', status: 'In progress', evidence: 2 },
];

const chartRows = [
  { day: 'Mon', requests: 180, cached: 110 },
  { day: 'Tue', requests: 260, cached: 180 },
  { day: 'Wed', requests: 230, cached: 160 },
  { day: 'Thu', requests: 340, cached: 260 },
  { day: 'Fri', requests: 390, cached: 300 },
  { day: 'Sat', requests: 310, cached: 240 },
  { day: 'Sun', requests: 370, cached: 290 },
];

const chartConfig = {
  requests: { label: 'Requests', color: 'var(--cfui-brand)' },
  cached: { label: 'Cached', color: 'var(--cfui-success)' },
};

const questionnaireItems = [
  { name: 'environment', required: true },
  { name: 'note', required: false },
] as const;

function TableExamples() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedWork, setSelectedWork] = React.useState('Select a work row to inspect it.');
  const columns = React.useMemo<ColumnDef<WorkRow>[]>(() => [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <UI.Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Work {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : '↕'}
        </UI.Button>
      ),
      cell: ({ row }) => <span><strong>{row.original.title}</strong><br /><small>{row.original.id}</small></span>,
    },
    { accessorKey: 'repository', header: 'Repository' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <UI.Badge variant="outline">{row.original.status}</UI.Badge> },
    {
      accessorKey: 'evidence',
      header: ({ column }) => (
        <UI.Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Evidence {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : '↕'}
        </UI.Button>
      ),
    },
  ], []);

  return <>
    <Example title="Table" modules={['table']}>
      <UI.Table>
        <UI.TableCaption>Synthetic work items ready for human validation.</UI.TableCaption>
        <UI.TableHeader>
          <UI.TableRow><UI.TableHead>Work</UI.TableHead><UI.TableHead>Repository</UI.TableHead><UI.TableHead>Status</UI.TableHead><UI.TableHead>Evidence</UI.TableHead></UI.TableRow>
        </UI.TableHeader>
        <UI.TableBody>
          {workRows.slice(0, 3).map((row) => <UI.TableRow key={row.id}>
            <UI.TableCell>{row.title}</UI.TableCell><UI.TableCell>{row.repository}</UI.TableCell><UI.TableCell><UI.Badge variant="outline">{row.status}</UI.Badge></UI.TableCell><UI.TableCell>{row.evidence} artifacts</UI.TableCell>
          </UI.TableRow>)}
        </UI.TableBody>
        <UI.TableFooter><UI.TableRow><UI.TableCell colSpan={3}>Total shown</UI.TableCell><UI.TableCell>3 work items</UI.TableCell></UI.TableRow></UI.TableFooter>
      </UI.Table>
    </Example>
    <Example title="Sortable data table" modules={['data-table']} note="Sort using the Work and Evidence headers, then move between pages. Records are synthetic.">
      <UI.DataTable columns={columns} data={workRows} sorting={sorting} onSortingChange={setSorting} pageSize={3} showPagination onRowClick={(row) => setSelectedWork(`${row.id}: ${row.title}`)} />
      <p role="status">{selectedWork}</p>
    </Example>
  </>;
}

function LayoutExamples() {
  const [allocation, setAllocation] = React.useState([65]);
  return <>
    <Example title="Scroll area" modules={['scroll-area']}>
      <UI.ScrollArea style={{ height: 180, width: '100%', maxWidth: 520, border: '1px solid var(--cfui-line)', borderRadius: 8 }}>
        <div className="gallery-stack" style={{ padding: 16 }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i}><strong>Validation artifact {String(i + 1).padStart(2, '0')}</strong><p>Recorded checks, screenshots, and a human-readable result.</p><UI.Separator /></div>)}
        </div>
      </UI.ScrollArea>
    </Example>
    <Example title="Resizable workspace" modules={['resizable']} note="Drag the separator or focus it and use the arrow keys. This layout is a CFUI adaptation.">
      <UI.ResizablePanelGroup orientation="horizontal" style={{ height: 190, border: '1px solid var(--cfui-line)', borderRadius: 8 }}>
        <UI.ResizablePanel id="evidence" defaultSize="40%" minSize="20%"><div style={{ padding: 20 }}><strong>Evidence</strong><p>Inspect recorded checks alongside the application.</p></div></UI.ResizablePanel>
        <UI.ResizableHandle withHandle aria-label="Resize evidence and application panels" />
        <UI.ResizablePanel id="application" defaultSize="60%" minSize="20%"><div style={{ padding: 20 }}><strong>Application preview</strong><p>The panel shares the available space.</p></div></UI.ResizablePanel>
      </UI.ResizablePanelGroup>
    </Example>
    <Example title="Slider" modules={['slider']}>
      <div className="gallery-stack" style={{ maxWidth: 480 }}>
        <UI.Label htmlFor="preview-allocation">Preview width: {allocation[0]}%</UI.Label>
        <UI.Slider id="preview-allocation" value={allocation} onValueChange={setAllocation} min={20} max={80} step={5} aria-label="Preview width" />
        <output aria-live="polite">The preview receives {allocation[0]}% of the workspace.</output>
        <UI.Slider defaultValue={[40]} disabled aria-label="Disabled allocation example" />
      </div>
    </Example>
    <Example title="Carousel" modules={['carousel']} note="Use the previous and next controls, or arrow keys when the carousel has focus. Layout is adapted to the CFUI tokens.">
      <UI.Carousel opts={{ align: 'start', loop: false }} style={{ maxWidth: 460, margin: '20px auto', padding: '0 44px' }} tabIndex={0} aria-label="Work evidence carousel">
        <UI.CarouselContent>
          {['Browser validation', 'Accessibility checks', 'Release evidence'].map((title, index) => <UI.CarouselItem key={title}>
            <UI.Card><UI.CardHeader><UI.CardTitle>{title}</UI.CardTitle><UI.CardDescription>Artifact {index + 1} of 3</UI.CardDescription></UI.CardHeader><UI.CardContent><p>A readable summary of the check and its recorded result.</p></UI.CardContent></UI.Card>
          </UI.CarouselItem>)}
        </UI.CarouselContent>
        <UI.CarouselPrevious style={{ left: 0 }} />
        <UI.CarouselNext style={{ right: 0 }} />
      </UI.Carousel>
    </Example>
  </>;
}

function DateChartExamples() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 2));
  const [range, setRange] = React.useState<{ from: Date | undefined; to?: Date } | undefined>({ from: new Date(2026, 9, 1), to: new Date(2026, 9, 7) });
  return <>
    <Example title="Calendar" modules={['calendar']} note="Calendar behavior follows React DayPicker. Its appearance is an adaptation of the captured date-range popover.">
      <UI.Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 9, 1)} disabled={{ before: new Date(2026, 8, 28) }} aria-label="Select a validation date" />
      <p role="status">Selected date: {date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'None'}</p>
    </Example>
    <Example title="Date pickers" modules={['date-picker', 'date-range-picker']} note="Both values are controlled by the gallery. The single-date composition is adapted; the range styling references the dashboard capture.">
      <div className="gallery-row">
        <UI.DatePicker value={date} onValueChange={setDate} aria-label="Validation date" calendarProps={{ defaultMonth: new Date(2026, 9, 1) }} />
        <UI.DateRangePicker value={range} onValueChange={setRange} numberOfMonths={1} aria-label="Metrics date range" calendarProps={{ defaultMonth: new Date(2026, 9, 1) }} presets={[
          { label: 'First week', range: { from: new Date(2026, 9, 1), to: new Date(2026, 9, 7) } },
          { label: 'Second week', range: { from: new Date(2026, 9, 8), to: new Date(2026, 9, 14) } },
        ]} />
      </div>
      <p role="status">Range: {range?.from ? range.from.toLocaleDateString('en-US') : 'None'}{range?.to ? ` – ${range.to.toLocaleDateString('en-US')}` : ''}</p>
    </Example>
    <Example title="Metrics chart" modules={['chart']} note="Synthetic data. The chart is an adaptation of the dashboard metrics styling; no exact chart parity is claimed.">
      <UI.ChartContainer config={chartConfig} style={{ height: 250, width: '100%' }} aria-label="Synthetic request and cache metrics">
        <AreaChart data={chartRows} accessibilityLayer margin={{ top: 16, right: 16, bottom: 0, left: 16 }}>
          <CartesianGrid vertical={false} stroke="var(--cfui-line)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
          <UI.ChartTooltip content={<UI.ChartTooltipContent indicator="line" />} />
          <UI.ChartLegend content={<UI.ChartLegendContent />} />
          <Area dataKey="cached" type="monotone" stroke="var(--color-cached)" fill="var(--color-cached)" fillOpacity={0.12} />
          <Area dataKey="requests" type="monotone" stroke="var(--color-requests)" fill="var(--color-requests)" fillOpacity={0.12} />
        </AreaChart>
      </UI.ChartContainer>
    </Example>
  </>;
}

function NotificationExamples() {
  const { toast, dismiss } = UI.useToast();
  const [feedback, setFeedback] = React.useState('Trigger a notification to inspect its feedback and actions.');
  return <Example title="Notifications" modules={['toast', 'toaster', 'use-toast', 'sonner']} note="Two public notification integrations are shown. Their appearance is a CFUI adaptation; no dashboard toast capture was available.">
    <div className="gallery-row">
      <UI.Button variant="outline" onClick={() => toast({ title: 'Evidence saved', description: 'The local gallery recorded this action.', action: <UI.ToastAction altText="Undo saving the sample evidence" onClick={() => setFeedback('Sample evidence save was undone.')}>Undo</UI.ToastAction> })}>Radix toast</UI.Button>
      <UI.Button variant="outline" onClick={() => UI.sonnerToast.success('Preview is ready', { description: 'This notification uses the Sonner integration.', action: { label: 'Inspect', onClick: () => setFeedback('Opened the sample preview feedback.') } })}>Sonner success</UI.Button>
      <UI.Button variant="outline" onClick={() => UI.sonnerToast.error('A check needs attention', { description: 'This is simulated feedback.' })}>Sonner error</UI.Button>
      <UI.Button variant="ghost" onClick={() => { dismiss(); UI.sonnerToast.dismiss(); setFeedback('Notifications dismissed.'); }}>Dismiss all</UI.Button>
    </div>
    <p role="status">{feedback}</p>
    <UI.Toaster />
    <UI.SonnerToaster position="bottom-left" closeButton />
  </Example>;
}

function AttachmentExamples() {
  const [attachmentFeedback, setAttachmentFeedback] = React.useState('Attachments contain sample metadata only.');
  const [showEvidence, setShowEvidence] = React.useState(true);
  return <Example title="Attachments" modules={['attachment']} note="Attachment states are adaptations for CFUI. The gallery opens local feedback and does not fetch or upload files.">
    <UI.AttachmentGroup>
      {showEvidence && <UI.Attachment state="done">
        <UI.AttachmentTrigger onClick={() => setAttachmentFeedback('Opened sample validation.txt metadata.')}>
          <UI.AttachmentMedia variant="icon"><span aria-hidden="true">▤</span></UI.AttachmentMedia>
          <UI.AttachmentContent><UI.AttachmentTitle>validation.txt</UI.AttachmentTitle><UI.AttachmentDescription>Evidence summary · 4.2 KB</UI.AttachmentDescription></UI.AttachmentContent>
        </UI.AttachmentTrigger>
        <UI.AttachmentActions><UI.AttachmentAction size="sm" aria-label="Remove sample validation attachment" onClick={() => { setShowEvidence(false); setAttachmentFeedback('Removed the sample attachment.'); }}>Remove</UI.AttachmentAction></UI.AttachmentActions>
      </UI.Attachment>}
      <UI.Attachment state="uploading" size="sm"><UI.AttachmentMedia variant="icon"><span aria-hidden="true">▤</span></UI.AttachmentMedia><UI.AttachmentContent><UI.AttachmentTitle progress={65}>screenshot.png</UI.AttachmentTitle><UI.AttachmentDescription>Uploading · 65%</UI.AttachmentDescription></UI.AttachmentContent></UI.Attachment>
      <UI.Attachment state="error" size="sm"><UI.AttachmentMedia variant="icon"><span aria-hidden="true">!</span></UI.AttachmentMedia><UI.AttachmentContent><UI.AttachmentTitle>trace.json</UI.AttachmentTitle><UI.AttachmentDescription>Upload interrupted</UI.AttachmentDescription></UI.AttachmentContent><UI.AttachmentActions><UI.AttachmentAction size="sm" onClick={() => setAttachmentFeedback('Retry requested for the simulated trace attachment.')}>Retry</UI.AttachmentAction></UI.AttachmentActions></UI.Attachment>
    </UI.AttachmentGroup>
    <div className="gallery-row"><UI.Button variant="ghost" size="sm" onClick={() => { setShowEvidence(true); setAttachmentFeedback('Restored the sample validation attachment.'); }}>Reset attachments</UI.Button><span role="status">{attachmentFeedback}</span></div>
  </Example>;
}

function MessageExamples() {
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr');
  const [messages, setMessages] = React.useState([
    { id: 'message-1', align: 'start' as const, name: 'Validation agent', text: 'The checkout checks passed. I attached the evidence for review.' },
    { id: 'message-2', align: 'end' as const, name: 'You', text: 'I’ll inspect the preview before authorizing the release.' },
  ]);
  const [reactions, setReactions] = React.useState(0);
  return <Example title="Messages and scrolling" modules={['direction', 'bubble', 'message', 'message-scroller', 'marker']} note="Chat components are CFUI adaptations using the captured foundation. No exact chat component parity is claimed.">
    <div className="gallery-row">
      <UI.Button variant="outline" size="sm" onClick={() => setDirection((value) => value === 'ltr' ? 'rtl' : 'ltr')}>Direction: {direction.toUpperCase()}</UI.Button>
      <UI.Button variant="outline" size="sm" onClick={() => setMessages((current) => [...current, { id: `message-${current.length + 1}`, align: 'start', name: 'Validation agent', text: `Additional evidence ${current.length - 1} is ready to inspect.` }])}>Append message</UI.Button>
    </div>
    <UI.DirectionProvider direction={direction}>
      <div dir={direction}>
        <UI.MessageScrollerProvider autoScroll defaultScrollPosition="end">
          <UI.MessageScroller style={{ height: 300, border: '1px solid var(--cfui-line)', borderRadius: 8 }}>
            <UI.MessageScrollerViewport style={{ height: 250 }} aria-label="Sample work conversation" tabIndex={0}>
              <UI.MessageScrollerContent className="gallery-stack" style={{ padding: 16 }}>
                <UI.Marker variant="separator"><UI.MarkerIcon>✓</UI.MarkerIcon><UI.MarkerContent>Validation completed</UI.MarkerContent></UI.Marker>
                {messages.map((message) => <UI.MessageScrollerItem key={message.id} messageId={message.id} scrollAnchor>
                  <UI.Message align={message.align}>
                    <UI.MessageAvatar alt={message.name} fallback={message.align === 'start' ? 'VA' : 'YO'} />
                    <UI.MessageContent>
                      <UI.MessageHeader><strong>{message.name}</strong></UI.MessageHeader>
                      <UI.Bubble align={message.align} variant={message.align === 'start' ? 'muted' : 'tinted'}>
                        <UI.BubbleContent>{message.text}</UI.BubbleContent>
                        {message.id === 'message-1' && <UI.BubbleReactions side="bottom" align="start"><UI.Button size="sm" variant="ghost" aria-label="Acknowledge the validation result" onClick={() => setReactions((value) => value + 1)}>✓ {reactions}</UI.Button></UI.BubbleReactions>}
                      </UI.Bubble>
                      <UI.MessageFooter>Just now · Sample conversation</UI.MessageFooter>
                    </UI.MessageContent>
                  </UI.Message>
                </UI.MessageScrollerItem>)}
              </UI.MessageScrollerContent>
            </UI.MessageScrollerViewport>
            <div className="gallery-row" style={{ padding: '4px 12px' }}><UI.MessageScrollerButton direction="start">First message ↑</UI.MessageScrollerButton><UI.MessageScrollerButton direction="end">Latest message ↓</UI.MessageScrollerButton></div>
          </UI.MessageScroller>
        </UI.MessageScrollerProvider>
      </div>
    </UI.DirectionProvider>
  </Example>;
}

function QuestionnaireExample() {
  const [activeItem, setActiveItem] = React.useState('environment');
  const [environmentStatus, setEnvironmentStatus] = React.useState<'unanswered' | 'answered' | 'skipped'>('unanswered');
  const [submission, setSubmission] = React.useState('Choose an environment, then continue.');
  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setSubmission(`Submitted locally: ${String(values.get('environment') || 'none')}${values.get('note') ? ` · ${String(values.get('note'))}` : ' · No additional note'}`);
  }, []);
  return <Example title="Questionnaire" modules={['questionnaire']} note="Required answers, optional steps, keyboard shortcuts, and submission are interactive. This is an adapted CFUI pattern.">
    <UI.Questionnaire items={questionnaireItems} item={activeItem} onItemChange={setActiveItem} shortcuts="letters" onSubmit={handleSubmit} onReset={() => { setActiveItem('environment'); setSubmission('Choose an environment, then continue.'); }} style={{ maxWidth: 600 }}>
      <UI.QuestionnaireProgress aria-label="Release decision progress" />
      <UI.QuestionnaireItem name="environment" required onStatusChange={setEnvironmentStatus}>
        <UI.QuestionnaireTitle>Where should this work be validated?</UI.QuestionnaireTitle>
        <UI.QuestionnaireDescription>Choose one option. Keyboard shortcuts A and B also select a choice.</UI.QuestionnaireDescription>
        <UI.QuestionnaireChoices>
          <UI.QuestionnaireChoice value="preview">Preview environment</UI.QuestionnaireChoice>
          <UI.QuestionnaireChoice value="staging">Staging environment</UI.QuestionnaireChoice>
        </UI.QuestionnaireChoices>
        <UI.QuestionnaireError />
      </UI.QuestionnaireItem>
      <UI.QuestionnaireItem name="note">
        <UI.QuestionnaireTitle>Any context for the reviewer?</UI.QuestionnaireTitle>
        <UI.QuestionnaireDescription>This step is optional.</UI.QuestionnaireDescription>
        <UI.QuestionnaireInput placeholder="Add a review note" aria-label="Review note" />
        <UI.QuestionnaireError />
      </UI.QuestionnaireItem>
      <UI.QuestionnaireActions><UI.QuestionnairePrevious /><UI.QuestionnaireSkip /><UI.QuestionnaireNext /><UI.QuestionnaireSubmit>Submit locally</UI.QuestionnaireSubmit><UI.Button type="reset" variant="ghost" size="sm">Reset</UI.Button></UI.QuestionnaireActions>
    </UI.Questionnaire>
    <p role="status">Environment: {environmentStatus}. {submission}</p>
  </Example>;
}

export default function DataMessagingExamples() {
  return <>
    <TableExamples />
    <LayoutExamples />
    <DateChartExamples />
    <NotificationExamples />
    <AttachmentExamples />
    <MessageExamples />
    <QuestionnaireExample />
  </>;
}
