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
