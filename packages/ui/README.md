# @carefully-built/ui

Reusable React UI primitives and data-display components for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/ui
```

## Usage

```tsx
import { SmartTable, useTableSorting, type Column } from '@carefully-built/ui';
```

This package assumes your app provides Tailwind-compatible design tokens such as `bg-card`, `text-muted-foreground`, `border`, and `ring`.
