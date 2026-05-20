'use client';

import { useMemo, useState } from 'react';

import {
  buildAutomationDraft,
  validateAutomationDraftInput,
  type AutomationActionType,
  type AutomationActionTargetEntity,
  type AutomationConditionDraft,
  type AutomationDraft,
  type AutomationDraftValidation,
  type AutomationStepConfig,
  type AutomationStepInput,
  type AutomationStepType,
  type AutomationTriggerDraft,
  type AutomationTriggerType,
  type EntityCreatedTriggerDraft,
  type FieldChangedTriggerDraft,
} from './automation-draft';

type SidebarMode = 'triggers' | 'triggerConfig' | 'stepTypes' | 'actionTypes' | 'actionConfig';

interface AutomationBuilderState {
  readonly name: string;
  readonly trigger: AutomationTriggerDraft | null;
  readonly pendingTriggerType: AutomationTriggerType | null;
  readonly steps: readonly AutomationStepInput[];
  readonly draft: AutomationDraft | null;
  readonly validation: AutomationDraftValidation;
  readonly selectedStep: AutomationStepInput | null;
  readonly setName: (name: string) => void;
  readonly openTriggerPicker: () => void;
  readonly openTriggerConfig: () => void;
  readonly openStepTypePicker: () => void;
  readonly openActionTypePicker: () => void;
  readonly selectStepKind: (kind: 'action' | 'filter' | 'delay' | 'path') => AutomationStepInput | null;
  readonly selectTriggerType: (type: AutomationTriggerType) => AutomationTriggerDraft;
  readonly replaceTrigger: (trigger: AutomationTriggerDraft | null) => void;
  readonly commitStep: (step: AutomationStepInput) => void;
  readonly updateFieldTrigger: (trigger: FieldChangedTriggerDraft) => void;
  readonly updateEntityCreatedTrigger: (trigger: EntityCreatedTriggerDraft) => void;
  readonly confirmTrigger: () => void;
  readonly addStep: (type: AutomationStepType) => AutomationStepInput;
  readonly selectStep: (stepId: string) => void;
  readonly updateStepName: (stepId: string, name: string) => void;
  readonly updateStepConfig: (stepId: string, config: AutomationStepConfig) => void;
  readonly deleteStep: (stepId: string) => void;
  readonly openStepTypes: () => void;
  readonly sidebarMode: SidebarMode;
}

const defaultFieldTrigger: FieldChangedTriggerDraft = {
  type: 'field_changed',
  entityType: 'opportunity',
  field: 'stageKey',
  from: 'property:censito',
  to: 'property:valutazione',
};

const defaultEntityCreatedTrigger: EntityCreatedTriggerDraft = {
  type: 'entity_created',
  entityType: 'contact',
};

export function buildDefaultCondition(): AutomationConditionDraft {
  return {
    field: 'firstName',
    operator: 'equals',
    value: '',
  };
}

function getDefaultTargetEntity(trigger: AutomationTriggerDraft | null): AutomationActionTargetEntity {
  return trigger && 'entityType' in trigger ? 'trigger_entity' : 'contact';
}

function buildDefaultActionConfig(
  type: AutomationActionType,
  trigger: AutomationTriggerDraft | null,
): AutomationStepConfig {
  const targetEntity = getDefaultTargetEntity(trigger);

  switch (type) {
    case 'send_email':
      return {
        type,
        recipient: 'entity_email',
        templateId: '',
      };
    case 'send_whatsapp':
      return {
        type,
        recipient: 'entity_phone',
        templateId: '',
      };
    case 'add_tag':
      return {
        type,
        targetEntity,
        tagId: '',
      };
    case 'update_field':
      return {
        type,
        targetEntity,
        field: '',
        value: '',
      };
  }
}

function getTriggerEntityType(trigger: AutomationTriggerDraft | null): string {
  return trigger && 'entityType' in trigger ? trigger.entityType : 'contact';
}

function getDefaultStepName(type: AutomationStepType): string {
  switch (type) {
    case 'send_whatsapp':
      return 'Manda messaggio WhatsApp';
    case 'send_email':
      return 'Manda email';
    case 'add_tag':
      return 'Aggiungi tag';
    case 'update_field':
      return 'Modifica campo';
    case 'delay':
      return 'Attendi';
    case 'filter':
      return 'Filtro';
    case 'path':
      return 'Percorso';
  }
}

function buildDefaultStepConfig(
  type: AutomationStepType,
  trigger: AutomationTriggerDraft | null,
): AutomationStepConfig {
  const triggerEntityType = getTriggerEntityType(trigger);

  if (type === 'delay') {
    return {
      type,
      amount: 1,
      unit: 'days',
    };
  }

  if (type === 'filter') {
    return {
      type,
      entityType: triggerEntityType,
      filterGroups: [
        {
          id: `group-${crypto.randomUUID()}`,
          conditions: [buildDefaultCondition()],
        },
      ],
    };
  }

  if (type === 'path') {
    const createPathBranch = (name: string) => ({
      id: `branch-${crypto.randomUUID()}`,
      name,
      filterGroups: [
        {
          id: `group-${crypto.randomUUID()}`,
          conditions: [buildDefaultCondition()],
        },
      ],
    });

    return {
      type,
      branches: [createPathBranch('Percorso A'), createPathBranch('Percorso B')],
    };
  }

  return buildDefaultActionConfig(type, trigger);
}

