import type { AssociationEntityType } from './associationTypeMeta';
import type { ReactNode } from 'react';

export interface AssociationPickerOption {
  readonly value: string;
  readonly entityId: string;
  readonly entityType: AssociationEntityType;
  readonly label: string;
  readonly typeLabel: string;
  readonly imageUrl?: string;
}

export interface AssociationPickerCreateResult {
  readonly option: AssociationPickerOption;
}

export interface AssociationPickerCreateRendererProps {
  readonly onCancel: () => void;
  readonly onCreated: (result: AssociationPickerCreateResult) => void;
  readonly setConfirmDisabled?: (value: boolean) => void;
}

export interface AssociationPickerCreateHandler {
  readonly formId?: string;
  readonly confirmLabel?: string;
  readonly confirmDisabled?: boolean;
  readonly render: (props: AssociationPickerCreateRendererProps) => ReactNode;
}

export interface AssociationPickerCreateConfig {
  readonly currentEntityType?: AssociationEntityType;
  readonly handlers: Partial<Record<AssociationEntityType, AssociationPickerCreateHandler>>;
}

export interface AssociationPickerProps {
  readonly options: AssociationPickerOption[];
  readonly value: string[];
  readonly onChange: (value: string[]) => void;
  readonly maxSelections?: number;
  readonly allowedEntityTypes?: readonly AssociationEntityType[];
  readonly excludedEntityTypes?: readonly AssociationEntityType[];
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly createConfig?: AssociationPickerCreateConfig;
}

export type AssociationFilterType = 'all' | AssociationEntityType;
