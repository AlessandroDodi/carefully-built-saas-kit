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

## Stili

Il colore (preset) e la forma (stile) sono indipendenti. Uno stile cambia
superfici, raggi, controlli e tipografia senza toccare i componenti: agganci
stabili `data-slot` / `data-*` sui componenti del kit, regole fuori dai layer di
Tailwind così prevalgono sulle classi senza `!important`.

| File | Aspetto |
|---|---|
| `styles/soft.css` | Tela grigia, superfici bianche senza bordo con ombra morbida, angoli molto arrotondati, controlli a pillola, titoli e numeri grandi. |

```css
@import '@carefully-built/theme/base.css';
@import '@carefully-built/theme/presets/mono.css';
@import '@carefully-built/theme/styles/soft.css';
```

Agganci disponibili: `card`, `widget`, `widget-value`, `smart-table`,
`calendar`, `page-header`, `page-title`, `app-sidebar`, `app-main`, `nav-item`
(con `data-active`), `nav-group-label`, `[data-empty-state]`,
`[data-search-trigger]`, oltre agli slot shadcn delle primitive (`button`,
`input`, `select-trigger`, `tabs-*`, `dialog-content`, `sheet-content`, ...).
