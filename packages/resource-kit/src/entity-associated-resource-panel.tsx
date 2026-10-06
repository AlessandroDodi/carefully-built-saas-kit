"use client";

import { useMemo } from "react";

import { EntityAssociatedTabPanel } from "./entity-associated-tab-panel";
import {
  buildEntityAssociationOptions,
  buildEntityAssociationValue,
  type SupportedAssociationEntityType,
} from "./entity-detail-helpers";
import {
  useResourceSheetState,
  type ResourceId,
  type ResourceSheetState,
} from "./use-resource-sheet-state";

import type { AssociationPickerOption } from "@carefully-built/association-picker";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface EntityAssociationTarget {
  readonly entityType: SupportedAssociationEntityType;
  readonly entityId: string;
  readonly entityLabel?: string;
}

export interface EntityAssociationDefaults {
  readonly associationValue: string;
  readonly associations: readonly string[];
}

export interface UseEntityAssociationOptionsParams extends EntityAssociationTarget {
  readonly options: readonly AssociationPickerOption[] | undefined;
}

export function useEntityAssociationDefaults({
  entityType,
  entityId,
}: EntityAssociationTarget): EntityAssociationDefaults {
  return useMemo(() => {
    const associationValue = buildEntityAssociationValue(entityType, entityId);

    return {
      associationValue,
      associations: [associationValue],
    };
  }, [entityId, entityType]);
}

export function useEntityAssociationOptions({
  options,
  entityType,
  entityId,
  entityLabel = "",
}: UseEntityAssociationOptionsParams): AssociationPickerOption[] {
  return useMemo(
    () =>
      buildEntityAssociationOptions(options, {
        entityType,
        entityId,
        label: entityLabel,
      }),
    [entityId, entityLabel, entityType, options],
  );
}

export interface EntityAssociatedResourceRenderContext<
  TItem,
  TId extends ResourceId = ResourceId,
> extends ResourceSheetState<TItem, TId> {
  readonly associationDefaults: EntityAssociationDefaults;
}

export interface EntityAssociatedResourcePanelProps<
  TItem,
  TId extends ResourceId = ResourceId,
> extends EntityAssociationTarget {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly items: readonly TItem[];
  readonly getItemId: (item: TItem) => TId;
  readonly renderContent: (
    context: EntityAssociatedResourceRenderContext<TItem, TId>,
  ) => ReactNode;
  readonly renderSheet?: (
    context: EntityAssociatedResourceRenderContext<TItem, TId>,
  ) => ReactNode;
  readonly addLabel?: string;
  readonly addIcon?: ReactNode;
  readonly addDisabled?: boolean;
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly nameActions?: ReactNode;
  readonly buttonVariant?:
    | "default"
    | "outline"
    | "ghost"
    | "secondary"
    | "destructive";
  readonly isSameId?: (left: TId, right: TId) => boolean;
}

export function EntityAssociatedResourcePanel<
  TItem,
  TId extends ResourceId = ResourceId,
>({
  entityType,
  entityId,
  entityLabel,
  icon,
  name,
  items,
  getItemId,
  renderContent,
  renderSheet,
  addLabel,
  addIcon,
  addDisabled,
  actions,
  className,
  contentClassName,
  nameActions,
  buttonVariant,
  isSameId,
}: EntityAssociatedResourcePanelProps<TItem, TId>): React.ReactElement {
  const sheetState = useResourceSheetState({ items, getItemId, isSameId });
  const associationDefaults = useEntityAssociationDefaults({
    entityType,
    entityId,
    entityLabel,
  });
  const renderContext = useMemo<
    EntityAssociatedResourceRenderContext<TItem, TId>
  >(
    () => ({ ...sheetState, associationDefaults }),
    [associationDefaults, sheetState],
  );

  return (
    <EntityAssociatedTabPanel
      icon={icon}
      name={name}
      addLabel={addLabel}
      addIcon={addIcon}
      onAdd={actions ? undefined : sheetState.openCreate}
      addDisabled={addDisabled}
      actions={actions}
      className={className}
      contentClassName={contentClassName}
      nameActions={nameActions}
      buttonVariant={buttonVariant}
    >
      {renderContent(renderContext)}
      {renderSheet?.(renderContext)}
    </EntityAssociatedTabPanel>
  );
}
