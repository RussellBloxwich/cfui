import * as React from "react";
import * as UI from "cfui";
import { ArrowRight, ArrowSquareOut, Check, Cloud, Copy, DownloadSimple, FileText, GearSix, Info, Lightning, Plus, RocketLaunch, WarningCircle } from "@phosphor-icons/react";
import { Example, Result } from "../shared.js";

export function ActionsExamples() {
  const [action, setAction] = React.useState("No action yet");
  const [pressed, setPressed] = React.useState(false);
  const [alignment, setAlignment] = React.useState("left");
  return <>
    <Example title="Button emphasis & control sizes" modules={["button"]} note="Reference targets: default controls 36px, compact controls 26px. Focus a control with Tab to inspect the focus ring.">
      <div className="gallery-stack">
        <div className="gallery-row"><UI.Button onClick={() => setAction("Created a local demo item")}><Plus size={16} />Create item</UI.Button><UI.Button variant="secondary" onClick={() => setAction("Secondary action")}>Secondary</UI.Button><UI.Button variant="outline" onClick={() => setAction("Outlined action")}>Outline</UI.Button><UI.Button variant="ghost" onClick={() => setAction("Ghost action")}>Ghost</UI.Button><UI.Button variant="destructive" onClick={() => setAction("Destructive preview only")}>Delete</UI.Button><UI.Button variant="link" asChild><a href="#catalog">Read documentation <ArrowSquareOut size={14} /></a></UI.Button></div>
        <div className="gallery-row"><UI.Button size="sm" variant="outline" onClick={() => setAction("Compact action")}>Compact</UI.Button><UI.Button>Default</UI.Button><UI.Button size="lg">Large</UI.Button><UI.Button size="icon" variant="outline" aria-label="Settings" onClick={() => setAction("Opened settings preview")}><GearSix size={16} /></UI.Button><UI.Button disabled>Unavailable</UI.Button><UI.Button loading>Saving</UI.Button></div>
        <Result>{action}</Result>
      </div>
    </Example>
    <Example title="Grouped actions & pressed state" modules={["button-group", "toggle", "toggle-group"]}>
      <div className="gallery-stack"><div className="gallery-row"><UI.ButtonGroup><UI.Button variant="outline" onClick={() => setAction("Preview opened")}>Preview</UI.Button><UI.ButtonGroupSeparator /><UI.Button variant="outline" onClick={() => setAction("Downloaded local example")}>Download</UI.Button></UI.ButtonGroup><UI.ButtonGroup><UI.ButtonGroupText>Region</UI.ButtonGroupText><UI.Button variant="outline" onClick={() => setAction("Region: automatic")}>Automatic</UI.Button></UI.ButtonGroup></div>
      <div className="gallery-row"><UI.Toggle aria-label="Pin item" pressed={pressed} onPressedChange={setPressed}>Pin item</UI.Toggle><UI.ToggleGroup type="single" value={alignment} onValueChange={value => value && setAlignment(value)} aria-label="Alignment"><UI.ToggleGroupItem value="left" aria-label="Align left">Left</UI.ToggleGroupItem><UI.ToggleGroupItem value="center" aria-label="Align center">Center</UI.ToggleGroupItem><UI.ToggleGroupItem value="right" aria-label="Align right">Right</UI.ToggleGroupItem></UI.ToggleGroup></div><Result>{pressed ? "Pinned" : "Unpinned"} · {alignment} aligned</Result></div>
    </Example>
    <Example title="Status, identity & aspect ratio" modules={["badge", "avatar", "aspect-ratio"]}>
      <div className="gallery-two"><div className="gallery-stack"><div className="gallery-row"><UI.Badge>Default</UI.Badge><UI.Badge variant="secondary">Queued</UI.Badge><UI.Badge variant="outline">Draft</UI.Badge><UI.Badge variant="success">Healthy</UI.Badge><UI.Badge variant="warning">Attention</UI.Badge><UI.Badge variant="destructive">Failed</UI.Badge></div><div className="gallery-row"><UI.Avatar><UI.AvatarFallback>AL</UI.AvatarFallback></UI.Avatar><UI.Avatar><UI.AvatarImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23dbeafe'/%3E%3Ccircle cx='40' cy='30' r='15' fill='%233b82f6'/%3E%3Cpath d='M12 80a28 28 0 0156 0' fill='%233b82f6'/%3E%3C/svg%3E" alt="Illustrated demo avatar" /><UI.AvatarFallback>Demo</UI.AvatarFallback></UI.Avatar><span>Local artwork; no remote assets</span></div></div><UI.AspectRatio ratio={16 / 9}><div className="gallery-media"><Cloud size={40} /><span>16 : 9 preview</span></div></UI.AspectRatio></div>
    </Example>
  </>;
}

