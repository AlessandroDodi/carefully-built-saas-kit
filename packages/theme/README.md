# `@carefully-built/theme`

Tailwind v4 design tokens for Carefully Built apps: one base, swappable color
presets, and the restyle of the WorkOS widgets. Plain CSS, no runtime.

## Usage

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';
@import '@carefully-built/theme/base.css';
@import '@carefully-built/theme/presets/mono.css';
@import '@carefully-built/theme/workos-widgets.css'; /* only if the app renders WorkOS widgets */

@source '../**/*.{ts,tsx}';
```

The same files are available through the meta package as
`@carefully-built/saas-kit/theme/base.css` and so on.

## Files

| File | What it sets |
|---|---|
| `base.css` | shadcn token names mapped to Tailwind colors and radii, neutral palette for light and dark, `dark` variant, base layer (borders, cursor, theme fade, thin scrollbars). Also registers the compiled kit packages as a Tailwind `@source`. |
| `presets/mono.css` | Brand color: premium black on white in light mode, white on near-black in dark mode. |
| `presets/teal.css` | Brand color: the original 20xDev teal, with a teal chart ramp. |
| `workos-widgets.css` | Imports Radix Themes and WorkOS Widgets styles and aligns buttons, fields, dialogs, menus and mobile tables with the kit tokens. |

## Writing a preset

A preset overrides only brand-dependent tokens, in both `:root` and `.dark`:
`--primary`, `--primary-foreground`, `--ring`, `--sidebar-primary`,
`--sidebar-primary-foreground`, and optionally `--chart-1` to `--chart-5`.
Everything else comes from `base.css`.
