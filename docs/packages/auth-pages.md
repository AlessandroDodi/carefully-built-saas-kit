# @carefully-built/auth-pages

Reusable SaaS auth pages, layouts, legal consent, and form presentation for Carefully Built apps.

## Install

```bash
bun add @carefully-built/auth-pages
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/auth-pages`
- `@carefully-built/auth-pages/forms`
- `@carefully-built/auth-pages/controllers`
- `@carefully-built/auth-pages/config`
- `@carefully-built/auth-pages/social`
- `@carefully-built/auth-pages/workos`
- `@carefully-built/auth-pages/organizations`
- `@carefully-built/auth-pages/pages`

## Component Usage

```tsx
import { AuthBottomNav } from '@carefully-built/auth-pages';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AuthBottomNav`: import from `@carefully-built/auth-pages`.
- `AuthEmailLoginPage`: import from `@carefully-built/auth-pages`.
- `AuthError`: import from `@carefully-built/auth-pages`.
- `AuthForgotPasswordPage`: import from `@carefully-built/auth-pages`.
- `AuthLayout`: import from `@carefully-built/auth-pages`.
- `AuthLoginPage`: import from `@carefully-built/auth-pages`.
- `AuthSignupPage`: import from `@carefully-built/auth-pages`.
- `AuthUpdatePasswordPage`: import from `@carefully-built/auth-pages`.
- `ForgotPasswordForm`: import from `@carefully-built/auth-pages`.
- `LegalConsent`: import from `@carefully-built/auth-pages`.
- `LoginEmailForm`: import from `@carefully-built/auth-pages`.
- `OrganizationLogo`: import from `@carefully-built/auth-pages`.
- `OrganizationSelectionPage`: import from `@carefully-built/auth-pages`.
- `OrganizationSelector`: import from `@carefully-built/auth-pages`.
- `SignupEmailForm`: import from `@carefully-built/auth-pages`.
- `SocialLoginButtons`: import from `@carefully-built/auth-pages`.
- `SocialProviderButton`: import from `@carefully-built/auth-pages`.
- `UpdatePasswordForm`: import from `@carefully-built/auth-pages`.

## Hook Usage

```tsx
import { useAuthPagesConfig } from '@carefully-built/auth-pages';

export function Example() {
  const state = useAuthPagesConfig({} as never);
  return null;
}
```

Hooks in this package:

