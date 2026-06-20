'use client';

import {
  CalendarDays,
  CircleDashed,
  FileText,
  Handshake,
  House,
  NotebookPen,
  UserRound,
} from 'lucide-react';

export type AssociationEntityType =
  | 'contact'
  | 'property'
  | 'request'
  | 'opportunity'
  | 'activity'
  | 'note'
  | 'document';

export interface AssociationTypeChipMeta {
  readonly label: string;
  readonly className: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

export const associationTypeChipMeta: Record<AssociationEntityType, AssociationTypeChipMeta> = {
  contact: {
    label: 'Contact',
    className: 'bg-[#9770ff2b] text-[#250089] dark:bg-violet-500/25 dark:text-violet-200',
    icon: UserRound,
  },
  property: {
    label: 'Property',
    className: 'bg-[#ff8d281a] text-[#ff8d28] dark:bg-orange-500/20 dark:text-orange-200',
    icon: House,
  },
  request: {
    label: 'Request',
    className: 'bg-[#ffe1ea] text-[#b4234d] dark:bg-rose-500/20 dark:text-rose-200',
    icon: CircleDashed,
  },
  opportunity: {
    label: 'Opportunity',
    className: 'bg-[#70ff8f2b] text-[#008947] dark:bg-emerald-500/20 dark:text-emerald-200',
    icon: Handshake,
  },
  activity: {
    label: 'Agenda',
    className: 'bg-[#fee2e2] text-[#b91c1c] dark:bg-red-500/20 dark:text-red-200',
    icon: CalendarDays,
  },
  note: {
    label: 'Note',
    className: 'bg-[#ffe27a33] text-[#8a6d00] dark:bg-amber-500/20 dark:text-amber-200',
    icon: NotebookPen,
  },
  document: {
    label: 'Document',
    className: 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-blue-500/20 dark:text-blue-200',
    icon: FileText,
  },
};

export function normalizeAssociationEntityType(entityType: string): AssociationEntityType {
  if (entityType === 'file') {
    return 'document';
  }

  if (entityType in associationTypeChipMeta) {
    return entityType as AssociationEntityType;
  }

  return 'document';
}

export function getAssociationTypeChipMeta(entityType: string): AssociationTypeChipMeta {
  return associationTypeChipMeta[normalizeAssociationEntityType(entityType)];
}
