# Carefully Built Auth Pages

Reusable SaaS auth layouts, legal consent, social login buttons, and form presentation.

## Install

```bash
bun add @carefully-built/auth-pages @carefully-built/forms @carefully-built/ui react-hook-form
```

## What It Includes

- `AuthLayout`: brandable auth layout with optional split visual.
- `AuthBottomNav`: compact login/signup cross-link.
- `LegalConsent`: reusable terms/privacy/cookie copy.
- `@carefully-built/auth-pages/social`: provider buttons plus email fallback.
- `@carefully-built/auth-pages/forms`: presentational forms that accept app-owned hooks/actions.

The root export is server-safe for Next.js App Router. Use `/forms` and `/social` from client components.

## Goal

The consuming app should eventually mount auth with one import and one config object, keeping app-side auth code under 200 LOC.