- `useAuthPagesConfig`: keep app-specific data fetching and mutations in the consuming app.
- `useAuthPagesConfig`: keep app-specific data fetching and mutations in the consuming app.
- `useForgotPasswordForm`: keep app-specific data fetching and mutations in the consuming app.
- `useForgotPasswordForm`: keep app-specific data fetching and mutations in the consuming app.
- `useLoginForm`: keep app-specific data fetching and mutations in the consuming app.
- `useLoginForm`: keep app-specific data fetching and mutations in the consuming app.
- `useSignupForm`: keep app-specific data fetching and mutations in the consuming app.
- `useSignupForm`: keep app-specific data fetching and mutations in the consuming app.
- `useUpdatePasswordForm`: keep app-specific data fetching and mutations in the consuming app.
- `useUpdatePasswordForm`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { appendInvitationToken } from '@carefully-built/auth-pages';
```

Helpers in this package:

- `appendInvitationToken`
- `appendInvitationToken`
- `AuthBottomNav`
- `AuthEmailLoginPage`
- `AuthForgotPasswordPage`
- `AuthLayout`
- `AuthLoginPage`
- `AuthSignupPage`
- `AuthUpdatePasswordPage`
- `createWorkOSAuthActions`
- `createWorkOSAuthActions`
- `ForgotPasswordForm`
- `getFormInvitationToken`
- `getFormInvitationToken`
- `LegalConsent`
- `LoginEmailForm`
- `OrganizationLogo`
- `OrganizationSelectionPage`
- `OrganizationSelector`
- `SignupEmailForm`
- `SocialLoginButtons`
- `SocialProviderButton`
- `UpdatePasswordForm`

## Types And Schemas

- `forgotPasswordSchema`
- `forgotPasswordSchema`
- `loginSchema`
- `loginSchema`
- `resetPasswordSchema`
- `resetPasswordSchema`
- `signupSchema`
- `signupSchema`
- `AuthActionResult`
- `AuthEmailLoginPageProps`
- `AuthForgotPasswordPageProps`
- `AuthFormState`
- `AuthLayoutBranding`
- `AuthLoginPageProps`
- `AuthPageBranding`
- `AuthPagesConfig`
- `AuthPagesConfigProvider`
- `AuthPagesConfigProvider`
- `AuthSignupPageProps`
- `AuthUpdatePasswordPageProps`
- `AuthVisualConfig`
- `ForgotPasswordFormData`
- `LegalLinkConfig`
- `LoginFormData`
- `OrganizationSelectionPageProps`
- `OrganizationSelectorItem`
- `OrganizationSelectorProps`
- `ResetPasswordFormData`
- `SignupFormData`
- `SocialProvider`
- `UseForgotPasswordFormOptions`
- `UseForgotPasswordFormResult`
- `UseLoginFormOptions`
- `UseLoginFormResult`
- `UseSignupFormOptions`
- `UseSignupFormResult`
- `UseUpdatePasswordFormOptions`
- `UseUpdatePasswordFormResult`
- `WorkOSAuthActionResult`
- `WorkOSAuthActions`
- `WorkOSAuthActionsConfig`
- `WorkOSAuthenticatedUser`
- `WorkOSAuthMessages`
- `WorkOSAuthProvider`
- `WorkOSCreateSessionArgs`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AuthBottomNav` | Component | `packages/auth-pages/src/layout/auth-bottom-nav.tsx` |
| `AuthEmailLoginPage` | Component | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthError` | Component | `packages/auth-pages/src/forms/auth-error.tsx` |
| `AuthForgotPasswordPage` | Component | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthLayout` | Component | `packages/auth-pages/src/layout/auth-layout.tsx` |
| `AuthLoginPage` | Component | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthSignupPage` | Component | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthUpdatePasswordPage` | Component | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `ForgotPasswordForm` | Component | `packages/auth-pages/src/forms/forgot-password-form.tsx` |
| `LegalConsent` | Component | `packages/auth-pages/src/layout/legal-consent.tsx` |
| `LoginEmailForm` | Component | `packages/auth-pages/src/forms/login-email-form.tsx` |
| `OrganizationLogo` | Component | `packages/auth-pages/src/organizations/organization-selection.tsx` |
| `OrganizationSelectionPage` | Component | `packages/auth-pages/src/organizations/organization-selection.tsx` |
| `OrganizationSelector` | Component | `packages/auth-pages/src/organizations/organization-selection.tsx` |
| `SignupEmailForm` | Component | `packages/auth-pages/src/forms/signup-email-form.tsx` |
| `SocialLoginButtons` | Component | `packages/auth-pages/src/social/social-login-buttons.tsx` |
| `SocialProviderButton` | Component | `packages/auth-pages/src/social/social-provider-button.tsx` |
| `UpdatePasswordForm` | Component | `packages/auth-pages/src/forms/update-password-form.tsx` |
| `appendInvitationToken` | Helper | `packages/auth-pages/src/workos/auth-actions.ts` |
| `appendInvitationToken` | Helper | `packages/auth-pages/src/workos.ts` |
| `AuthBottomNav` | Helper | `packages/auth-pages/src/index.ts` |
| `AuthEmailLoginPage` | Helper | `packages/auth-pages/src/pages.ts` |
| `AuthForgotPasswordPage` | Helper | `packages/auth-pages/src/pages.ts` |
| `AuthLayout` | Helper | `packages/auth-pages/src/index.ts` |
| `AuthLoginPage` | Helper | `packages/auth-pages/src/pages.ts` |
| `AuthSignupPage` | Helper | `packages/auth-pages/src/pages.ts` |
| `AuthUpdatePasswordPage` | Helper | `packages/auth-pages/src/pages.ts` |
| `createWorkOSAuthActions` | Helper | `packages/auth-pages/src/workos/auth-actions.ts` |
| `createWorkOSAuthActions` | Helper | `packages/auth-pages/src/workos.ts` |
| `ForgotPasswordForm` | Helper | `packages/auth-pages/src/forms.ts` |
| `getFormInvitationToken` | Helper | `packages/auth-pages/src/workos/auth-actions.ts` |
| `getFormInvitationToken` | Helper | `packages/auth-pages/src/workos.ts` |
| `LegalConsent` | Helper | `packages/auth-pages/src/index.ts` |
| `LoginEmailForm` | Helper | `packages/auth-pages/src/forms.ts` |
| `OrganizationLogo` | Helper | `packages/auth-pages/src/organizations.ts` |
| `OrganizationSelectionPage` | Helper | `packages/auth-pages/src/organizations.ts` |
| `OrganizationSelector` | Helper | `packages/auth-pages/src/organizations.ts` |
| `SignupEmailForm` | Helper | `packages/auth-pages/src/forms.ts` |
| `SocialLoginButtons` | Helper | `packages/auth-pages/src/social.ts` |
| `SocialProviderButton` | Helper | `packages/auth-pages/src/social.ts` |
| `UpdatePasswordForm` | Helper | `packages/auth-pages/src/forms.ts` |
| `useAuthPagesConfig` | Hook | `packages/auth-pages/src/config/auth-pages-config.tsx` |
| `useAuthPagesConfig` | Hook | `packages/auth-pages/src/config.ts` |
| `useForgotPasswordForm` | Hook | `packages/auth-pages/src/controllers/password-forms.ts` |
| `useForgotPasswordForm` | Hook | `packages/auth-pages/src/controllers.ts` |
| `useLoginForm` | Hook | `packages/auth-pages/src/controllers/password-forms.ts` |
| `useLoginForm` | Hook | `packages/auth-pages/src/controllers.ts` |
| `useSignupForm` | Hook | `packages/auth-pages/src/controllers/password-forms.ts` |
| `useSignupForm` | Hook | `packages/auth-pages/src/controllers.ts` |
| `useUpdatePasswordForm` | Hook | `packages/auth-pages/src/controllers/password-forms.ts` |
| `useUpdatePasswordForm` | Hook | `packages/auth-pages/src/controllers.ts` |
| `forgotPasswordSchema` | Schema | `packages/auth-pages/src/controllers/password-forms.ts` |
| `forgotPasswordSchema` | Schema | `packages/auth-pages/src/controllers.ts` |
| `loginSchema` | Schema | `packages/auth-pages/src/controllers/password-forms.ts` |
| `loginSchema` | Schema | `packages/auth-pages/src/controllers.ts` |
| `resetPasswordSchema` | Schema | `packages/auth-pages/src/controllers/password-forms.ts` |
| `resetPasswordSchema` | Schema | `packages/auth-pages/src/controllers.ts` |
| `signupSchema` | Schema | `packages/auth-pages/src/controllers/password-forms.ts` |
| `signupSchema` | Schema | `packages/auth-pages/src/controllers.ts` |
| `AuthActionResult` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `AuthEmailLoginPageProps` | Type | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthForgotPasswordPageProps` | Type | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthFormState` | Type | `packages/auth-pages/src/types.ts` |
| `AuthLayoutBranding` | Type | `packages/auth-pages/src/types.ts` |
| `AuthLoginPageProps` | Type | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthPageBranding` | Type | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthPagesConfig` | Type | `packages/auth-pages/src/config/auth-pages-config.tsx` |
| `AuthPagesConfigProvider` | Type | `packages/auth-pages/src/config/auth-pages-config.tsx` |
| `AuthPagesConfigProvider` | Type | `packages/auth-pages/src/config.ts` |
| `AuthSignupPageProps` | Type | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthUpdatePasswordPageProps` | Type | `packages/auth-pages/src/pages/auth-pages.tsx` |
| `AuthVisualConfig` | Type | `packages/auth-pages/src/types.ts` |
| `ForgotPasswordFormData` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `LegalLinkConfig` | Type | `packages/auth-pages/src/types.ts` |
| `LoginFormData` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `OrganizationSelectionPageProps` | Type | `packages/auth-pages/src/organizations/organization-selection.tsx` |
| `OrganizationSelectorItem` | Type | `packages/auth-pages/src/organizations/organization-selection.tsx` |
| `OrganizationSelectorProps` | Type | `packages/auth-pages/src/organizations/organization-selection.tsx` |
| `ResetPasswordFormData` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `SignupFormData` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `SocialProvider` | Type | `packages/auth-pages/src/social/social-provider-button.tsx` |
| `UseForgotPasswordFormOptions` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `UseForgotPasswordFormResult` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `UseLoginFormOptions` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `UseLoginFormResult` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `UseSignupFormOptions` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `UseSignupFormResult` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `UseUpdatePasswordFormOptions` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `UseUpdatePasswordFormResult` | Type | `packages/auth-pages/src/controllers/password-forms.ts` |
| `WorkOSAuthActionResult` | Type | `packages/auth-pages/src/workos/auth-actions.ts` |
| `WorkOSAuthActions` | Type | `packages/auth-pages/src/workos/auth-actions.ts` |
| `WorkOSAuthActionsConfig` | Type | `packages/auth-pages/src/workos/auth-actions.ts` |
| `WorkOSAuthenticatedUser` | Type | `packages/auth-pages/src/workos/auth-actions.ts` |
| `WorkOSAuthMessages` | Type | `packages/auth-pages/src/workos/auth-actions.ts` |
| `WorkOSAuthProvider` | Type | `packages/auth-pages/src/workos/auth-actions.ts` |
| `WorkOSCreateSessionArgs` | Type | `packages/auth-pages/src/workos/auth-actions.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
