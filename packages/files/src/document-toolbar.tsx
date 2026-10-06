'use client';

import type { AssociationPickerOption } from '@carefully-built/association-picker';
import { AssociationPicker } from '@carefully-built/association-picker';

import { TableToolbar } from '@carefully-built/ui';

export interface DocumentToolbarTagOption {
  readonly label: string;
  readonly value: string;
}

type ToolbarIcon = React.ComponentType<{ className?: string }>;

export interface DocumentToolbarProps {
  readonly associationOptions: AssociationPickerOption[];
  readonly tagOptions: readonly DocumentToolbarTagOption[];
  readonly search: string;
  readonly selectedAssociation: string;
  readonly selectedTag: string;
  readonly onSearchChange: (value: string) => void;
  readonly onAssociationChange: (value: string) => void;
  readonly onTagChange: (value: string) => void;
  readonly onClearAll: () => void;
  readonly getDraftResultCount: (draftValues: Record<string, string>) => number | undefined;
  readonly associationIcon?: ToolbarIcon;
  readonly tagIcon?: ToolbarIcon;
  readonly searchPlaceholder?: string;
  readonly associationLabel?: string;
  readonly tagLabel?: string;
}

export function DocumentToolbar({
  associationOptions,
  tagOptions,
  search,
  selectedAssociation,
  selectedTag,
  onSearchChange,
  onAssociationChange,
  onTagChange,
  onClearAll,
  getDraftResultCount,
  associationIcon,
  tagIcon,
  searchPlaceholder = 'Cerca',
  associationLabel = 'Associazione',
  tagLabel = 'Tag',
}: DocumentToolbarProps): React.ReactElement {
  return (
    <div className="shrink-0">
      <TableToolbar
        search={{
          value: search,
          onChange: onSearchChange,
          placeholder: searchPlaceholder,
        }}
        filters={[
          {
            config: {
              key: 'tag',
              label: tagLabel,
              icon: tagIcon as never,
              options: [...tagOptions],
            },
            value: selectedTag,
            onChange: onTagChange,
          },
        ]}
        customFilters={[
          {
            key: 'association',
            label: associationLabel,
            icon: associationIcon as never,
            value: selectedAssociation,
            clearValue: 'all',
            onChange: onAssociationChange,
            render: ({ value, setValue }) => (
              <AssociationPicker
                options={associationOptions}
                value={value === 'all' ? [] : [value]}
                onChange={(values) => {
                  setValue(values[0] ?? 'all');
                }}
                maxSelections={1}
                placeholder={`All: ${associationLabel}`}
                searchPlaceholder={`Search ${associationLabel.toLocaleLowerCase()}...`}
                className="w-full"
              />
            ),
          },
        ]}
        onClearAll={onClearAll}
        getDraftResultCount={getDraftResultCount}
      />
    </div>
  );
}
