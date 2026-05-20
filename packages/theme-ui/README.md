# `@carefully-built/theme-ui`

Reusable theme, color, map-theme, and shape selectors for SaaS apps.

## What It Includes

- `ThemeSelector` for light/dark/system cards with preview images.
- `MapThemeSelector` for Google Maps visual theme cards.
- `ShapePreviewIcon` for squared, semi-rounded, and rounded UI previews.
- `NAMED_COLOR_OPTIONS`, `NAMED_COLOR_VALUES`, and `normalizeNamedColor`.
- `resolveMapTheme`, `isMapTheme`, and shared map theme types/options.

## Example

```tsx
import { MapThemeSelector, resolveMapTheme } from "@carefully-built/theme-ui";

const selectedTheme = resolveMapTheme(settings?.config);

<MapThemeSelector
  value={selectedTheme}
  disabled={!organizationId}
  isSaving={isSaving}
  onChange={setSelectedTheme}
/>;
```

## Notes

This package owns reusable UI and option logic only. Apps should keep provider wiring,
database saves, route state, copy, and product-specific wrappers close to the app.
