# @carefully-built/agent-picker

Reusable agent/user picker for SaaS forms.

## Install

```bash
bun add @carefully-built/agent-picker
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/agent-picker`

## Component Usage

```tsx
import { AgentPicker } from '@carefully-built/agent-picker';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AgentPicker`: import from `@carefully-built/agent-picker`.

## Helper Usage

```ts
import { AgentPicker } from '@carefully-built/agent-picker';
```

Helpers in this package:

- `AgentPicker`
- `buildAgentInitials`
- `buildAgentInitials`
- `filterAgentsBySearch`
- `filterAgentsBySearch`
- `filterSelectableAgents`
- `filterSelectableAgents`
- `formatAgentDisplayName`
- `formatAgentDisplayName`
- `toggleAgentSelection`
- `toggleAgentSelection`

## Types And Schemas

- `AgentPickerOption`
- `AgentPickerProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AgentPicker` | Component | `packages/agent-picker/src/agent-picker.tsx` |
| `AgentPicker` | Helper | `packages/agent-picker/src/index.ts` |
| `buildAgentInitials` | Helper | `packages/agent-picker/src/agent-picker-utils.ts` |
| `buildAgentInitials` | Helper | `packages/agent-picker/src/index.ts` |
| `filterAgentsBySearch` | Helper | `packages/agent-picker/src/agent-picker-utils.ts` |
| `filterAgentsBySearch` | Helper | `packages/agent-picker/src/index.ts` |
| `filterSelectableAgents` | Helper | `packages/agent-picker/src/agent-picker-utils.ts` |
| `filterSelectableAgents` | Helper | `packages/agent-picker/src/index.ts` |
| `formatAgentDisplayName` | Helper | `packages/agent-picker/src/agent-picker-utils.ts` |
| `formatAgentDisplayName` | Helper | `packages/agent-picker/src/index.ts` |
| `toggleAgentSelection` | Helper | `packages/agent-picker/src/agent-picker-utils.ts` |
| `toggleAgentSelection` | Helper | `packages/agent-picker/src/index.ts` |
| `AgentPickerOption` | Type | `packages/agent-picker/src/agent-picker-utils.ts` |
| `AgentPickerProps` | Type | `packages/agent-picker/src/agent-picker.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