export function ContentExamples() {
  const [progress, setProgress] = React.useState(64);
  return <>
    <Example title="Cards, item rows & separators" modules={["card", "item", "separator"]}>
      <div className="gallery-two"><UI.Card><UI.CardHeader><UI.CardTitle>Build environment</UI.CardTitle><UI.CardDescription>A reusable container for this work.</UI.CardDescription><UI.CardAction><UI.Badge variant="success">Ready</UI.Badge></UI.CardAction></UI.CardHeader><UI.CardContent><p>Start developing, validate the application, and retain evidence.</p><UI.Separator /><p>Last active 2 minutes ago</p></UI.CardContent><UI.CardFooter><UI.Button variant="outline">Open environment <ArrowRight size={14} /></UI.Button></UI.CardFooter></UI.Card><div className="gallery-stack"><UI.Item><UI.ItemMedia><FileText size={20} /></UI.ItemMedia><UI.ItemContent><UI.ItemTitle>Evidence bundle</UI.ItemTitle><UI.ItemDescription>8 checks · 2 screenshots</UI.ItemDescription></UI.ItemContent><UI.ItemAction asChild><UI.Button variant="ghost" size="icon" aria-label="Download evidence"><DownloadSimple size={16} /></UI.Button></UI.ItemAction></UI.Item><UI.Separator /><UI.Item><UI.ItemContent><UI.ItemTitle>Integration authorized</UI.ItemTitle><UI.ItemDescription>Approved by a human after validation.</UI.ItemDescription></UI.ItemContent><UI.ItemAction><Check size={18} /></UI.ItemAction></UI.Item></div></div>
    </Example>
    <Example title="Notices & empty results" modules={["alert", "empty"]}>
      <div className="gallery-two"><div className="gallery-stack"><UI.Alert><Info size={18} /><UI.AlertTitle>Preview environment ready</UI.AlertTitle><UI.AlertDescription>This is a local demonstration; the control does not provision infrastructure.</UI.AlertDescription></UI.Alert><UI.Alert variant="destructive"><WarningCircle size={18} /><UI.AlertTitle>Validation needs attention</UI.AlertTitle><UI.AlertDescription>Open the failed check to inspect the evidence.</UI.AlertDescription></UI.Alert></div><UI.Empty><UI.EmptyMedia><FileText size={28} /></UI.EmptyMedia><UI.EmptyTitle>No deployments yet</UI.EmptyTitle><UI.EmptyDescription>Create an environment to preview changes.</UI.EmptyDescription><UI.EmptyActions><UI.Button variant="outline"><Plus size={16} />Create environment</UI.Button></UI.EmptyActions></UI.Empty></div>
    </Example>
    <Example title="Typography & keyboard hints" modules={["typography", "kbd"]}>
      <div className="gallery-stack"><UI.Typography variant="h1">Workers & Pages</UI.Typography><UI.Typography variant="h2">Project overview</UI.Typography><UI.Typography variant="p">A neutral surface, restrained hierarchy, and enough room to work all day.</UI.Typography><UI.Typography variant="muted">Secondary information stays readable without competing with the action.</UI.Typography><div className="gallery-row"><span>Open search</span><UI.KbdGroup><UI.Kbd>⌘</UI.Kbd><UI.Kbd>K</UI.Kbd></UI.KbdGroup></div></div>
    </Example>
    <Example title="Loading, skeletons & progress" modules={["spinner", "skeleton", "progress"]}>
      <div className="gallery-two"><div className="gallery-stack"><div className="gallery-row"><UI.Spinner aria-label="Loading example" /><span>Retrieving build evidence…</span></div><UI.Skeleton style={{ width: "75%", height: 16 }} /><UI.Skeleton style={{ width: "100%", height: 16 }} /><UI.Skeleton style={{ width: "45%", height: 16 }} /></div><div className="gallery-stack"><UI.Label htmlFor="gallery-progress">Validation progress: {progress}%</UI.Label><UI.Progress id="gallery-progress" value={progress} aria-label="Validation progress" /><div className="gallery-row"><UI.Button size="sm" variant="outline" onClick={() => setProgress(value => Math.max(0, value - 10))}>Decrease</UI.Button><UI.Button size="sm" variant="outline" onClick={() => setProgress(value => Math.min(100, value + 10))}>Advance</UI.Button></div></div></div>
    </Example>
  </>;
}

