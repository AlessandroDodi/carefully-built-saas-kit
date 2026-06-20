# @carefully-built/user-picker

Reusable user picker for SaaS forms.

## Install

```bash
bun add @carefully-built/user-picker
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/user-picker`

## Component Usage

```tsx
import { UserPicker } from '@carefully-built/user-picker';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `UserPicker`: import from `@carefully-built/user-picker`.

## Helper Usage

```ts
import { buildUserInitials } from '@carefully-built/user-picker';
```

Helpers in this package:

- `buildUserInitials`
- `buildUserInitials`
- `filterSelectableUsers`
- `filterSelectableUsers`
- `filterUsersBySearch`
- `filterUsersBySearch`
- `formatSelectedUserSummary`
- `formatSelectedUserSummary`
- `formatUserDisplayName`
- `formatUserDisplayName`
- `toggleUserSelection`
- `toggleUserSelection`
- `UserPicker`

## Types And Schemas

- `UserPickerCopy`
- `UserPickerOption`
- `UserPickerProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `UserPicker` | Component | `packages/user-picker/src/user-picker.tsx` |
| `buildUserInitials` | Helper | `packages/user-picker/src/index.ts` |
| `buildUserInitials` | Helper | `packages/user-picker/src/user-picker-utils.ts` |
| `filterSelectableUsers` | Helper | `packages/user-picker/src/index.ts` |
| `filterSelectableUsers` | Helper | `packages/user-picker/src/user-picker-utils.ts` |
| `filterUsersBySearch` | Helper | `packages/user-picker/src/index.ts` |
| `filterUsersBySearch` | Helper | `packages/user-picker/src/user-picker-utils.ts` |
| `formatSelectedUserSummary` | Helper | `packages/user-picker/src/index.ts` |
| `formatSelectedUserSummary` | Helper | `packages/user-picker/src/user-picker-utils.ts` |
| `formatUserDisplayName` | Helper | `packages/user-picker/src/index.ts` |
| `formatUserDisplayName` | Helper | `packages/user-picker/src/user-picker-utils.ts` |
| `toggleUserSelection` | Helper | `packages/user-picker/src/index.ts` |
| `toggleUserSelection` | Helper | `packages/user-picker/src/user-picker-utils.ts` |
| `UserPicker` | Helper | `packages/user-picker/src/index.ts` |
| `UserPickerCopy` | Type | `packages/user-picker/src/user-picker-utils.ts` |
| `UserPickerOption` | Type | `packages/user-picker/src/user-picker-utils.ts` |
| `UserPickerProps` | Type | `packages/user-picker/src/user-picker.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
