# Carefully Built Legal UI

Reusable legal document renderer for SaaS terms, privacy, and cookie-policy pages.

## Install

```bash
bun add @carefully-built/legal-ui
```

## Basic Usage

```tsx
import { LegalDocument } from '@carefully-built/legal-ui';

<LegalDocument
  title="Privacy Policy"
  content={privacyPolicyText}
  logo={<Logo className="h-9" />}
  backHref="/login"
/>;
```

The consuming app owns the actual legal text. This package owns the readable document layout, heading detection, URL rendering, and standard back/logo frame.

## Styling And Theming

Use optional `className` and `classes` props for product-specific presentation. Defaults stay unchanged when omitted.

```tsx
<LegalDocument
  title="Terms of Service"
  content={termsText}
  logo={<Logo />}
  backHref="/login"
  classes={{
    container: 'max-w-3xl',
    content: 'text-sm leading-7',
    heading: 'text-lg',
    link: 'underline-offset-4',
  }}
/>;
```

Keep the legal text and route ownership in the app. Do not copy this renderer into an app just to change spacing, typography, or link styling.
