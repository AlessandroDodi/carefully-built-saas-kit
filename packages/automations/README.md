# @carefully-built/automations

Reusable automation builder primitives for SaaS apps.

## Includes

- `AutomationBuilderCanvas` for the React Flow builder surface.
- `useAutomationBuilder` for draft state, step creation, and sidebar mode.
- Draft types and validators for triggers, actions, filters, paths, and delays.
- Default option metadata for trigger, action, and step pickers.

## Example

```tsx
import { AutomationBuilderCanvas, useAutomationBuilder } from '@carefully-built/automations';

export function Builder() {
  const builder = useAutomationBuilder();

  return (
    <AutomationBuilderCanvas
      trigger={builder.trigger}
      steps={builder.steps}
      onChooseTrigger={builder.openTriggerPicker}
      onSelectTrigger={builder.openTriggerConfig}
      onAddStep={builder.openStepTypes}
      onSelectStep={builder.selectStep}
      onDeleteStep={builder.deleteStep}
    />
  );
}
```
