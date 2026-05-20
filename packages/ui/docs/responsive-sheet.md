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

## Open Decisions

- Add built-in dirty-state confirmation.
- Add nested sheet rules.
- Add standardized async submit footer.
