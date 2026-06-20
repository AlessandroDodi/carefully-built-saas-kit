# @carefully-built/resource-kit

Reusable resource-page state helpers for CRUD SaaS surfaces.

## Install

```bash
bun add @carefully-built/resource-kit
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/resource-kit`

## Component Usage

```tsx
import { EntityAssociatedEmptyTab } from '@carefully-built/resource-kit';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `EntityAssociatedEmptyTab`: import from `@carefully-built/resource-kit`.
- `EntityAssociatedTabPanel`: import from `@carefully-built/resource-kit`.
- `EntityDetailLoadingSidebar`: import from `@carefully-built/resource-kit`.
- `EntityDetailShell`: import from `@carefully-built/resource-kit`.

## Hook Usage

```tsx
import { useResourceSheetState } from '@carefully-built/resource-kit';

export function Example() {
  const state = useResourceSheetState({} as never);
  return null;
}
```

Hooks in this package:

- `useResourceSheetState`: keep app-specific data fetching and mutations in the consuming app.
- `useResourceSheetState`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { captureApiError } from '@carefully-built/resource-kit';
```

Helpers in this package:

- `captureApiError`
- `captureApiError`
- `captureError`
- `captureError`
- `captureReactError`
- `captureReactError`
- `createEntityAssociationOption`
- `createEntityAssociationOption`
- `ENTITY_DETAIL_TABS`
- `ENTITY_DETAIL_TABS`
- `EntityAssociatedEmptyTab`
- `EntityAssociatedTabPanel`
- `EntityDetailLoadingSidebar`
- `EntityDetailShell`
- `filterAssociatedActivities`
- `filterAssociatedActivities`
- `filterAssociatedCollection`
- `filterAssociatedCollection`
- `filterAssociatedDocuments`
- `filterAssociatedDocuments`
- `filterAssociatedNotes`
- `filterAssociatedNotes`
- `filterAssociatedOpportunities`
- `filterAssociatedOpportunities`
- `filterAssociatedProperties`
- `filterAssociatedProperties`
- `filterAssociatedRequests`
- `filterAssociatedRequests`
- `getUserFacingErrorMessage`
- `getUserFacingErrorMessage`
- `normalizeAssociatedNotes`
- `normalizeAssociatedNotes`
- `resolveEntityDetailTab`
- `resolveEntityDetailTab`
- `showDestructiveActionToast`
- `showDestructiveActionToast`
- `withCurrentEntityAssociationOption`
- `withCurrentEntityAssociationOption`
- `withErrorHandler`
- `withErrorHandler`

## Types And Schemas

