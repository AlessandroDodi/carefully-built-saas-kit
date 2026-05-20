# Forms

Reusable React Hook Form + Zod form layer. Use this package when an app needs consistent labels, field spacing, validation messages, password toggles, and simple generated forms.

## Imports

```tsx
import {
  CustomForm,
  CustomInputField,
  CustomPasswordField,
  CustomSelectField,
  CustomTextareaField,
  SchemaForm,
} from '@carefully-built/forms';
```

## Components

- `CustomForm`: creates the RHF provider from a Zod schema and default values.
- `SchemaForm`: renders a form from a simple field array.
- `CustomInputField`: text, email, number, URL, tel.
- `CustomSelectField`: searchable select using `@carefully-built/ui`.
- `CustomTextareaField`: multiline notes/descriptions.
- `CustomPasswordField`: password with show/hide toggle.
- `FormFieldLabel`: label with optional icon and required marker.
- `FieldMessage`: reusable field error/help message.

## Basic Example

```tsx
<CustomForm schema={schema} defaultValues={defaultValues} onSubmit={save}>
  <SchemaForm
    fields={[
      { name: 'name', label: 'Name', placeholder: 'Company name' },
      { name: 'email', type: 'email', label: 'Email' },
      {
        name: 'status',
        type: 'select',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'disabled', label: 'Disabled' },
        ],
      },
    ]}
  />
</CustomForm>
```

## Package Owns

- RHF/Zod defaults.
- Common field UI.
- Field error rendering.
- Schema-driven basic forms.

## App Owns

- Zod schema.
- Submit action.
- Domain-specific fields like addresses, association pickers, territory, files, and maps until those move into their own packages.

## Open Decisions

- Add `ResourceForm` generated directly from a resource config.
- Add field groups/sections.
- Add conditional fields.
- Add async option loaders.
