# Component inventory

CFUI provides **83 modules in 11 families**, through **171 export paths**. Every module has short and long imports; providers, hooks, and stores count as modules.

The foundation follows observed Cloudflare dashboard styles. Partial references identify bounded observed appearances; adaptations extend those tokens to other controls. Neither label promises every state or pixel parity. Dark styling uses dashboard CSS tokens without a live dark-dashboard parity claim.

| Family | Modules | Partial appearance reference | Direct behavior tests |
| --- | --- | --- | --- |
| actions | `button`, `button-group`, `badge`, `toggle`, `toggle-group`, `avatar`, `aspect-ratio` | `button`, `badge`, `avatar` | `button`, `button-group`, `toggle`, `toggle-group` |
| fields | `input`, `textarea`, `label`, `field`, `input-group`, `checkbox`, `radio-group`, `switch`, `form`, `search-field`, `input-otp`, `native-select` | `input`, `textarea`, `label`, `checkbox`, `radio-group`, `switch`, `search-field`, `native-select` | `input`, `field`, `input-group`, `search-field` |
| selection | `select`, `combobox`, `command` | `select`, `combobox`, `command` | `select`, `combobox` |
| overlays | `dialog`, `alert-dialog`, `sheet`, `drawer`, `popover`, `hover-card`, `tooltip` | `dialog`, `popover` | `dialog` |
| menus | `dropdown-menu`, `context-menu`, `navigation-menu`, `menubar` | `dropdown-menu` | `dropdown-menu`, `navigation-menu` |
| navigation | `accordion`, `tabs`, `collapsible`, `breadcrumb`, `pagination`, `sidebar`, `toolbar` | `tabs`, `sidebar`, `toolbar` | `accordion`, `tabs`, `pagination`, `sidebar` |
| content | `card`, `alert`, `empty`, `item`, `separator`, `typography`, `kbd`, `spinner`, `skeleton`, `progress` | `card`, `item`, `typography`, `kbd` | — |
| data | `table`, `data-table`, `scroll-area`, `resizable`, `slider`, `carousel`, `toast`, `toaster`, `use-toast` | `table`, `data-table` | `data-table`, `toast`, `toaster`, `use-toast` |
| advanced | `calendar`, `date-picker`, `date-range-picker`, `chart`, `sonner` | `date-picker`, `date-range-picker`, `chart` | `calendar`, `chart` |
| dashboard | `banner`, `surface`, `meter`, `tag-input`, `sensitive-input`, `clipboard-text`, `code`, `table-of-contents`, `number-field`, `top-nav`, `layer-card`, `inline-copy-text` | `surface`, `top-nav`, `layer-card` | `clipboard-text`, `number-field` |
| messaging | `direction`, `attachment`, `bubble`, `message`, `message-scroller`, `marker`, `questionnaire` | — | `message-scroller`, `questionnaire` |

See [component-inventory.json](component-inventory.json) for source paths, imports, appearance notes, and direct test files. Run `npm test` for the current behavior and artifact checks. The gallery demonstrates every module; gallery availability alone is not a complete behavior or appearance test.

Common shadcn-style composition is supported. Exhaustive Base UI prop parity, a registry installer, and Astro components are outside the current package. Drawer uses directional Radix Dialog placement without swipe physics or snap points.
