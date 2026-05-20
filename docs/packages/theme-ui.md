# @carefully-built/theme-ui

Reusable SaaS theme, map theme, color, and shape selectors for Carefully Built apps.

## Install

```bash
bun add @carefully-built/theme-ui
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/theme-ui`

## Component Usage

```tsx
import { MapThemeSelector } from '@carefully-built/theme-ui';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `MapThemeSelector`: import from `@carefully-built/theme-ui`.
- `ShapePreviewIcon`: import from `@carefully-built/theme-ui`.
- `ThemeSelector`: import from `@carefully-built/theme-ui`.

## Helper Usage

```ts
import { DEFAULT_MAP_THEME } from '@carefully-built/theme-ui';
```

Helpers in this package:

- `DEFAULT_MAP_THEME`
- `DEFAULT_MAP_THEME`
- `DEFAULT_THEME_OPTIONS`
- `DEFAULT_THEME_OPTIONS`
- `isMapTheme`
- `isMapTheme`
- `MAP_THEME_OPTIONS`
- `MAP_THEME_OPTIONS`
- `MAP_THEME_VALUES`
- `MAP_THEME_VALUES`
- `MapThemeSelector`
- `NAMED_COLOR_OPTIONS`
- `NAMED_COLOR_OPTIONS`
- `NAMED_COLOR_VALUES`
- `NAMED_COLOR_VALUES`
- `normalizeNamedColor`
- `normalizeNamedColor`
- `resolveMapTheme`
- `resolveMapTheme`
- `SHAPE_PREVIEW_SOURCES`
- `SHAPE_PREVIEW_SOURCES`
- `SHAPE_PREVIEW_VALUES`
- `SHAPE_PREVIEW_VALUES`
- `ShapePreviewIcon`
- `THEME_VALUES`
- `THEME_VALUES`
- `ThemeSelector`

## Types And Schemas

- `MapTheme`
- `MapThemeOption`
- `MapThemeSelectorProps`
- `NamedColorOption`
- `SavedMapThemeConfig`
- `ShapePreviewIconProps`
- `ShapePreviewValue`
- `ThemeMode`
- `ThemeOption`
- `ThemeSelectorProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `MapThemeSelector` | Component | `packages/theme-ui/src/map-theme-selector.tsx` |
| `ShapePreviewIcon` | Component | `packages/theme-ui/src/shape-preview-icon.tsx` |
| `ThemeSelector` | Component | `packages/theme-ui/src/theme-selector.tsx` |
| `DEFAULT_MAP_THEME` | Helper | `packages/theme-ui/src/index.ts` |
| `DEFAULT_MAP_THEME` | Helper | `packages/theme-ui/src/map-theme.ts` |
| `DEFAULT_THEME_OPTIONS` | Helper | `packages/theme-ui/src/index.ts` |
| `DEFAULT_THEME_OPTIONS` | Helper | `packages/theme-ui/src/theme-selector.tsx` |
| `isMapTheme` | Helper | `packages/theme-ui/src/index.ts` |
| `isMapTheme` | Helper | `packages/theme-ui/src/map-theme.ts` |
| `MAP_THEME_OPTIONS` | Helper | `packages/theme-ui/src/index.ts` |
| `MAP_THEME_OPTIONS` | Helper | `packages/theme-ui/src/map-theme.ts` |
| `MAP_THEME_VALUES` | Helper | `packages/theme-ui/src/index.ts` |
| `MAP_THEME_VALUES` | Helper | `packages/theme-ui/src/map-theme.ts` |
| `MapThemeSelector` | Helper | `packages/theme-ui/src/index.ts` |
| `NAMED_COLOR_OPTIONS` | Helper | `packages/theme-ui/src/color-options.ts` |
| `NAMED_COLOR_OPTIONS` | Helper | `packages/theme-ui/src/index.ts` |
| `NAMED_COLOR_VALUES` | Helper | `packages/theme-ui/src/color-options.ts` |
| `NAMED_COLOR_VALUES` | Helper | `packages/theme-ui/src/index.ts` |
| `normalizeNamedColor` | Helper | `packages/theme-ui/src/color-options.ts` |
| `normalizeNamedColor` | Helper | `packages/theme-ui/src/index.ts` |
| `resolveMapTheme` | Helper | `packages/theme-ui/src/index.ts` |
| `resolveMapTheme` | Helper | `packages/theme-ui/src/map-theme.ts` |
| `SHAPE_PREVIEW_SOURCES` | Helper | `packages/theme-ui/src/index.ts` |
| `SHAPE_PREVIEW_SOURCES` | Helper | `packages/theme-ui/src/shape-preview-icon.tsx` |
| `SHAPE_PREVIEW_VALUES` | Helper | `packages/theme-ui/src/index.ts` |
| `SHAPE_PREVIEW_VALUES` | Helper | `packages/theme-ui/src/shape-preview-icon.tsx` |
| `ShapePreviewIcon` | Helper | `packages/theme-ui/src/index.ts` |
| `THEME_VALUES` | Helper | `packages/theme-ui/src/index.ts` |
| `THEME_VALUES` | Helper | `packages/theme-ui/src/theme-selector.tsx` |
| `ThemeSelector` | Helper | `packages/theme-ui/src/index.ts` |
| `MapTheme` | Type | `packages/theme-ui/src/map-theme.ts` |
| `MapThemeOption` | Type | `packages/theme-ui/src/map-theme.ts` |
| `MapThemeSelectorProps` | Type | `packages/theme-ui/src/map-theme-selector.tsx` |
| `NamedColorOption` | Type | `packages/theme-ui/src/color-options.ts` |
| `SavedMapThemeConfig` | Type | `packages/theme-ui/src/map-theme.ts` |
| `ShapePreviewIconProps` | Type | `packages/theme-ui/src/shape-preview-icon.tsx` |
| `ShapePreviewValue` | Type | `packages/theme-ui/src/shape-preview-icon.tsx` |
| `ThemeMode` | Type | `packages/theme-ui/src/theme-selector.tsx` |
| `ThemeOption` | Type | `packages/theme-ui/src/theme-selector.tsx` |
| `ThemeSelectorProps` | Type | `packages/theme-ui/src/theme-selector.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
