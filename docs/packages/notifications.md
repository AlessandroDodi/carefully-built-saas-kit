# @carefully-built/notifications

Reusable notification center UI for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/notifications
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/notifications`

## Component Usage

```tsx
import { NotificationCenterButton } from '@carefully-built/notifications';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `NotificationCenterButton`: import from `@carefully-built/notifications`.
- `NotificationCenterSheet`: import from `@carefully-built/notifications`.
- `NotificationList`: import from `@carefully-built/notifications`.

## Helper Usage

```ts
import { NotificationCenterButton } from '@carefully-built/notifications';
```

Helpers in this package:

- `NotificationCenterButton`
- `NotificationCenterSheet`
- `NotificationList`

## Types And Schemas

- `NotificationCenterButtonProps`
- `NotificationCenterSheetProps`
- `NotificationListItem`
- `NotificationListItem`
- `NotificationListItemProps`
- `NotificationListProps`
- `NotificationLocaleConfig`
- `NotificationRecord`
- `NotificationSourceMeta`
- `NotificationTabConfig`
- `NotificationVisualMeta`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `NotificationCenterButton` | Component | `packages/notifications/src/notification-center-button.tsx` |
| `NotificationCenterSheet` | Component | `packages/notifications/src/notification-center-sheet.tsx` |
| `NotificationList` | Component | `packages/notifications/src/notification-list.tsx` |
| `NotificationCenterButton` | Helper | `packages/notifications/src/index.ts` |
| `NotificationCenterSheet` | Helper | `packages/notifications/src/index.ts` |
| `NotificationList` | Helper | `packages/notifications/src/index.ts` |
| `NotificationCenterButtonProps` | Type | `packages/notifications/src/notification-center-button.tsx` |
| `NotificationCenterSheetProps` | Type | `packages/notifications/src/notification-center-sheet.tsx` |
| `NotificationListItem` | Type | `packages/notifications/src/index.ts` |
| `NotificationListItem` | Type | `packages/notifications/src/notification-list-item.tsx` |
| `NotificationListItemProps` | Type | `packages/notifications/src/notification-list-item.tsx` |
| `NotificationListProps` | Type | `packages/notifications/src/notification-list.tsx` |
| `NotificationLocaleConfig` | Type | `packages/notifications/src/types.ts` |
| `NotificationRecord` | Type | `packages/notifications/src/types.ts` |
| `NotificationSourceMeta` | Type | `packages/notifications/src/types.ts` |
| `NotificationTabConfig` | Type | `packages/notifications/src/types.ts` |
| `NotificationVisualMeta` | Type | `packages/notifications/src/types.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