export function DashboardPatternsExamples() {
  const [tags, setTags] = React.useState(["production", "storefront"]);
  const [capacity, setCapacity] = React.useState(3);
  const [copied, setCopied] = React.useState("Nothing copied yet");
  const [nav, setNav] = React.useState("overview");
  return <>
    <Example title="Banners, surfaces & layer cards" modules={["banner", "surface", "layer-card"]}>
      <div className="gallery-stack"><UI.Banner variant="info" dismissible><UI.BannerIcon><Info size={16} /></UI.BannerIcon><UI.BannerTitle>Review environment available</UI.BannerTitle><UI.BannerDescription>Open the running application before authorizing integration.</UI.BannerDescription><UI.BannerDismiss aria-label="Dismiss review banner" /></UI.Banner><div className="gallery-two"><UI.Surface bordered elevation="base"><UI.SurfaceHeader><UI.SurfaceTitle>Base surface</UI.SurfaceTitle><UI.SurfaceDescription>Primary content at rest.</UI.SurfaceDescription></UI.SurfaceHeader><UI.SurfaceContent>Use consistent borders and spacing to organize the view.</UI.SurfaceContent></UI.Surface><UI.LayerCard bordered elevation="elevated"><UI.LayerCardHeader><UI.LayerCardTitle>Elevated layer</UI.LayerCardTitle><UI.LayerCardDescription>Same composition; a different surface token.</UI.LayerCardDescription></UI.LayerCardHeader><UI.LayerCardContent><UI.Button variant="outline">Inspect layer</UI.Button></UI.LayerCardContent></UI.LayerCard></div></div>
    </Example>
    <Example title="Tags, numeric fields & capacity" modules={["tag-input", "number-field", "meter"]}>
      <div className="gallery-two"><div className="gallery-stack"><UI.Label>Environment tags</UI.Label><UI.TagInput value={tags} onChange={setTags} placeholder="Add tag and press Enter" inputProps={{ "aria-label": "Environment tags" }} /><Result>{tags.length} tags: {tags.join(", ") || "none"}</Result></div><div className="gallery-stack"><UI.NumberField value={capacity} onChange={setCapacity} min={1} max={8} step={1} label="Concurrent builds" aria-label="Concurrent builds" /><UI.Meter value={capacity} min={0} max={8} label="Build capacity" showValue /><Result>{capacity} of 8 build slots</Result></div></div>
    </Example>
    <Example title="Sensitive values & copy actions" modules={["sensitive-input", "clipboard-text", "inline-copy-text"]} note="The value below is fabricated demo text. Revealing it or copying it never accesses credentials.">
      <div className="gallery-stack"><UI.Label htmlFor="gallery-sensitive">Demo value</UI.Label><UI.SensitiveInput id="gallery-sensitive" defaultValue="demo_value_not_a_credential" showCopy /><div className="gallery-row"><UI.ClipboardText text="demo-project-id" onCopySuccess={() => setCopied("Project ID copied")}>demo-project-id</UI.ClipboardText><UI.InlineCopyText text="preview.example.test" onCopySuccess={() => setCopied("Preview hostname copied")}>preview.example.test</UI.InlineCopyText></div><Result>{copied}</Result></div>
    </Example>
    <Example title="Code & page contents" modules={["code", "table-of-contents"]}>
      <div className="gallery-two"><UI.Code filename="example.ts" language="typescript" showLineNumbers code={'export default {\n  async fetch() {\n    return new Response("Hello from the demo");\n  },\n};'} /><UI.TableOfContents title="On this page" items={[{ id: "catalog", title: "Component catalog" }, { id: "gallery-token-notes", title: "Style evidence" }, { id: "gallery-local-only", title: "Local example" }]} /></div>
    </Example>
    <Example title="Top navigation" modules={["top-nav"]}>
      <div className="gallery-stack"><UI.TopNav brand={<strong>Demo project</strong>} activeId={nav} items={[{ id: "overview", label: "Overview" }, { id: "settings", label: "Settings" }, { id: "logs", label: "Logs" }]} onItemSelect={item => item.id && setNav(item.id)} actions={<UI.Button size="sm" variant="outline">Deploy</UI.Button>} /><Result>Selected: {nav}</Result></div>
    </Example>
  </>;
}