export function useAutomationBuilder(): AutomationBuilderState {
  const [name, setName] = useState('Nuova Automazione');
  const [trigger, setTrigger] = useState<AutomationTriggerDraft | null>(null);
  const [pendingTriggerType, setPendingTriggerType] = useState<AutomationTriggerType | null>(null);
  const [steps, setSteps] = useState<readonly AutomationStepInput[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('triggers');

  const draft = useMemo(() => {
    if (!trigger) {
      return null;
    }

    return buildAutomationDraft({ name, trigger, steps });
  }, [name, steps, trigger]);
  const validation = useMemo(() => {
    if (!trigger) {
      return {
        isValid: false,
        errors: ['Scegli un trigger.'],
      };
    }

    return validateAutomationDraftInput({ name, trigger, steps });
  }, [name, steps, trigger]);
  const selectedStep = steps.find((step) => step.id === selectedStepId) ?? null;

  const selectTriggerType = (type: AutomationTriggerType): AutomationTriggerDraft => {
    const nextTrigger: AutomationTriggerDraft = type === 'field_changed'
      ? defaultFieldTrigger
      : type === 'entity_created'
        ? defaultEntityCreatedTrigger
        : { type };

    setPendingTriggerType(type);
    setSidebarMode('triggerConfig');

    return nextTrigger;
  };

  const updateFieldTrigger = (nextTrigger: FieldChangedTriggerDraft): void => {
    setTrigger(nextTrigger);
  };

  const updateEntityCreatedTrigger = (nextTrigger: EntityCreatedTriggerDraft): void => {
    setTrigger(nextTrigger);
  };

  const confirmTrigger = (): void => {
    setSidebarMode('stepTypes');
  };

  const createStepDraft = (type: AutomationStepType): AutomationStepInput => {
    const stepId = `step-${crypto.randomUUID()}`;
    const step = {
      id: stepId,
      name: getDefaultStepName(type),
      type,
      config: buildDefaultStepConfig(type, trigger),
    };

    setSelectedStepId(stepId);
    setSidebarMode('actionConfig');

    return step;
  };

  const addStep = (type: AutomationStepType): AutomationStepInput => {
    return createStepDraft(type);
  };

  const selectStepKind = (kind: 'action' | 'filter' | 'delay' | 'path'): AutomationStepInput | null => {
    if (kind === 'action') {
      setSidebarMode('actionTypes');
      return null;
    }

    return createStepDraft(kind);
  };

  const selectStep = (stepId: string): void => {
    setSelectedStepId(stepId);
    setSidebarMode('actionConfig');
  };

  const updateStepConfig = (stepId: string, config: AutomationStepConfig): void => {
    setSteps((currentSteps) => currentSteps.map((step) => (
      step.id === stepId ? { ...step, config } : step
    )));
  };

  const updateStepName = (stepId: string, nextName: string): void => {
    setSteps((currentSteps) => currentSteps.map((step) => (
      step.id === stepId ? { ...step, name: nextName } : step
    )));
  };

  const commitStep = (nextStep: AutomationStepInput): void => {
    setSteps((currentSteps) => {
      const existingStep = currentSteps.some((step) => step.id === nextStep.id);

      if (!existingStep) {
        return [...currentSteps, nextStep];
      }

      return currentSteps.map((step) => (step.id === nextStep.id ? nextStep : step));
    });
    setSelectedStepId(nextStep.id);
  };

  const deleteStep = (stepId: string): void => {
    setSteps((currentSteps) => currentSteps.filter((step) => step.id !== stepId));
    setSelectedStepId((currentSelectedStepId) => (
      currentSelectedStepId === stepId ? null : currentSelectedStepId
    ));
    setSidebarMode('stepTypes');
  };

  return {
    name,
    trigger,
    pendingTriggerType,
    steps,
    draft,
    validation,
    selectedStep,
    setName,
    openTriggerPicker: () => {
      setSidebarMode('triggers');
    },
    openTriggerConfig: () => {
      setSidebarMode(trigger ? 'triggerConfig' : 'triggers');
    },
    openStepTypePicker: () => {
      setSidebarMode('stepTypes');
    },
    openActionTypePicker: () => {
      setSidebarMode('actionTypes');
    },
    selectStepKind,
    selectTriggerType,
    replaceTrigger: setTrigger,
    commitStep,
    updateFieldTrigger,
    updateEntityCreatedTrigger,
    confirmTrigger,
    addStep,
    selectStep,
    updateStepName,
    updateStepConfig,
    deleteStep,
    openStepTypes: () => {
      setSidebarMode('stepTypes');
    },
    sidebarMode,
  };
}
