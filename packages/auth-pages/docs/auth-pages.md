# Auth Pages

Reusable SaaS auth presentation: layout, legal consent, social buttons, and standard email/password forms.

## Imports

```tsx
import { AuthLayout, LegalConsent } from '@carefully-built/auth-pages';
import { LoginEmailForm } from '@carefully-built/auth-pages/forms';
import { useForgotPasswordForm, useUpdatePasswordForm } from '@carefully-built/auth-pages/controllers';
import { OrganizationSelectionPage } from '@carefully-built/auth-pages/organizations';
import { AuthLoginPage, AuthEmailLoginPage } from '@carefully-built/auth-pages/pages';
import { SocialLoginButtons } from '@carefully-built/auth-pages/social';
import { createWorkOSAuthActions } from '@carefully-built/auth-pages/workos';
```

## Current Components

- `AuthLayout`: brandable layout with logo and optional side visual.
- `AuthBottomNav`: login/signup cross-link.
- `LegalConsent`: terms, privacy, and cookie policy consent text.
- `SocialLoginButtons`: provider buttons plus optional email fallback.
- `LoginEmailForm`, `SignupEmailForm`, `ForgotPasswordForm`, `UpdatePasswordForm`: presentational forms.
- `useForgotPasswordForm`: default controller for reset email state, validation, loading, success, and errors.
- `useUpdatePasswordForm`: default controller for reset token validation, password confirmation, loading, success callback, and errors.
- `createWorkOSAuthActions`: server-side WorkOS action factory for Google auth URLs, email/password auth, reset emails, reset password, and sign out.
- `OrganizationSelectionPage`: reusable page for choosing among WorkOS organizations, with optional logos and built-in search.
- `AuthLoginPage`, `AuthEmailLoginPage`, `AuthSignupPage`, `AuthForgotPasswordPage`, `AuthUpdatePasswordPage`: full-page defaults for apps that want auth with minimal app code.

## Basic Example

```tsx
<AuthLayout
  title="Welcome back"
  subtitle="Sign in to continue"
  logo={<Logo />}
  visual={{ backgroundSrc: '/auth-bg.png', foregroundSrc: '/auth-product.png' }}
>
  <SocialLoginButtons providers={providers} emailHref="/login/email" />
  <LoginEmailForm state={loginState} />
</AuthLayout>
```

## Package Owns

- Auth page layout.
- Shared auth copy structure.
- Legal consent rendering.
- Provider button UI.
- Standard form presentation.
- Default forgot-password and update-password controller logic.
- Default email/password validation messages.
- Generic WorkOS action orchestration.
- Invitation token extraction and propagation.
- Organization selection UI and empty state.
- Full-page lazy-mode auth screens.

## App Owns

- WorkOS client and client id.
- Session handling.
- Redirect behavior.
- Product branding values.
- Server-side secrets.
- Passing app-specific server actions into the default controllers.
- App-specific database sync callbacks such as Convex user sync.
- Optional organization metadata loading, such as logos from Convex.

## Password Controller Example

```tsx
'use client';

import { ForgotPasswordForm } from '@carefully-built/auth-pages/forms';
import { useForgotPasswordForm } from '@carefully-built/auth-pages/controllers';

import { sendPasswordResetEmail } from './actions';

export function ForgotPassword(): React.ReactElement {
  const state = useForgotPasswordForm({ sendPasswordResetEmail });

  return <ForgotPasswordForm {...state} />;
}
```

## Organization Selection Example

```tsx
import { OrganizationSelectionPage } from '@carefully-built/auth-pages/organizations';

export default async function SelectOrganizationPage(): Promise<React.ReactElement> {
  const pending = await getPendingOrganizationSelection();

  if (!pending) {
    redirect('/login?error=organization_selection_expired');
  }

  return (
    <OrganizationSelectionPage
      organizations={await loadOrganizationsWithLogos(pending.organizations)}
      title="Benvenuto su My SaaS"
      description="Seleziona l'organizzazione con cui vuoi continuare."
    />
  );
}
```

