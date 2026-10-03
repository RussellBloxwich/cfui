import * as React from "react";

export const ExampleFilterContext = React.createContext<{ modules: Set<string> | null; query: string }>({ modules: null, query: "" });

export type ExampleProps = {
  title: string;
  modules: string[];
  note?: string;
  children: React.ReactNode;
};

class ExampleBoundary extends React.Component<{ children: React.ReactNode; title: string }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  render() {
    if (this.state.error) {
      return <div className="gallery-error" role="alert" data-example-status="error">
        <strong>{this.props.title} needs repair</strong>
        <p>{this.state.error}</p>
        <button type="button" onClick={() => this.setState({ error: null })}>Retry example</button>
      </div>;
    }
    return this.props.children;
  }
}

export function Example({ title, modules, note, children }: ExampleProps) {
  const filter = React.useContext(ExampleFilterContext);
  if (filter.modules && !modules.some(module => filter.modules!.has(module))) return null;
  const search = filter.query.trim().toLowerCase();
  if (search && ![title, ...modules, note ?? ""].join(" ").toLowerCase().includes(search)) return null;
  return <section className="gallery-example" data-modules={modules.join(" ")} aria-label={title}>
    <div className="gallery-example-heading"><h2>{title}</h2><div className="gallery-module-labels">{modules.map(module => <code key={module}>{module}</code>)}</div></div>
    {note && <p className="gallery-example-note">{note}</p>}
    <ExampleBoundary title={title}><div className="gallery-example-body" data-example-status="rendered">{children}</div></ExampleBoundary>
  </section>;
}

export function Result({ children }: { children: React.ReactNode }) {
  return <output className="gallery-result" aria-live="polite">{children}</output>;
}
