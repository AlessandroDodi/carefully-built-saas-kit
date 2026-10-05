# ResponsiveSheet

Reusable edit/create/detail surface that renders as a desktop side sheet and mobile drawer.

## Import

```tsx
import { ResponsiveSheet } from '@carefully-built/ui';
```

## Use It For

- Create/edit forms.
- Detail quick views.
- Settings panels.
- Import/export setup flows.
- Confirmation flows that need more than a modal.

## Package Owns

- Desktop sheet and mobile drawer switching.
- Header/body/footer layout.
- Optional sticky footer actions.
- Cmd/Ctrl+Enter confirm shortcut helpers.

## App Owns

- Form content.
- Save/cancel mutation behavior.
- Domain copy and validation.
- **Every visible string.** The kit has no i18n, so each label is a prop with an
  English default: `cancelLabel` ("Cancel"), `confirmLabel` ("Save"),
  `confirmLoadingLabel` ("Saving...") and `closeLabel` ("Close", the accessible
  name of the X button). Omit one and English ships. `resolveResponsiveSheetLabels`
  is exported if you want to merge your copy over the defaults yourself; the same
  `closeLabel` prop exists on `DialogContent`, `DialogFooter`, `SheetContent` and
  `HelpInfoButton`.

## Unsaved Changes Guard

Pass `confirmCloseWhenDirty` and a close attempt — Escape, an outside click, the
X, or Cancel — is held back and turned into a confirmation instead:

```tsx
<ResponsiveSheet
  confirmCloseWhenDirty={{
    dirty: form.formState.isDirty,
    title: 'Modifiche non salvate',
    description: 'Se chiudi ora perderai le modifiche non salvate.',
    discardLabel: 'Chiudi senza salvare',
    stayLabel: 'Rimani',
  }}
/>
```

`confirmCloseWhenDirty={true}` guards with the default English copy. Every line
is overridable, as above. The same prop is forwarded by
`SettingsFormSheet` (`@carefully-built/settings-ui`) and `CrudResourceSheet`
(`@carefully-built/crud`).

For guarding a *route* exit rather than a sheet close, `useUnsavedRouteExitGuard`
+ `UnsavedChangesDialog` are exported for the same purpose.

## Open Decisions

- Add nested sheet rules.
- Add standardized async submit footer.
