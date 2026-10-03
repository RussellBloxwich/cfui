# Getting started

CFUI is a React 19 component library with built ESM, TypeScript declarations, and a single plain-CSS stylesheet. No Tailwind configuration or component generation step is required.

## Install a release

Install from the GitHub repository with your preferred package manager:

```sh
npm install github:RussellBloxwich/cfui#v0.1.0
pnpm add github:RussellBloxwich/cfui#v0.1.0
yarn add github:RussellBloxwich/cfui#v0.1.0
bun add github:RussellBloxwich/cfui#v0.1.0
```

Run one of those commands. Your application must also provide `react` and `react-dom` at version 19. Release tags include the built files, so installation does not depend on running CFUI's build scripts. You can substitute a full commit SHA for the tag when you need an immutable Git dependency.

## Load the styles

Import the stylesheet once in your browser entry point or framework's global-CSS entry:

```tsx
import "cfui/styles.css";
```

This loads the tokens, component styles, and local Inter font. Import your application stylesheet after CFUI if it overrides CFUI tokens or classes. `cfui/components.css` is an alias; do not import both.

Wrap your application's typography root in `cfui-theme`:

```tsx
import type { ReactNode } from "react";

export function App({ children }: { children: ReactNode }) {
  return <main className="cfui-theme">{children}</main>;
}
```

The wrapper supplies typography, text color, and box sizing. It does not impose a page layout.

## Import components

All of these imports are supported:

```tsx
import { Button, Input } from "cfui";
import { Dialog, DialogContent } from "cfui/dialog";
import { Badge } from "cfui/components/ui/badge";
```

Use short subpaths when you want an explicit module boundary. The root and subpath exports refer to the same implementations.

## Buttons and native forms

`Button` defaults to `type="button"`. Set `type="submit"` when it submits a form. `Input` keeps native input props, events, and refs; its visual size uses `sizeVariant` so the native numeric `size` attribute remains available.

```tsx
import { Button, Input, Label } from "cfui";

export function ApplicationName({ onSave }: { onSave: (name: string) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSave(String(data.get("name") ?? ""));
      }}
    >
      <Label htmlFor="application-name">Application name</Label>
      <Input id="application-name" name="name" required sizeVariant="sm" />
      <Button type="submit">Save</Button>
    </form>
  );
}
```

Use a native `<form>` even when using CFUI's `Form` helpers. `Form` is the React Hook Form provider; `FormField`, `FormLabel`, and related components compose its fields and messages.

## Compose an accessible dialog

Compound components follow familiar shadcn-style composition. Use `asChild` where supported to avoid nesting interactive elements:

```tsx
import {
  Button, Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "cfui";

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Settings</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Application settings</DialogTitle>
          <DialogDescription>Update settings for this application.</DialogDescription>
        </DialogHeader>
        <p>Your settings controls go here.</p>
        <DialogFooter>
          <DialogClose asChild><Button variant="secondary">Done</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

Radix supplies dialog focus management, dismissal, and trigger restoration. Consumers supply useful labels and descriptions. Controlled dialogs use the Radix `open` and `onOpenChange` props; uncontrolled dialogs can use `defaultOpen`.

## Theming

Light is the default. Set `data-cfui-theme` on the document's `<html>` element to choose a palette:

```html
<html data-cfui-theme="light">
```

```tsx
// Run in browser bootstrap or your theme control.
document.documentElement.setAttribute("data-cfui-theme", "dark");
```

The document-level attribute is important: dialogs, popovers, menus, and notifications may render into `body` instead of inside your app wrapper. A theme attribute only on that wrapper will not automatically reach those portals. CFUI does not manage theme persistence or detect the user's system preference for you.

Use tokens for application surfaces:

```css
.application-shell {
  background: var(--cfui-canvas);
  color: var(--cfui-text);
  font-family: var(--cfui-font-sans);
}

.application-panel {
  background: var(--cfui-base);
  border: 1px solid var(--cfui-line);
  border-radius: var(--cfui-radius-lg);
}
```

Useful token groups include `--cfui-brand`, `--cfui-link`, `--cfui-text`, `--cfui-text-muted`, `--cfui-base`, `--cfui-canvas`, `--cfui-line`, `--cfui-focus`, `--cfui-font-sans`, and `--cfui-radius-*`. Override them after the CFUI stylesheet, with light and dark selectors when both themes need an override.

Styles use `cfui-` classes. The component stylesheet is explicit: importing a JavaScript module does not implicitly load CSS. Native Node ESM imports and server rendering do not need a CSS loader; your browser application still needs the stylesheet.

## Notifications

CFUI offers Sonner and a separate Radix toast system. Choose one store for a given notification flow.

```tsx
import { Button, SonnerToaster, sonnerToast } from "cfui";

export function Notifications() {
  return (
    <>
      <SonnerToaster />
      <Button onClick={() => sonnerToast.success("Application saved")}>Notify</Button>
    </>
  );
}
```

`cfui/sonner` exports Sonner's familiar `Toaster` and `toast` names. At the package root, `Toaster`, `toast`, and `useToast` refer to the separate Radix system. Root `SonnerToaster` and `sonnerToast` avoid that naming collision. `InlineCode` is the dashboard code component; `TypographyInlineCode` is the typography variant.

## Compatibility boundaries

- Common shadcn-style compound APIs, native props and refs, and supported Radix `asChild` composition are the interface baseline. Base UI-specific props and implementation details are not guaranteed.
- CFUI is an installed package, not a shadcn registry or CLI installer.
- `Drawer` is a directional Radix Dialog. It has no swipe physics, snap points, or Vaul gesture API.
- Some modules use specialist libraries for tables, charts, dates, forms, and resizing. Consult their exported TypeScript declarations for supported props.
- Appearance coverage is bounded. Referenced dashboard controls informed the tokens and core styling; unobserved components, states, and responsive variations adapt that foundation. Dark styles have not been exhaustively compared with a live dark Cloudflare dashboard.

See the [component inventory](../INVENTORY.md) for module coverage and the [contribution guide](../CONTRIBUTING.md) for running the gallery and checks.
