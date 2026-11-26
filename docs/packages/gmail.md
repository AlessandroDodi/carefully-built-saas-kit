# @carefully-built/gmail

Reusable Gmail API client and message preview helpers for SaaS apps.

## Install

```bash
bun add @carefully-built/gmail
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/gmail`
- `@carefully-built/gmail/routes`

## Helper Usage

```ts
import { createGmailMessagesGetHandler } from '@carefully-built/gmail';
```

Helpers in this package:

- `createGmailMessagesGetHandler`
- `listRecentGmailMessages`
- `mapGmailMessageToPreview`

## Types And Schemas

- `GmailAccessTokenResult`
- `GmailMessagePreview`
- `GmailMessagesRouteOptions`
- `GmailPreviewFallbacks`
- `GmailRouteMessages`
- `GmailRouteSession`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `createGmailMessagesGetHandler` | Helper | `packages/gmail/src/routes.ts` |
| `listRecentGmailMessages` | Helper | `packages/gmail/src/index.ts` |
| `mapGmailMessageToPreview` | Helper | `packages/gmail/src/index.ts` |
| `GmailAccessTokenResult` | Type | `packages/gmail/src/routes.ts` |
| `GmailMessagePreview` | Type | `packages/gmail/src/index.ts` |
| `GmailMessagesRouteOptions` | Type | `packages/gmail/src/routes.ts` |
| `GmailPreviewFallbacks` | Type | `packages/gmail/src/index.ts` |
| `GmailRouteMessages` | Type | `packages/gmail/src/routes.ts` |
| `GmailRouteSession` | Type | `packages/gmail/src/routes.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