## Styling Example

All styling props are optional and default to the package style. Use `className` for simple root changes and `classes` for named internal slots.

```tsx
<AuthLayout
  title="Welcome back"
  subtitle="Sign in to continue"
  logo={<Logo />}
  classes={{
    root: 'bg-background',
    content: 'max-w-sm',
    title: 'text-2xl',
  }}
  visual={{
    backgroundSrc: '/auth-bg.png',
    className: 'bg-muted',
    foregroundClassName: 'shadow-xl',
  }}
>
  <LoginEmailForm state={loginState} className="gap-4" buttonClassName="w-full" />
</AuthLayout>
```

Organization selection exposes both page-level and selector-level slots:

```tsx
<OrganizationSelectionPage
  organizations={organizations}
  pageClasses={{ content: 'max-w-md' }}
  classes={{
    search: 'h-10',
    item: 'hover:bg-muted/70',
    logoFallback: 'bg-primary text-primary-foreground',
  }}
/>;
```

## WorkOS Server Action Example

```ts
'use server';

import { createWorkOSAuthActions } from '@carefully-built/auth-pages/workos';
import { redirect } from 'next/navigation';

export const {
  getGoogleAuthUrl,
  signUp,
  signIn,
  sendPasswordResetEmail,
  resetPassword,
  signOutAction,
} = createWorkOSAuthActions({
  workos,
  clientId: WORKOS_CLIENT_ID,
  getRedirectUri,
  createSession,
  deleteSession,
  redirect,
  onAuthenticated: syncAuthenticatedUser,
  defaultAuthenticatedPath: '/dashboard',
  afterSignOutPath: '/',
});
```

## Lazy Page Example

```tsx
'use client';

import { AuthLoginPage } from '@carefully-built/auth-pages/pages';

import { getGoogleAuthUrl } from './actions';

export default function LoginPage(): React.ReactElement {
  return (
    <AuthLoginPage
      providers={[{ name: 'Google', icon: '/google.svg', action: getGoogleAuthUrl }]}
      logo={<Logo />}
      visual={{ backgroundSrc: '/auth-bg.png' }}
      legal={{ termsHref: '/terms', privacyHref: '/privacy' }}
    />
  );
}
```

When you need custom behavior, keep using the lower-level exports:

```tsx
import { AuthLayout } from '@carefully-built/auth-pages';
import { LoginEmailForm } from '@carefully-built/auth-pages/forms';
import { useLoginForm } from '@carefully-built/auth-pages/controllers';
```

```tsx
'use client';

import { UpdatePasswordForm } from '@carefully-built/auth-pages/forms';
import { useUpdatePasswordForm } from '@carefully-built/auth-pages/controllers';

import { resetPassword } from './actions';

export function UpdatePassword({
  token,
  onSuccess,
}: {
  readonly token: string | null;
  readonly onSuccess: () => void;
}): React.ReactElement {
  const state = useUpdatePasswordForm({
    token,
    resetPassword,
    onSuccess,
  });

  return <UpdatePasswordForm {...state} />;
}
```

## Target API

The final goal is one import and one config object:

```tsx
import { AuthRoutes } from '@carefully-built/auth-pages';

<AuthRoutes
  config={{
    productName: 'My SaaS',
    logo: '/logo.svg',
    layout: 'split-image',
    visual: { backgroundSrc: '/auth-bg.png' },
    legal: {
      termsHref: '/terms',
      privacyHref: '/privacy',
      cookieHref: '/cookies',
    },
    workos: workosAdapter,
  }}
/>;
```

The consuming app should stay under 200 LOC for the full auth flow.

## Open Decisions

- Add `AuthRoutes`.
- Add invite acceptance page.
- Add standard error pages for expired/failed auth flow.
