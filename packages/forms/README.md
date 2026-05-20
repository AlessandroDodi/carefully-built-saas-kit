# Carefully Built Forms

Reusable React Hook Form fields and schema-driven form helpers for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/forms @carefully-built/ui react-hook-form zod @hookform/resolvers
```

## What It Includes

- `CustomForm`: Zod-backed React Hook Form provider with sensible defaults.
- `SchemaForm`: render common forms from a simple field config.
- `FormFieldLabel`: consistent label with optional icon and required marker.
- `CustomInputField`: text/number/email/etc. field.
- `CustomTextareaField`: textarea field.
- `CustomSelectField`: searchable select field powered by `@carefully-built/ui`.
- `CustomPasswordField`: password input with show/hide toggle.
- `buildCustomFormOptions`: shared React Hook Form defaults.

## Basic Usage

```tsx
import { CustomForm, CustomInputField, SchemaForm } from '@carefully-built/forms';

function AccountForm() {
  return (
    <CustomForm schema={schema} defaultValues={defaultValues} onSubmit={saveAccount}>
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
  );
}
```

Use `CustomForm` when you want full layout control, and `SchemaForm` when a CRUD screen should be generated from a small field list.

## Component Docs

- [Forms](./docs/forms.md)

## Keep This Updated

Whenever a field or schema renderer is added, update this README in the same change.
