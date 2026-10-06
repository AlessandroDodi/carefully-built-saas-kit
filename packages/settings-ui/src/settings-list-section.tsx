"use client";

import type { ReactNode } from "react";

import { SmartTable, type Column, type SortState } from "@carefully-built/ui";

import { SettingsAddButton } from "./settings-controls";
import { SettingsSectionCard } from "./settings-section-card";

export interface SettingsListSectionProps<T> {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly rows: T[];
  readonly columns: Column<T>[];
  readonly isLoading?: boolean;
  readonly action?: ReactNode;
  readonly addLabel?: string;
  readonly onAdd?: () => void;
  readonly getRowKey: (row: T) => string | number;
  readonly renderActions?: (row: T) => ReactNode;
  readonly renderMobileCard?: (row: T) => ReactNode;
  readonly emptyState?: ReactNode;
  readonly sortState?: SortState;
  readonly onSortChange?: (state: SortState) => void;
  readonly contentClassName?: string;
}

export function SettingsListSection<T>({
  title,
  subtitle,
  rows,
  columns,
  isLoading = false,
  action,
  addLabel,
  onAdd,
  getRowKey,
  renderActions,
  renderMobileCard,
  emptyState,
  sortState,
  onSortChange,
  contentClassName = "space-y-4",
}: SettingsListSectionProps<T>): React.ReactElement {
  return (
    <SettingsSectionCard
      title={title}
      subtitle={subtitle}
      action={
        action ??
        (onAdd ? (
          <SettingsAddButton label={addLabel} onClick={onAdd} />
        ) : undefined)
      }
      contentClassName={contentClassName}
    >
      <SmartTable
        data={rows}
        columns={columns}
        isLoading={isLoading}
        getRowKey={getRowKey}
        renderActions={renderActions}
        renderMobileCard={renderMobileCard}
        noDataContent={emptyState}
        sortState={sortState}
        onSortChange={onSortChange}
      />
    </SettingsSectionCard>
  );
}
