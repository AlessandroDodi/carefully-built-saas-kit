# @carefully-built/automations

Reusable automation builder primitives, canvas, options, and draft validation for SaaS apps.

## Install

```bash
bun add @carefully-built/automations
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/automations`

## Component Usage

```tsx
import { AutomationBuilderCanvas } from '@carefully-built/automations';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AutomationBuilderCanvas`: import from `@carefully-built/automations`.

## Hook Usage

```tsx
import { useAutomationBuilder } from '@carefully-built/automations';

export function Example() {
  const state = useAutomationBuilder({} as never);
  return null;
}
```

Hooks in this package:

- `useAutomationBuilder`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { ACTION_OPTIONS } from '@carefully-built/automations';
```

Helpers in this package:

- `ACTION_OPTIONS`
- `buildAutomationDraft`
- `buildDefaultCondition`
- `getStepOption`
- `getTriggerOption`
- `STEP_KIND_OPTIONS`
- `TRIGGER_OPTIONS`

## Types And Schemas

- `AutomationActionConfig`
- `AutomationActionTargetEntity`
- `AutomationActionType`
- `AutomationConditionDraft`
- `AutomationConditionGroupDraft`
- `AutomationDraft`
- `AutomationDraftInput`
- `AutomationDraftValidation`
- `AutomationOption`
- `AutomationPathBranchDraft`
- `AutomationStepConfig`
- `AutomationStepDraft`
- `AutomationStepInput`
- `AutomationStepKind`
- `AutomationStepType`
- `AutomationTriggerDraft`
- `AutomationTriggerType`
- `EntityCreatedTriggerDraft`
- `FieldChangedTriggerDraft`
- `validateAutomationDraftInput`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AutomationBuilderCanvas` | Component | `packages/automations/src/automation-builder-canvas.tsx` |
| `ACTION_OPTIONS` | Helper | `packages/automations/src/automation-options.ts` |
| `buildAutomationDraft` | Helper | `packages/automations/src/automation-draft.ts` |
| `buildDefaultCondition` | Helper | `packages/automations/src/use-automation-builder.ts` |
| `getStepOption` | Helper | `packages/automations/src/automation-options.ts` |
| `getTriggerOption` | Helper | `packages/automations/src/automation-options.ts` |
| `STEP_KIND_OPTIONS` | Helper | `packages/automations/src/automation-options.ts` |
| `TRIGGER_OPTIONS` | Helper | `packages/automations/src/automation-options.ts` |
| `useAutomationBuilder` | Hook | `packages/automations/src/use-automation-builder.ts` |
| `AutomationActionConfig` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationActionTargetEntity` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationActionType` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationConditionDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationConditionGroupDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationDraftInput` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationDraftValidation` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationOption` | Type | `packages/automations/src/automation-options.ts` |
| `AutomationPathBranchDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationStepConfig` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationStepDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationStepInput` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationStepKind` | Type | `packages/automations/src/automation-options.ts` |
| `AutomationStepType` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationTriggerDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `AutomationTriggerType` | Type | `packages/automations/src/automation-draft.ts` |
| `EntityCreatedTriggerDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `FieldChangedTriggerDraft` | Type | `packages/automations/src/automation-draft.ts` |
| `validateAutomationDraftInput` | Type | `packages/automations/src/automation-draft.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
