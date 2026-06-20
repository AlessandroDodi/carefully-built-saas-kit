export type AutomationTriggerType =
  | 'entity_created'
  | 'field_changed'
  | 'scheduled_time'
  | 'valuation_created';

export type AutomationActionType =
  | 'send_whatsapp'
  | 'send_email'
  | 'add_tag'
  | 'update_field';

export type AutomationStepType = AutomationActionType | 'delay' | 'filter' | 'path';

export interface FieldChangedTriggerDraft {
  readonly type: 'field_changed';
  readonly entityType: string;
  readonly field: string;
  readonly from: string;
  readonly to: string;
}

export interface EntityCreatedTriggerDraft {
  readonly type: 'entity_created';
  readonly entityType: string;
}

export type AutomationTriggerDraft =
  | FieldChangedTriggerDraft
  | EntityCreatedTriggerDraft
  | {
      readonly type: Exclude<AutomationTriggerType, 'field_changed' | 'entity_created'>;
    };

export interface AutomationConditionDraft {
  readonly field: string;
  readonly operator: 'equals' | 'not_equals' | 'is_empty' | 'is_filled' | 'contains' | 'before' | 'after';
  readonly value: string;
}

export interface AutomationConditionGroupDraft {
  readonly id: string;
  readonly conditions: readonly AutomationConditionDraft[];
}

export type AutomationActionTargetEntity =
  | 'trigger_entity'
  | 'related_contact'
  | 'related_opportunity'
  | 'contact'
  | 'property'
  | 'request'
  | 'opportunity'
  | 'activity'
  | 'note'
  | 'document';

export type AutomationActionConfig =
  | {
      readonly type: 'send_email';
      readonly recipient: 'entity_email' | 'assigned_user' | 'custom';
      readonly templateId: string;
    }
  | {
      readonly type: 'send_whatsapp';
      readonly recipient: 'entity_phone' | 'assigned_user' | 'custom';
      readonly templateId: string;
    }
  | {
      readonly type: 'add_tag';
      readonly targetEntity: AutomationActionTargetEntity;
      readonly tagId: string;
    }
  | {
      readonly type: 'update_field';
      readonly targetEntity: AutomationActionTargetEntity;
      readonly field: string;
      readonly value: string;
    };

export type AutomationStepConfig =
  | AutomationActionConfig
  | {
      readonly type: 'delay';
      readonly amount: number;
      readonly unit: 'minutes' | 'hours' | 'days';
    }
  | {
      readonly type: 'filter';
      readonly entityType: string;
      readonly filterGroups: readonly AutomationConditionGroupDraft[];
    }
  | {
      readonly type: 'path';
      readonly branches: readonly AutomationPathBranchDraft[];
    };

export interface AutomationPathBranchDraft {
  readonly id: string;
  readonly name: string;
  readonly filterGroups: readonly AutomationConditionGroupDraft[];
}

export interface AutomationStepInput {
  readonly id: string;
  readonly name: string;
  readonly type: AutomationStepType;
  readonly config?: AutomationStepConfig;
}

export interface AutomationDraftInput {
  readonly name: string;
  readonly trigger: AutomationTriggerDraft;
  readonly steps: readonly AutomationStepInput[];
}

export interface AutomationStepDraft {
  readonly order: number;
  readonly name: string;
  readonly type: AutomationStepType;
  readonly config?: AutomationStepConfig;
}

export interface AutomationDraft {
  readonly name: string;
  readonly trigger: AutomationTriggerDraft;
  readonly steps: readonly AutomationStepDraft[];
}

export interface AutomationDraftValidation {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

function getStepConfigError(step: AutomationStepInput): string | null {
  if (!step.config) {
    return 'Configura tutti gli step prima di salvare.';
  }

  if (step.type === 'add_tag' && step.config.type === 'add_tag' && !step.config.tagId.trim()) {
    return 'Scegli il tag da aggiungere.';
  }

  if (step.type === 'send_email' && step.config.type === 'send_email' && !step.config.templateId.trim()) {
    return 'Scegli il template email.';
  }

  if (step.type === 'send_whatsapp' && step.config.type === 'send_whatsapp' && !step.config.templateId.trim()) {
    return 'Scegli il template WhatsApp.';
  }

  if (step.type === 'update_field' && step.config.type === 'update_field') {
    if (!step.config.field.trim()) {
      return 'Choose the field to edit.';
    }

    if (!step.config.value.trim()) {
      return 'Enter the new field value.';
    }
  }

  if (step.type === 'delay' && step.config.type === 'delay' && step.config.amount <= 0) {
    return 'Set a valid delay duration.';
  }

  if (
    step.type === 'filter'
    && step.config.type === 'filter'
    && step.config.filterGroups.every((group) => group.conditions.length === 0)
  ) {
    return 'Add at least one condition to the filter.';
  }

  if (step.type === 'path' && step.config.type === 'path') {
    if (step.config.branches.length < 2) {
      return 'Configura almeno due percorsi.';
    }

    if (step.config.branches.some((branch) => branch.filterGroups.every((group) => group.conditions.length === 0))) {
      return 'Configura le condizioni di ogni percorso.';
    }
  }

  if (step.type !== step.config.type) {
    return 'La configurazione dello step non corrisponde al tipo di azione.';
  }

  return null;
}

export function validateAutomationDraftInput(input: AutomationDraftInput): AutomationDraftValidation {
  const errors = input.steps
    .map(getStepConfigError)
    .filter((error): error is string => Boolean(error));

  return {
    isValid: errors.length === 0 && Boolean(input.trigger),
    errors,
  };
}

export function buildAutomationDraft(input: AutomationDraftInput): AutomationDraft {
  return {
    name: input.name.trim() || 'Nuova Automazione',
    trigger: input.trigger,
    steps: input.steps.map((step, index) => ({
      order: index + 1,
      name: step.name.trim() || `Step ${String(index + 1)}`,
      type: step.type,
      config: step.config,
    })),
  };
}
