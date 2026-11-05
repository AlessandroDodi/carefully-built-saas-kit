# @carefully-built/workos

Reusable WorkOS organization UI primitives for SaaS apps.

## Includes

- `CreateOrganization` sheet with optional custom create/upload handlers.
- `CreateOrganizationFormContent`.
- `OrganizationLogo` initials logo primitive.
- `OrganizationLogoDropzone`.
- `useOrganizationLogoInput`.
- logo validation, preview, and upload helpers.

## Lingua

I testi predefiniti (titoli del selettore, "Nuova organizzazione", etichette del
form, messaggi di errore) seguono `KitLocaleProvider` di `@carefully-built/ui`:
inglese senza provider, italiano con `<KitLocaleProvider locale="it">`. Le prop
`labels`/`signOutLabel` continuano a prevalere. Le funzioni pure
(`validateOrganizationLogo`, `createFilePreview`, `uploadOrganizationLogo`)
accettano un `locale` opzionale.
