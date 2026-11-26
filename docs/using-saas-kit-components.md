# Using SaaS Kit Components In Apps

This guide is for humans and AI agents working in consuming apps such as 20xDev or Immobiliare in Cloud. Before creating local auth, legal, error, CRUD, form, sheet, or table components, check this kit and import the reusable component.

## Default Rule

Use package components directly and keep the app small.

- App owns data loading, server actions, routing, copy, product assets, legal text, and domain mutations.
- SaaS kit owns reusable UI structure, accessibility behavior, responsive layout, loading/empty/error presentation, and repeated form/table/sheet mechanics.
- Style differences should go through app-level theme tokens, `className`, or `classes` slot props.
- Do not copy component source into the app unless the app is intentionally forking behavior that the kit should not own.
- If a reusable component is missing, add it to this repo first, document it, then consume it from the app.

## Styling Pattern

Most reusable components keep their default styling when no styling props are passed. For product-specific styling, pass top-level `className` props for simple changes and `classes` slot props for deeper changes.

Prefer a local config file in the consuming app:

```tsx
export const authPageClasses = {
  root: 'bg-background',
  title: 'text-foreground',
  subtitle: 'text-muted-foreground',
  content: 'max-w-sm',
};
```

Then pass those classes into the kit component:

```tsx
import { AuthLoginPage } from '@carefully-built/auth-pages/pages';

<AuthLoginPage
  logo={<Logo />}
  providers={providers}
  legal={legalLinks}
  classes={authPageClasses}
/>;
```

This keeps Tailwind class noise out of page files while still letting each product have its own look.

## App Shell

Use `@carefully-built/app-shell` for dashboard sidebars, mobile navigation, and content insets. The app should provide its product logo, routes, search, and footer slots.

```tsx
import { AppNavigationShell } from '@carefully-built/app-shell';

<AppNavigationShell
  currentPath={pathname}
  logo={<Logo />}
  darkLogo={<Logo variant="white" />}
  logoHref="/dashboard"
  navItems={navItems}
/>;
```

Pass `darkLogo` when the sidebar needs a white or otherwise dark-mode-specific product mark. If the app does not provide one, the shell reuses `logo`.

## Auth Pages

Use `@carefully-built/auth-pages/pages` for default auth pages. Use lower-level exports only when the app needs custom behavior.

```tsx
import { AuthLoginPage } from '@carefully-built/auth-pages/pages';

export default function LoginPage(): React.ReactElement {
  return (
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
      }}
    />
  );
}
```

Use `@carefully-built/auth-pages/organizations` for organization selection instead of hand-building card lists in app routes.

```tsx
import { OrganizationSelectionPage } from '@carefully-built/auth-pages/organizations';

<OrganizationSelectionPage
  organizations={organizations}
  title="Choose organization"
  description="Your account has access to multiple organizations."
  pageClasses={{
    content: 'max-w-md',
  }}
  classes={{
    item: 'hover:bg-muted/70',
  }}
/>;
```

## Legal Pages

Use `@carefully-built/legal-ui` for terms, privacy, and cookie pages. The app should only provide the text, logo, and routes.

```tsx
import { LegalDocument } from '@carefully-built/legal-ui';

<LegalDocument
  title="Privacy Policy"
  content={privacyPolicyText}
  logo={<Logo />}
  backHref="/login"
  classes={{
    container: 'max-w-3xl',
    content: 'text-sm leading-7',
    heading: 'text-lg',
  }}
/>;
```

## Documents That Must Be Read

Use `DocumentReader`, `useReadProgress` and `ReadProgressBar` from `@carefully-built/legal-ui` when the user has to read a text to the end before continuing, and `VersionList` to show the versions of that text. The app provides the text and decides what reaching the end unlocks.

```tsx
import { DocumentReader, ReadProgressBar, useReadProgress } from '@carefully-built/legal-ui';

const scrollRef = useRef<HTMLElement>(null);
const reading = useReadProgress(scrollRef, { enabled: text !== undefined, resetKey: versionId });

<DocumentReader title="Privacy notice" meta="v3 · 12/03/2026" readProgress={reading}>
  {text}
</DocumentReader>
<ReadProgressBar value={reading.progress} />
<Button disabled={!reading.reachedEnd}>Continue</Button>
```

