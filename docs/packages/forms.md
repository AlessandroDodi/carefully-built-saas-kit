# @carefully-built/forms

Reusable React Hook Form fields and schema-driven form helpers for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/forms
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/forms`

## Component Usage

```tsx
import { CustomAgentPickerField } from '@carefully-built/forms';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `CustomAgentPickerField`: import from `@carefully-built/forms`.
- `CustomAssociationPickerField`: import from `@carefully-built/forms`.
- `CustomBooleanChipField`: import from `@carefully-built/forms`.
- `CustomChipSelectField`: import from `@carefully-built/forms`.
- `CustomCompactCurrencyField`: import from `@carefully-built/forms`.
- `CustomDateField`: import from `@carefully-built/forms`.
- `CustomDateFormField`: import from `@carefully-built/forms`.
- `CustomForm`: import from `@carefully-built/forms`.
- `CustomMultiSelectDropdownField`: import from `@carefully-built/forms`.
- `CustomMultiSelectField`: import from `@carefully-built/forms`.
- `CustomPasswordField`: import from `@carefully-built/forms`.
- `CustomSegmentedToggleField`: import from `@carefully-built/forms`.
- `CustomSelectField`: import from `@carefully-built/forms`.
- `CustomSingleAssociationPickerField`: import from `@carefully-built/forms`.
- `CustomTextareaField`: import from `@carefully-built/forms`.
- `FieldMessage`: import from `@carefully-built/forms`.
- `FormFieldLabel`: import from `@carefully-built/forms`.

## Helper Usage

```ts
import { CustomAgentPickerField } from '@carefully-built/forms';
```

Helpers in this package:

- `CustomAgentPickerField`
- `CustomAssociationPickerField`
- `CustomBooleanChipField`
- `CustomChipSelectField`
- `CustomCompactCurrencyField`
- `CustomDateField`
- `CustomDateFormField`
- `CustomForm`
- `CustomMultiSelectDropdownField`
- `CustomMultiSelectField`
- `CustomPasswordField`
- `CustomSegmentedToggleField`
- `CustomSelectField`
- `CustomSingleAssociationPickerField`
- `CustomTextareaField`
- `FieldMessage`
- `formatCompactCurrencyDisplay`
- `formatCompactCurrencyDisplay`
- `FormFieldLabel`
- `getCompactCurrencySuggestion`
- `getCompactCurrencySuggestion`

## Types And Schemas

