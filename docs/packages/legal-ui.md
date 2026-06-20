# @carefully-built/legal-ui

Reusable legal document renderer for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/legal-ui
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/legal-ui`

## Component Usage

```tsx
import { LegalDocument } from '@carefully-built/legal-ui';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `LegalDocument`: import from `@carefully-built/legal-ui`.

## Helper Usage

```ts
import { privacyPolicyText } from '@carefully-built/legal-ui';
```

Helpers in this package:

- `privacyPolicyText`
- `privacyPolicyText`
- `termsAndConditionsText`
- `termsAndConditionsText`

## Types And Schemas

- `LegalDocumentClassNames`
- `LegalDocumentProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `LegalDocument` | Component | `packages/legal-ui/src/index.tsx` |
| `privacyPolicyText` | Helper | `packages/legal-ui/src/index.tsx` |
| `privacyPolicyText` | Helper | `packages/legal-ui/src/legal-texts.ts` |
| `termsAndConditionsText` | Helper | `packages/legal-ui/src/index.tsx` |
| `termsAndConditionsText` | Helper | `packages/legal-ui/src/legal-texts.ts` |
| `LegalDocumentClassNames` | Type | `packages/legal-ui/src/index.tsx` |
| `LegalDocumentProps` | Type | `packages/legal-ui/src/index.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
