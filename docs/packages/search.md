# @carefully-built/search

Reusable fuzzy search and ranking helpers for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/search
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/search`
- `@carefully-built/search/command-palette`

## Component Usage

```tsx
import { CommandPalette } from '@carefully-built/search';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `CommandPalette`: import from `@carefully-built/search`.

## Helper Usage

```ts
import { buildSearchText } from '@carefully-built/search';
```

Helpers in this package:

- `buildSearchText`
- `filterAndRankBySearch`
- `getCommandPaletteFallbackIconStyle`
- `getCommandPaletteTypeCompletion`
- `moveCommandPaletteIndex`
- `rankBySearch`
- `scoreFuzzyMatch`

## Types And Schemas

- `CommandPaletteFallbackIconStyle`
- `CommandPaletteItemMeta`
- `CommandPaletteProps`
- `CommandPaletteTypeOption`
- `SearchTextPart`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `CommandPalette` | Component | `packages/search/src/command-palette.tsx` |
| `buildSearchText` | Helper | `packages/search/src/index.ts` |
| `filterAndRankBySearch` | Helper | `packages/search/src/index.ts` |
| `getCommandPaletteFallbackIconStyle` | Helper | `packages/search/src/command-palette-fallback.ts` |
| `getCommandPaletteTypeCompletion` | Helper | `packages/search/src/command-palette.tsx` |
| `moveCommandPaletteIndex` | Helper | `packages/search/src/command-palette.tsx` |
| `rankBySearch` | Helper | `packages/search/src/index.ts` |
| `scoreFuzzyMatch` | Helper | `packages/search/src/index.ts` |
| `CommandPaletteFallbackIconStyle` | Type | `packages/search/src/command-palette-fallback.ts` |
| `CommandPaletteItemMeta` | Type | `packages/search/src/command-palette.tsx` |
| `CommandPaletteProps` | Type | `packages/search/src/command-palette.tsx` |
| `CommandPaletteTypeOption` | Type | `packages/search/src/command-palette.tsx` |
| `SearchTextPart` | Type | `packages/search/src/index.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