- `SchemaForm`
- `SchemaForm`
- `buildCustomFormOptions`
- `buildCustomFormOptions`
- `CompactCurrencySuggestion`
- `CountryPhoneInput`
- `CountryPhoneInput`
- `CountryVatInput`
- `CountryVatInput`
- `CustomInputField`
- `CustomInputField`
- `formatCompactCurrencyValue`
- `formatCompactCurrencyValue`
- `formatDatePickerDisplayValue`
- `formatDatePickerDisplayValue`
- `formatDatePickerValue`
- `formatDatePickerValue`
- `getPhoneCountryOptions`
- `getPhoneCountryOptions`
- `parseCompactCurrencyInput`
- `parseCompactCurrencyInput`
- `parseDatePickerValue`
- `parseDatePickerValue`
- `SchemaFormField`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `CustomAgentPickerField` | Component | `packages/forms/src/fields/custom-agent-picker-field.tsx` |
| `CustomAssociationPickerField` | Component | `packages/forms/src/fields/custom-association-picker-field.tsx` |
| `CustomBooleanChipField` | Component | `packages/forms/src/fields/custom-boolean-chip-field.tsx` |
| `CustomChipSelectField` | Component | `packages/forms/src/fields/custom-chip-select-field.tsx` |
| `CustomCompactCurrencyField` | Component | `packages/forms/src/fields/custom-compact-currency-field.tsx` |
| `CustomDateField` | Component | `packages/forms/src/fields/custom-date-field.tsx` |
| `CustomDateFormField` | Component | `packages/forms/src/fields/custom-date-form-field.tsx` |
| `CustomForm` | Component | `packages/forms/src/custom-form.tsx` |
| `CustomMultiSelectDropdownField` | Component | `packages/forms/src/fields/custom-multi-select-dropdown-field.tsx` |
| `CustomMultiSelectField` | Component | `packages/forms/src/fields/custom-multi-select-field.tsx` |
| `CustomPasswordField` | Component | `packages/forms/src/fields/custom-password-field.tsx` |
| `CustomSegmentedToggleField` | Component | `packages/forms/src/fields/custom-segmented-toggle-field.tsx` |
| `CustomSelectField` | Component | `packages/forms/src/fields/custom-select-field.tsx` |
| `CustomSingleAssociationPickerField` | Component | `packages/forms/src/fields/custom-single-association-picker-field.tsx` |
| `CustomTextareaField` | Component | `packages/forms/src/fields/custom-textarea-field.tsx` |
| `FieldMessage` | Component | `packages/forms/src/fields/field-message.tsx` |
| `FormFieldLabel` | Component | `packages/forms/src/fields/form-field-label.tsx` |
| `CustomAgentPickerField` | Helper | `packages/forms/src/index.ts` |
| `CustomAssociationPickerField` | Helper | `packages/forms/src/index.ts` |
| `CustomBooleanChipField` | Helper | `packages/forms/src/index.ts` |
| `CustomChipSelectField` | Helper | `packages/forms/src/index.ts` |
| `CustomCompactCurrencyField` | Helper | `packages/forms/src/index.ts` |
| `CustomDateField` | Helper | `packages/forms/src/index.ts` |
| `CustomDateFormField` | Helper | `packages/forms/src/index.ts` |
| `CustomForm` | Helper | `packages/forms/src/index.ts` |
| `CustomMultiSelectDropdownField` | Helper | `packages/forms/src/index.ts` |
| `CustomMultiSelectField` | Helper | `packages/forms/src/index.ts` |
| `CustomPasswordField` | Helper | `packages/forms/src/index.ts` |
| `CustomSegmentedToggleField` | Helper | `packages/forms/src/index.ts` |
| `CustomSelectField` | Helper | `packages/forms/src/index.ts` |
| `CustomSingleAssociationPickerField` | Helper | `packages/forms/src/index.ts` |
| `CustomTextareaField` | Helper | `packages/forms/src/index.ts` |
| `FieldMessage` | Helper | `packages/forms/src/index.ts` |
| `formatCompactCurrencyDisplay` | Helper | `packages/forms/src/fields/compact-currency.ts` |
| `formatCompactCurrencyDisplay` | Helper | `packages/forms/src/index.ts` |
| `FormFieldLabel` | Helper | `packages/forms/src/index.ts` |
| `getCompactCurrencySuggestion` | Helper | `packages/forms/src/fields/compact-currency.ts` |
| `getCompactCurrencySuggestion` | Helper | `packages/forms/src/index.ts` |
| `SchemaForm` | Schema | `packages/forms/src/index.ts` |
| `SchemaForm` | Schema | `packages/forms/src/schema-form/schema-form.tsx` |
| `buildCustomFormOptions` | Type | `packages/forms/src/custom-form-options.ts` |
| `buildCustomFormOptions` | Type | `packages/forms/src/index.ts` |
| `CompactCurrencySuggestion` | Type | `packages/forms/src/fields/compact-currency.ts` |
| `CountryPhoneInput` | Type | `packages/forms/src/fields/country-phone-input.tsx` |
| `CountryPhoneInput` | Type | `packages/forms/src/index.ts` |
| `CountryVatInput` | Type | `packages/forms/src/fields/country-vat-input.tsx` |
| `CountryVatInput` | Type | `packages/forms/src/index.ts` |
| `CustomInputField` | Type | `packages/forms/src/fields/custom-input-field.tsx` |
| `CustomInputField` | Type | `packages/forms/src/index.ts` |
| `formatCompactCurrencyValue` | Type | `packages/forms/src/fields/compact-currency.ts` |
| `formatCompactCurrencyValue` | Type | `packages/forms/src/index.ts` |
| `formatDatePickerDisplayValue` | Type | `packages/forms/src/fields/date-picker-value.ts` |
| `formatDatePickerDisplayValue` | Type | `packages/forms/src/index.ts` |
| `formatDatePickerValue` | Type | `packages/forms/src/fields/date-picker-value.ts` |
| `formatDatePickerValue` | Type | `packages/forms/src/index.ts` |
| `getPhoneCountryOptions` | Type | `packages/forms/src/fields/country-phone-input.tsx` |
| `getPhoneCountryOptions` | Type | `packages/forms/src/index.ts` |
| `parseCompactCurrencyInput` | Type | `packages/forms/src/fields/compact-currency.ts` |
| `parseCompactCurrencyInput` | Type | `packages/forms/src/index.ts` |
| `parseDatePickerValue` | Type | `packages/forms/src/fields/date-picker-value.ts` |
| `parseDatePickerValue` | Type | `packages/forms/src/index.ts` |
| `SchemaFormField` | Type | `packages/forms/src/schema-form/schema-form.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
