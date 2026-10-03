# Contributing to CFUI

CFUI recreates Cloudflare's dashboard design language through familiar shadcn-style React APIs. Contributions should make the library easier to use, more consistent, or more reliable while preserving that focus.

## Set up

Use Node.js 22.12 or newer. Install the locked dependency tree, build the package, and start the gallery:

```sh
git clone https://github.com/RussellBloxwich/cfui.git
cd cfui
npm ci
npm run build:package
npm run gallery
```

The gallery runs at `http://127.0.0.1:8795/`. `?view=all` opens the catalog; `?theme=dark` selects the dark palette.

## Make a focused change

Component source and scoped CSS live in `src/components/ui/`. Shared tokens live in `src/tokens.css`. Examples live in `gallery/`, and behavior checks live in `tests/`.

- Preserve native props, refs, controlled state, and the established compound APIs.
- Keep styling in scoped plain CSS using the shared tokens. Consumers should not need Tailwind or remote font requests.
- Give interactive examples meaningful labels and descriptions. Check keyboard navigation, focus, disabled states, and both themes when relevant.
- Add behavior tests for meaningful contracts or regressions. Update the gallery when a component gains a public composition.
- Distinguish an observed Cloudflare treatment from a CFUI adaptation. Keep coverage notes accurate; do not claim universal visual parity from one screenshot.
- Do not include account screenshots, identifying dashboard text, credentials, or proprietary assets in issues or contributions.

The package includes a locally served Inter font under its own license. Additional third-party assets or source must include their applicable attribution and license.

## Verify

Run the following checks before opening a pull request:

```sh
npm run typecheck
npm test
npm run build:package
npm run gallery:typecheck
npm run gallery:build
```

Check the affected examples in the browser at a desktop width and a narrow width. For overlays and menus, verify theme inheritance and keyboard behavior.

Built files in `dist/` are committed so users can install directly from GitHub without executing package build scripts. Regenerate them with `npm run build:package` when source or styles change, and include the resulting artifacts in the pull request. Do not edit generated files by hand.

## Open a pull request

Explain the user-visible problem, the resulting behavior, and how you verified it. Include screenshots for visual changes and a small reproduction for behavior fixes. Keep unrelated formatting, dependency updates, and new APIs in separate changes when practical.

For larger components or API changes, start an issue describing the intended composition and use case. Bug reports should include the CFUI version or Git commit, React version, browser, and a minimal example. Remove personal or sensitive information before sharing it.

Contributions are provided under the repository's [MIT license](LICENSE). CFUI is independent and unofficial; contributions must not imply Cloudflare or shadcn/ui endorsement.
