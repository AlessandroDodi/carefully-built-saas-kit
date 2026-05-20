# @carefully-built/custom-fields

Reusable custom-field options, form mapping, payload building, and display helpers for SaaS apps.

## Install

```bash
bun add @carefully-built/custom-fields
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/custom-fields`

## Helper Usage

```ts
import { CUSTOM_FIELD_ENTITY_OPTIONS } from '@carefully-built/custom-fields';
```

Helpers in this package:

- `CUSTOM_FIELD_ENTITY_OPTIONS`
- `CUSTOM_FIELD_TYPE_OPTIONS`
- `customFieldTypeChipMeta`
- `getCustomFieldTypeChipMeta`
- `getCustomFieldTypeLabel`
- `isChoiceCustomField`
- `readCustomFieldPricing`

## Types And Schemas

- `areCustomFieldFormValuesEqual`
- `buildCustomFieldValuePayload`
- `CustomFieldDefinition`
- `CustomFieldEntityType`
- `CustomFieldFormValues`
- `CustomFieldOptionConfig`
- `CustomFieldOptionPricing`
- `CustomFieldOptionPricingEntry`
- `CustomFieldType`
- `CustomFieldValue`
- `formatCustomFieldDisplayValue`
- `mapCustomFieldValuesToFormValues`
- `readCustomFieldConfig`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `CUSTOM_FIELD_ENTITY_OPTIONS` | Helper | `packages/custom-fields/src/index.ts` |
| `CUSTOM_FIELD_TYPE_OPTIONS` | Helper | `packages/custom-fields/src/index.ts` |
| `customFieldTypeChipMeta` | Helper | `packages/custom-fields/src/index.ts` |
| `getCustomFieldTypeChipMeta` | Helper | `packages/custom-fields/src/index.ts` |
| `getCustomFieldTypeLabel` | Helper | `packages/custom-fields/src/index.ts` |
| `isChoiceCustomField` | Helper | `packages/custom-fields/src/index.ts` |
| `readCustomFieldPricing` | Helper | `packages/custom-fields/src/index.ts` |
| `areCustomFieldFormValuesEqual` | Type | `packages/custom-fields/src/index.ts` |
| `buildCustomFieldValuePayload` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldDefinition` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldEntityType` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldFormValues` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldOptionConfig` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldOptionPricing` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldOptionPricingEntry` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldType` | Type | `packages/custom-fields/src/index.ts` |
| `CustomFieldValue` | Type | `packages/custom-fields/src/index.ts` |
| `formatCustomFieldDisplayValue` | Type | `packages/custom-fields/src/index.ts` |
| `mapCustomFieldValuesToFormValues` | Type | `packages/custom-fields/src/index.ts` |
| `readCustomFieldConfig` | Type | `packages/custom-fields/src/index.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
