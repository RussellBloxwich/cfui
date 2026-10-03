# Changelog

## 0.1.1

- Declare the chart runtime dependency `react-is` explicitly so root imports work after Yarn Classic GitHub installs.

Release tags identify installable GitHub versions. CFUI is currently a `0.x` library; public APIs may change between minor releases.

## 0.1.0

Initial public release.

- 83 React modules spanning actions, fields, selection, overlays, menus, navigation, content, data, dates and charts, dashboard patterns, and messaging.
- Common shadcn-style composition with Radix primitives, native props, and TypeScript declarations.
- Cloudflare-inspired dashboard tokens, light and dark palettes, scoped plain CSS, and a locally served Inter font.
- Root exports, short module subpaths, and `components/ui` subpaths.
- Committed ESM, declarations, stylesheet, and font assets for direct GitHub installation.
- A component gallery, behavior tests, and module coverage inventory.

Compatibility and appearance boundaries are documented in the [getting-started guide](docs/getting-started.md#compatibility-boundaries). Drawer gesture physics and a shadcn registry installer are not included.
