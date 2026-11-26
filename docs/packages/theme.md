# @carefully-built/theme

Tailwind v4 design tokens, color presets, and third-party widget styles for Carefully Built apps.

## Install

```bash
bun add @carefully-built/theme
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/theme/base.css`
- `@carefully-built/theme/presets/mono.css`
- `@carefully-built/theme/presets/teal.css`
- `@carefully-built/theme/styles/soft.css`
- `@carefully-built/theme/workos-widgets.css`


## API Catalog

No public exports were detected in `src`.


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
