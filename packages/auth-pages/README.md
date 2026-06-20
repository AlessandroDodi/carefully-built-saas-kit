# Carefully Built Auth Pages

Reusable SaaS auth layouts, legal consent, social login buttons, form presentation, default password form controllers, and WorkOS server action helpers.

## Install

```bash
bun add @carefully-built/auth-pages @carefully-built/forms @carefully-built/ui react-hook-form @hookform/resolvers zod
```

## What It Includes

- `AuthLayout`: brandable auth layout with optional split visual.
- `AuthBottomNav`: compact login/signup cross-link.
- `LegalConsent`: reusable terms/privacy/cookie copy.
- `@carefully-built/auth-pages/social`: provider buttons plus email fallback.
- `@carefully-built/auth-pages/forms`: presentational forms that accept app-owned hooks/actions.
- `@carefully-built/auth-pages/controllers`: default forgot-password and update-password hooks with built-in validation, loading, success, and error state.
- `@carefully-built/auth-pages/workos`: WorkOS server action factory for Google auth URLs, password sign in/sign up, password reset, and sign out.
- `@carefully-built/auth-pages/organizations`: reusable organization selection page, searchable organization list, and logo fallback.
- `@carefully-built/auth-pages/pages`: lazy-mode full auth pages for login, email login, signup, forgot password, and update password. Use lower-level exports when you need custom behavior.

The root export is server-safe for Next.js App Router. Use `/forms`, `/controllers`, and `/social` from client components. Use `/workos` only from server files.

## Goal

The consuming app should eventually mount auth with one import and one config object, keeping app-side auth code under 200 LOC.

## Styling And Theming

Auth components ship with default Tailwind/shadcn-compatible classes. Consuming apps can keep page files clean by defining product-specific classes in an app config file and passing them through optional `className` and `classes` props.

```tsx
import { AuthLoginPage } from '@carefully-built/auth-pages/pages';

<AuthLoginPage
  logo={<Logo />}
  providers={providers}
  legal={{
    termsHref: '/terms',
    privacyHref: '/privacy',
    className: 'text-center',
    linkClassName: 'underline-offset-4',
  }}
  classes={{
    content: 'max-w-sm',
    title: 'text-2xl',
    subtitle: 'text-sm',
  }}
/>;
```

`AuthLayout`, lazy auth pages, legal consent, bottom nav, social buttons, email/password forms, and organization selection all keep the same default style when these props are omitted.

Use `OrganizationSelectionPage` from `@carefully-built/auth-pages/organizations` for multi-organization auth instead of rebuilding the card list in each app.

## Component Docs

- [Auth Pages](./docs/auth-pages.md)