Without `readProgress` the reader tracks on its own and reports through `onProgress` and `onReachEnd`.

## Signatures

Use `SignaturePad` from `@carefully-built/signature` instead of a hand-written canvas. It keeps only the shape of the signature (no pressure, tilt or timing), redraws on resize and rotation, and exports PNG or SVG through its ref.

```tsx
import { SignaturePad, type SignaturePadHandle } from '@carefully-built/signature';

const pad = useRef<SignaturePadHandle>(null);

<SignaturePad ref={pad} caption="Signature of Maria Rossi" onChange={({ isEmpty }) => setSigned(!isEmpty)} />;

const png = await pad.current?.toBlob({ trim: true, padding: 16 });
```

## Offline And Sync

Use `@carefully-built/offline` when data is collected on a device that may lose its connection. `createOfflineQueue` stores each item encrypted on the device before `enqueue` resolves and sends it when it can; `createEncryptedStore` is the same storage on its own. The app provides `send` and decides which errors are permanent.

```tsx
import { createOfflineQueue } from '@carefully-built/offline';
import { SyncStatusBadge, deriveSyncStatus, useOfflineQueue, useOnlineStatus } from '@carefully-built/offline/react';

export const queue = createOfflineQueue<Payload>({ name: 'submissions', send: postSubmission });

const online = useOnlineStatus();
const snapshot = useOfflineQueue(queue);

<SyncStatusBadge
  status={deriveSyncStatus({ online, pending: snapshot.pending, sending: snapshot.sending })}
  pendingCount={snapshot.pending + snapshot.sending}
/>;
```

## Error Pages

Use `SaasErrorPage` and `SaasNotFoundPage` from `@carefully-built/ui` in Next.js `error.tsx`, `global-error.tsx`, and `not-found.tsx`.

```tsx
'use client';

import { SaasErrorPage } from '@carefully-built/ui';

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): React.ReactElement {
  return (
    <SaasErrorPage
      error={error}
      reset={reset}
      source="app-error-boundary"
      classes={{ content: 'max-w-lg' }}
    />
  );
}
```

## CRUD Pages

Use `@carefully-built/crud` for repeated table and sheet mechanics.

- Use `useCrudTableState` when the page needs search, filters, sorting, pagination, and derived empty state.
- Use `CrudTableView` when the page wants the built-in toolbar plus `SmartTable`.
- Use `CrudListTable` when the page already owns its filters/toolbar and only needs the standard CRUD table.
- Use `CrudResourceSheet` for create/edit forms in a responsive sheet.

```tsx
import { CrudListTable, CrudResourceSheet, useCrudTableState } from '@carefully-built/crud';

const table = useCrudTableState({
  data: contacts,
  columns,
  searchFields: ['name', 'email'],
  filters,
});

<CrudListTable
  data={table.paginatedData}
  columns={columns}
  actions={['edit', 'delete']}
  actionHandlers={actionHandlers}
/>;

<CrudResourceSheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit contact"
  formId="contact-form"
  confirmLabel="Save"
  confirmLoading={isSaving}
  classes={{
    body: 'gap-4',
    footer: 'border-t',
  }}
>
  <ContactForm id="contact-form" />
</CrudResourceSheet>;
```

## UI Foundation

Use `@carefully-built/ui` primitives before adding local primitives.

- `ResponsiveSheet` for create/edit/detail flows that need desktop sheet and mobile drawer behavior.
- `SmartTable` for responsive data tables.
- `TableToolbar` for search and filters.
- `SaasErrorPage` and `SaasNotFoundPage` for application error states.
- `Button`, `Card`, `Input`, `Textarea`, `Label`, `Pagination`, `Skeleton`, and tooltips for shared shadcn-style primitives.
- `EventTimeline` for read-only logs and audit trails.
- `DeviceCodeInput` for pairing codes, one-time codes and PINs.

## When To Add New Props

Add optional props to the kit when the consuming app needs styling or composition that is broadly reusable:

- Add `className` for the root element.
- Add `contentClassName`, `footerClassName`, or similarly named simple slots for common layout changes.
- Add a `classes` object when the component has multiple meaningful internal slots.
- Keep defaults unchanged so existing apps do not need to pass anything.
- Document the new prop in the package README or package docs in the same change.

Do not add required styling props for product-specific look. The kit should work out of the box.
