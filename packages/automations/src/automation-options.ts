import {
  Clock3,
  FileText,
  Filter,
  GitBranch,
  Mail,
  MessageCircle,
  PlusCircle,
  Tag,
  TextCursorInput,
  TimerReset,
  type LucideIcon,
  UserPlus,
} from 'lucide-react';

import type { AutomationActionType, AutomationStepType, AutomationTriggerType } from './automation-draft';

export type AutomationStepKind = 'action' | 'filter' | 'delay' | 'path';

export interface AutomationOption<TType extends string> {
  readonly type: TType;
  readonly label: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly tone: string;
  readonly badgeTone: string;
}

export const TRIGGER_OPTIONS: readonly AutomationOption<AutomationTriggerType>[] = [
  {
    type: 'entity_created',
    label: 'Nuova entità',
    description: 'Quando una nuova entità è creata',
    icon: UserPlus,
    tone: 'bg-lime-100 text-lime-700',
    badgeTone: 'bg-lime-100 text-lime-700 ring-lime-200',
  },
  {
    type: 'field_changed',
    label: 'Modifica campo',
    description: 'Quando un campo è modificato',
    icon: TextCursorInput,
    tone: 'bg-cyan-100 text-cyan-700',
    badgeTone: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  },
  {
    type: 'scheduled_time',
    label: 'Tempo',
    description: 'Avvia una azione in un certo momento',
    icon: Clock3,
    tone: 'bg-sky-100 text-sky-700',
    badgeTone: 'bg-sky-100 text-sky-800 ring-sky-200',
  },
  {
    type: 'valuation_created',
    label: 'Nuova valutazione',
    description: 'Nuova valutazione compilata',
    icon: FileText,
    tone: 'bg-violet-100 text-violet-700',
    badgeTone: 'bg-violet-100 text-violet-800 ring-violet-200',
  },
];

export const ACTION_OPTIONS: readonly AutomationOption<AutomationActionType>[] = [
  {
    type: 'send_whatsapp',
    label: 'Manda messaggio',
    description: 'Manda un messaggio WhatsApp',
    icon: MessageCircle,
    tone: 'bg-emerald-100 text-emerald-700',
    badgeTone: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  },
  {
    type: 'send_email',
    label: 'Manda email',
    description: 'Manda una email',
    icon: Mail,
    tone: 'bg-cyan-100 text-cyan-700',
    badgeTone: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  },
  {
    type: 'add_tag',
    label: 'Aggiungi tag',
    description: 'Aggiungi un tag',
    icon: Tag,
    tone: 'bg-blue-100 text-blue-700',
    badgeTone: 'bg-blue-100 text-blue-800 ring-blue-200',
  },
  {
    type: 'update_field',
    label: 'Modifica campo',
    description: 'Modifica un campo',
    icon: TextCursorInput,
    tone: 'bg-fuchsia-100 text-fuchsia-700',
    badgeTone: 'bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200',
  },
];

export const STEP_KIND_OPTIONS: readonly AutomationOption<AutomationStepKind>[] = [
  {
    type: 'action',
    label: 'Azione',
    description: 'Esegui una operazione',
    icon: PlusCircle,
    tone: 'bg-emerald-100 text-emerald-700',
    badgeTone: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  },
  {
    type: 'filter',
    label: 'Filtro',
    description: 'Continua solo se le condizioni sono vere',
    icon: Filter,
    tone: 'bg-purple-100 text-purple-700',
    badgeTone: 'bg-purple-100 text-purple-800 ring-purple-200',
  },
  {
    type: 'delay',
    label: 'Attendi',
    description: 'Aspetta un certo tempo prima di continuare',
    icon: TimerReset,
    tone: 'bg-amber-100 text-amber-700',
    badgeTone: 'bg-amber-100 text-amber-800 ring-amber-200',
  },
  {
    type: 'path',
    label: 'Percorso',
    description: 'Dividi il flusso in rami condizionali',
    icon: GitBranch,
    tone: 'bg-indigo-100 text-indigo-700',
    badgeTone: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  },
];

export function getTriggerOption(type: AutomationTriggerType): AutomationOption<AutomationTriggerType> {
  const fallback = TRIGGER_OPTIONS[0];

  if (!fallback) {
    throw new Error('Missing trigger options');
  }

  return TRIGGER_OPTIONS.find((option) => option.type === type) ?? fallback;
}

export function getStepOption(type: AutomationStepType): AutomationOption<AutomationStepType> {
  const fallback = ACTION_OPTIONS[0];

  if (!fallback) {
    throw new Error('Missing step options');
  }

  const nonActionStep = STEP_KIND_OPTIONS.find((option) => option.type === type);

  if (nonActionStep && nonActionStep.type !== 'action') {
    return nonActionStep as AutomationOption<AutomationStepType>;
  }

  return ACTION_OPTIONS.find((option) => option.type === type) ?? fallback;
}
