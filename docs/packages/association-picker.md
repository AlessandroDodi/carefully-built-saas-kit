# @carefully-built/association-picker

Reusable entity association picker for multitenant SaaS apps.

## Install

```bash
bun add @carefully-built/association-picker
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/association-picker`

## Component Usage

```tsx
import { AssociationPicker } from '@carefully-built/association-picker';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AssociationPicker`: import from `@carefully-built/association-picker`.
- `AssociationPickerCreateAction`: import from `@carefully-built/association-picker`.
- `AssociationPickerCreateSheet`: import from `@carefully-built/association-picker`.
- `AssociationPickerPopover`: import from `@carefully-built/association-picker`.
- `AssociationPickerSearchRow`: import from `@carefully-built/association-picker`.
- `AssociationPickerTrigger`: import from `@carefully-built/association-picker`.
- `AssociationPickerView`: import from `@carefully-built/association-picker`.

## Hook Usage

```tsx
import { useAssociationPickerActions } from '@carefully-built/association-picker';

export function Example() {
  const state = useAssociationPickerActions({} as never);
  return null;
}
```

Hooks in this package:

- `useAssociationPickerActions`: keep app-specific data fetching and mutations in the consuming app.
- `useAssociationPickerEffects`: keep app-specific data fetching and mutations in the consuming app.
- `useAssociationPickerModel`: keep app-specific data fetching and mutations in the consuming app.
- `useAssociationPickerOutsideClose`: keep app-specific data fetching and mutations in the consuming app.
- `useAssociationPickerState`: keep app-specific data fetching and mutations in the consuming app.
- `useAssociationPickerValueCleanup`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { AssociationPicker } from '@carefully-built/association-picker';
```

Helpers in this package:

- `AssociationPicker`
- `associationTypeChipMeta`
- `associationTypeChipMeta`
- `buildAssociationCreateOption`
- `buildAssociationCreateOption`
- `getAssociationTypeChipMeta`
- `getAssociationTypeChipMeta`
- `getCreateableAssociationTypes`
- `getCreateableAssociationTypes`
- `getCreateButtonLabel`
- `getCreateButtonLabel`
- `normalizeAssociationEntityType`
- `normalizeAssociationEntityType`
- `ORDERED_ASSOCIATION_ENTITY_TYPES`

## Types And Schemas

- `AssociationEntityType`
- `AssociationFilterType`
- `AssociationPickerCreateConfig`
- `AssociationPickerCreateHandler`
- `AssociationPickerCreateRendererProps`
- `AssociationPickerCreateResult`
- `AssociationPickerOption`
- `AssociationPickerOptionsList`
- `AssociationPickerProps`
- `AssociationTypeChipMeta`
- `getAvailableTypeOptions`
- `getAvailableTypeOptions`
- `getFilteredAssociationOptions`
- `getFilteredAssociationOptions`
- `getVisibleAssociationOptions`
- `getVisibleAssociationOptions`
- `mergeAssociationOptions`
- `mergeAssociationOptions`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AssociationPicker` | Component | `packages/association-picker/src/AssociationPicker.tsx` |
| `AssociationPickerCreateAction` | Component | `packages/association-picker/src/AssociationPickerCreateAction.tsx` |
| `AssociationPickerCreateSheet` | Component | `packages/association-picker/src/AssociationPickerCreateSheet.tsx` |
| `AssociationPickerPopover` | Component | `packages/association-picker/src/AssociationPickerPopover.tsx` |
| `AssociationPickerSearchRow` | Component | `packages/association-picker/src/AssociationPickerSearchRow.tsx` |
| `AssociationPickerTrigger` | Component | `packages/association-picker/src/AssociationPickerTrigger.tsx` |
| `AssociationPickerView` | Component | `packages/association-picker/src/AssociationPickerView.tsx` |
| `AssociationPicker` | Helper | `packages/association-picker/src/index.ts` |
| `associationTypeChipMeta` | Helper | `packages/association-picker/src/associationTypeMeta.tsx` |
| `associationTypeChipMeta` | Helper | `packages/association-picker/src/index.ts` |
| `buildAssociationCreateOption` | Helper | `packages/association-picker/src/defaultCreateHandlers.shared.ts` |
| `buildAssociationCreateOption` | Helper | `packages/association-picker/src/index.ts` |
| `getAssociationTypeChipMeta` | Helper | `packages/association-picker/src/associationTypeMeta.tsx` |
| `getAssociationTypeChipMeta` | Helper | `packages/association-picker/src/index.ts` |
| `getCreateableAssociationTypes` | Helper | `packages/association-picker/src/associationPicker.create.ts` |
| `getCreateableAssociationTypes` | Helper | `packages/association-picker/src/index.ts` |
| `getCreateButtonLabel` | Helper | `packages/association-picker/src/associationPicker.create.ts` |
| `getCreateButtonLabel` | Helper | `packages/association-picker/src/index.ts` |
| `normalizeAssociationEntityType` | Helper | `packages/association-picker/src/associationTypeMeta.tsx` |
| `normalizeAssociationEntityType` | Helper | `packages/association-picker/src/index.ts` |
| `ORDERED_ASSOCIATION_ENTITY_TYPES` | Helper | `packages/association-picker/src/constants.ts` |
| `useAssociationPickerActions` | Hook | `packages/association-picker/src/useAssociationPickerActions.ts` |
| `useAssociationPickerEffects` | Hook | `packages/association-picker/src/useAssociationPickerEffects.ts` |
| `useAssociationPickerModel` | Hook | `packages/association-picker/src/useAssociationPickerModel.ts` |
| `useAssociationPickerOutsideClose` | Hook | `packages/association-picker/src/useAssociationPickerOutsideClose.ts` |
| `useAssociationPickerState` | Hook | `packages/association-picker/src/useAssociationPickerState.ts` |
| `useAssociationPickerValueCleanup` | Hook | `packages/association-picker/src/useAssociationPickerValueCleanup.ts` |
| `AssociationEntityType` | Type | `packages/association-picker/src/associationTypeMeta.tsx` |
| `AssociationFilterType` | Type | `packages/association-picker/src/types.ts` |
| `AssociationPickerCreateConfig` | Type | `packages/association-picker/src/types.ts` |
| `AssociationPickerCreateHandler` | Type | `packages/association-picker/src/types.ts` |
| `AssociationPickerCreateRendererProps` | Type | `packages/association-picker/src/types.ts` |
| `AssociationPickerCreateResult` | Type | `packages/association-picker/src/types.ts` |
| `AssociationPickerOption` | Type | `packages/association-picker/src/types.ts` |
| `AssociationPickerOptionsList` | Type | `packages/association-picker/src/AssociationPickerOptionsList.tsx` |
| `AssociationPickerProps` | Type | `packages/association-picker/src/types.ts` |
| `AssociationTypeChipMeta` | Type | `packages/association-picker/src/associationTypeMeta.tsx` |
| `getAvailableTypeOptions` | Type | `packages/association-picker/src/associationPicker.options.tsx` |
| `getAvailableTypeOptions` | Type | `packages/association-picker/src/index.ts` |
| `getFilteredAssociationOptions` | Type | `packages/association-picker/src/associationPicker.options.tsx` |
| `getFilteredAssociationOptions` | Type | `packages/association-picker/src/index.ts` |
| `getVisibleAssociationOptions` | Type | `packages/association-picker/src/associationPicker.options.tsx` |
| `getVisibleAssociationOptions` | Type | `packages/association-picker/src/index.ts` |
| `mergeAssociationOptions` | Type | `packages/association-picker/src/associationPicker.options.tsx` |
| `mergeAssociationOptions` | Type | `packages/association-picker/src/index.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
