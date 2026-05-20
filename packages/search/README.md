# Carefully Built Search

Reusable fuzzy search and ranking helpers for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/search
```

## What It Includes

- `buildSearchText`: builds normalized search text from nested strings.
- `scoreFuzzyMatch`: scores a query against a candidate string.
- `filterAndRankBySearch`: filters and ranks items that expose `searchText`.
- `rankBySearch`: filters and ranks items with a custom `getSearchText` callback.
- `@carefully-built/search/command-palette`: reusable command palette UI with sidebar/bottom-nav triggers, mobile drawer, desktop overlay, keyboard navigation, type chips, completion, and loading/empty states.

## Basic Usage

```ts
import { buildSearchText, rankBySearch } from '@carefully-built/search';

const results = rankBySearch(contacts, search, (contact) =>
  buildSearchText(contact.firstName, contact.lastName, contact.email),
);
```

Use this package anywhere: React components, Next.js server code, Convex functions, or plain TypeScript helpers.

## Command Palette

```tsx
import { CommandPalette } from '@carefully-built/search/command-palette';

<CommandPalette
  activeAllType="all"
  items={items}
  typeOptions={typeOptions}
  getItemKey={(item) => item.id}
  getItemType={(item) => item.type}
  getItemLabel={(item) => item.label}
  getItemSearchText={(item) => item.searchText}
  onSelect={(item) => router.push(item.href)}
/>;
```

The root export stays UI-free so backend code can keep using search helpers without pulling React into the bundle.
