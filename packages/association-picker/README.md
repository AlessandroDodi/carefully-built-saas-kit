# @carefully-built/association-picker

Reusable entity association picker for SaaS apps with contacts, properties, requests, documents, notes, activities, and similar linked resources.

## What It Exports

- `AssociationPicker`
- association option and create-handler types
- entity type metadata helpers
- filtering and search helpers used by command palettes and toolbars

Apps can pass their own `createConfig.handlers` to open app-specific creation flows while reusing the picker UI and keyboard/search behavior.
