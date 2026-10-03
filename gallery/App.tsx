import * as React from "react";
import * as UI from "cfui";
import { ArrowSquareOut, CaretRight, Check, Cloud, Code, MagnifyingGlass, Moon, SquaresFour, Sun } from "@phosphor-icons/react";
import { families, moduleCount, type FamilyId } from "./registry.js";
import { ExampleFilterContext } from "./shared.js";
import DashboardExample from "./examples/Dashboard.js";
import { ActionsExamples, ContentExamples, DashboardPatternsExamples } from "./examples/ActionsContentDashboard.js";
import FormsExamples from "./examples/Forms.js";
import OverlaysNavigationExamples from "./examples/OverlaysNavigation.js";
import DataMessagingExamples from "./examples/DataMessaging.js";

type View = "dashboard" | "all" | FamilyId;
const api = UI as unknown as Record<string, unknown>;
function available(names: string[]) { return names.every(name => api[name] !== undefined); }
const allModules = families.flatMap(family => family.modules);
const availableCount = allModules.filter(module => available(module.exports)).length;

export default function App() {
  const initial = new URLSearchParams(window.location.search);
  const [view, setView] = React.useState<View>(() => {
    const value = initial.get("view");
    return value === "all" || value === "dashboard" || families.some(family => family.id === value) ? value as View : "dashboard";
  });
  const [theme, setTheme] = React.useState<"light" | "dark">(initial.get("theme") === "dark" ? "dark" : "light");
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    document.documentElement.dataset.cfuiTheme = theme;
    document.documentElement.style.colorScheme = theme;
    const url = new URL(window.location.href); url.searchParams.set("theme", theme); history.replaceState(null, "", url);
    return () => { delete document.documentElement.dataset.cfuiTheme; document.documentElement.style.colorScheme = ""; };
  }, [theme]);
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setView("all"); window.setTimeout(() => searchRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const navigate = (next: View) => {
    setView(next); setQuery("");
    const url = new URL(window.location.href); url.searchParams.set("view", next); history.replaceState(null, "", url);
    document.getElementById("gallery-main")?.scrollTo({ top: 0 });
  };
  const current = families.find(family => family.id === view);
  const filterModules = React.useMemo(() => current ? new Set(current.modules.map(module => module.id)) : null, [current]);
  const visibleFamilies = (current ? [current] : families).filter(family => !query || `${family.title} ${family.modules.map(module => module.id).join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  return <div className="cfui-theme gallery-app">
    <header className="gallery-header"><a className="gallery-brand" href="#dashboard" onClick={event => { event.preventDefault(); navigate("dashboard"); }}><span className="gallery-brand-mark"><Cloud size={23} weight="fill" /></span><strong>CFUI</strong><span className="gallery-brand-description">Component library</span></a><div className="gallery-header-actions"><span className="gallery-local-badge">Local preview</span><UI.Button variant="outline" size="sm" onClick={() => setTheme(value => value === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>{theme === "light" ? <Moon size={15} /> : <Sun size={15} />}{theme === "light" ? "Dark" : "Light"}</UI.Button><a className="gallery-source-link" href="https://ui.shadcn.com/docs/components" target="_blank" rel="noreferrer">API reference <ArrowSquareOut size={13} /></a></div></header>
    <div className="gallery-layout"><aside className="gallery-sidebar" aria-label="Component families"><div className="gallery-sidebar-caption">Explore</div><button className="gallery-nav" data-active={view === "dashboard"} onClick={() => navigate("dashboard")}><SquaresFour size={16} />Dashboard composition</button><button className="gallery-nav" data-active={view === "all"} onClick={() => navigate("all")}><Code size={16} />All components<span>{moduleCount}</span></button><div className="gallery-sidebar-caption">Component families</div>{families.map(family => <button key={family.id} className="gallery-nav" data-active={view === family.id} onClick={() => navigate(family.id)}>{family.title}<span>{family.modules.length}</span></button>)}<div className="gallery-sidebar-foot"><span><Check size={13} /> Radix primitives</span><span><Check size={13} /> shadcn composition</span><span><Check size={13} /> Plain CSS, local fonts</span></div></aside>
      <main className="gallery-main" id="gallery-main"><div className="gallery-page-heading"><div className="gallery-page-eyebrow">CFUI <CaretRight size={12} /> {view === "dashboard" ? "Composition" : "Components"}</div><div className="gallery-title-row"><div><h1>{view === "dashboard" ? "Built for the dashboard" : current?.title ?? "Component catalog"}</h1><p>{view === "dashboard" ? "Cloudflare’s visual language, packaged as reusable Radix components." : current?.description ?? "Inspect the components, interact with every state, and review the public interfaces."}</p></div>{view === "dashboard" && <UI.Button variant="outline" onClick={() => navigate("all")}>Browse components <CaretRight size={14} /></UI.Button>}</div></div>
        {view === "dashboard" ? <><DashboardExample /><div className="gallery-evidence-notes" id="gallery-token-notes"><div><strong>14 reference states</strong><p>Captured HTML, computed styles, CSS and screenshots across account navigation, Workers, DNS, R2 and the assistant panel.</p></div><div><strong>Observed foundation</strong><p>Typography, surfaces, color tokens and control sizes come from the dashboard. Unobserved patterns adapt that foundation.</p></div><div id="gallery-local-only"><strong>Independent package</strong><p>CFUI uses Radix primitives and shadcn composition. This local gallery contains fabricated data and has no backend.</p></div></div></> : <>
        <div className="gallery-catalog-toolbar" id="catalog"><div className="gallery-catalog-search"><MagnifyingGlass size={16} /><UI.Input ref={searchRef} placeholder="Search component names" aria-label="Search component catalog" value={query} onChange={event => { setQuery(event.target.value); if (view !== "all" && !current) setView("all"); }} /><UI.Kbd>⌘ K</UI.Kbd></div><span>{availableCount} / {moduleCount} module APIs present</span></div>
        <details className="gallery-coverage"><summary>Public export coverage <span>This check does not imply visual or behavioral validation.</span></summary><div className="gallery-coverage-grid">{visibleFamilies.map(family => <section key={family.id}><h2>{family.title}</h2>{family.modules.filter(module => !query || module.id.includes(query.toLowerCase()) || family.title.toLowerCase().includes(query.toLowerCase())).map(module => <div key={module.id} className="gallery-coverage-module" data-ready={available(module.exports)}><span>{available(module.exports) ? "✓" : "!"}</span><code>{module.id}</code>{!available(module.exports) && <small>Missing: {module.exports.filter(name => api[name] === undefined).join(", ")}</small>}</div>)}</section>)}</div></details>
        <ExampleFilterContext.Provider value={{ modules: filterModules, query }}><div className="gallery-examples"><ActionsExamples /><FormsExamples /><OverlaysNavigationExamples /><ContentExamples /><DataMessagingExamples /><DashboardPatternsExamples /></div></ExampleFilterContext.Provider>
        {visibleFamilies.length === 0 && <div className="gallery-no-results">No components match “{query}”.</div>}
        </>}
        <footer className="gallery-footer"><strong>CFUI</strong><span>Light appearance captured from the dashboard. Dark tokens sourced from shipped CSS; component appearance is an adaptation.</span></footer>
      </main>
    </div>
  </div>;
}