- `buildEntityAssociationOptions`
- `buildEntityAssociationOptions`
- `buildEntityAssociationValue`
- `buildEntityAssociationValue`
- `createCurrentEntityAssociationRecord`
- `createCurrentEntityAssociationRecord`
- `EntityAssociatedEmptyTabProps`
- `EntityAssociatedTabPanelBaseProps`
- `EntityAssociatedTabPanelProps`
- `EntityAssociationPayload`
- `EntityAssociationRecord`
- `EntityDetailLoadingField`
- `EntityDetailTab`
- `EntityDetailTabOption`
- `EntityOpportunityListItem`
- `ErrorCategory`
- `ErrorSeverity`
- `mapAssociationValuesToPayload`
- `mapAssociationValuesToPayload`
- `ResourceId`
- `ResourceSheetState`
- `SupportedAssociationEntityType`
- `UseResourceSheetStateOptions`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `EntityAssociatedEmptyTab` | Component | `packages/resource-kit/src/entity-associated-empty-tab.tsx` |
| `EntityAssociatedTabPanel` | Component | `packages/resource-kit/src/entity-associated-tab-panel.tsx` |
| `EntityDetailLoadingSidebar` | Component | `packages/resource-kit/src/entity-detail-loading-sidebar.tsx` |
| `EntityDetailShell` | Component | `packages/resource-kit/src/entity-detail-shell.tsx` |
| `captureApiError` | Helper | `packages/resource-kit/src/error-handling.ts` |
| `captureApiError` | Helper | `packages/resource-kit/src/index.ts` |
| `captureError` | Helper | `packages/resource-kit/src/error-handling.ts` |
| `captureError` | Helper | `packages/resource-kit/src/index.ts` |
| `captureReactError` | Helper | `packages/resource-kit/src/error-handling.ts` |
| `captureReactError` | Helper | `packages/resource-kit/src/index.ts` |
| `createEntityAssociationOption` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `createEntityAssociationOption` | Helper | `packages/resource-kit/src/index.ts` |
| `ENTITY_DETAIL_TABS` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `ENTITY_DETAIL_TABS` | Helper | `packages/resource-kit/src/index.ts` |
| `EntityAssociatedEmptyTab` | Helper | `packages/resource-kit/src/index.ts` |
| `EntityAssociatedTabPanel` | Helper | `packages/resource-kit/src/index.ts` |
| `EntityDetailLoadingSidebar` | Helper | `packages/resource-kit/src/index.ts` |
| `EntityDetailShell` | Helper | `packages/resource-kit/src/index.ts` |
| `filterAssociatedActivities` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `filterAssociatedActivities` | Helper | `packages/resource-kit/src/index.ts` |
| `filterAssociatedCollection` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `filterAssociatedCollection` | Helper | `packages/resource-kit/src/index.ts` |
| `filterAssociatedDocuments` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `filterAssociatedDocuments` | Helper | `packages/resource-kit/src/index.ts` |
| `filterAssociatedNotes` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `filterAssociatedNotes` | Helper | `packages/resource-kit/src/index.ts` |
| `filterAssociatedOpportunities` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `filterAssociatedOpportunities` | Helper | `packages/resource-kit/src/index.ts` |
| `filterAssociatedProperties` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `filterAssociatedProperties` | Helper | `packages/resource-kit/src/index.ts` |
| `filterAssociatedRequests` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `filterAssociatedRequests` | Helper | `packages/resource-kit/src/index.ts` |
| `getUserFacingErrorMessage` | Helper | `packages/resource-kit/src/error-handling.ts` |
| `getUserFacingErrorMessage` | Helper | `packages/resource-kit/src/index.ts` |
| `normalizeAssociatedNotes` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `normalizeAssociatedNotes` | Helper | `packages/resource-kit/src/index.ts` |
| `resolveEntityDetailTab` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `resolveEntityDetailTab` | Helper | `packages/resource-kit/src/index.ts` |
| `showDestructiveActionToast` | Helper | `packages/resource-kit/src/destructive-action-toast.ts` |
| `showDestructiveActionToast` | Helper | `packages/resource-kit/src/index.ts` |
| `withCurrentEntityAssociationOption` | Helper | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `withCurrentEntityAssociationOption` | Helper | `packages/resource-kit/src/index.ts` |
| `withErrorHandler` | Helper | `packages/resource-kit/src/error-handling.ts` |
| `withErrorHandler` | Helper | `packages/resource-kit/src/index.ts` |
| `useResourceSheetState` | Hook | `packages/resource-kit/src/index.ts` |
| `useResourceSheetState` | Hook | `packages/resource-kit/src/use-resource-sheet-state.ts` |
| `buildEntityAssociationOptions` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `buildEntityAssociationOptions` | Type | `packages/resource-kit/src/index.ts` |
| `buildEntityAssociationValue` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `buildEntityAssociationValue` | Type | `packages/resource-kit/src/index.ts` |
| `createCurrentEntityAssociationRecord` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `createCurrentEntityAssociationRecord` | Type | `packages/resource-kit/src/index.ts` |
| `EntityAssociatedEmptyTabProps` | Type | `packages/resource-kit/src/entity-associated-empty-tab.tsx` |
| `EntityAssociatedTabPanelBaseProps` | Type | `packages/resource-kit/src/entity-associated-tab-panel.tsx` |
| `EntityAssociatedTabPanelProps` | Type | `packages/resource-kit/src/entity-associated-tab-panel.tsx` |
| `EntityAssociationPayload` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `EntityAssociationRecord` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `EntityDetailLoadingField` | Type | `packages/resource-kit/src/entity-detail-loading-sidebar.tsx` |
| `EntityDetailTab` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `EntityDetailTabOption` | Type | `packages/resource-kit/src/entity-detail-shell.tsx` |
| `EntityOpportunityListItem` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `ErrorCategory` | Type | `packages/resource-kit/src/error-handling.ts` |
| `ErrorSeverity` | Type | `packages/resource-kit/src/error-handling.ts` |
| `mapAssociationValuesToPayload` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `mapAssociationValuesToPayload` | Type | `packages/resource-kit/src/index.ts` |
| `ResourceId` | Type | `packages/resource-kit/src/use-resource-sheet-state.ts` |
| `ResourceSheetState` | Type | `packages/resource-kit/src/use-resource-sheet-state.ts` |
| `SupportedAssociationEntityType` | Type | `packages/resource-kit/src/entity-detail-helpers.ts` |
| `UseResourceSheetStateOptions` | Type | `packages/resource-kit/src/use-resource-sheet-state.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
