'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';

import type { ActionHandlers, ActionLabels, ActionType } from '@/components/ui/smart-table/types';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

const SMART_TABLE_ACTIONS_CONTAINER_CLASS = 'flex w-full items-center justify-end gap-1';

interface SmartTableActionsProps<T> {
  item: T;
  actions?: ActionType[];
  actionLabels?: ActionLabels;
  actionHandlers?: ActionHandlers<T>;
  renderActions?: (item: T) => ReactNode;
}

const actionIcons: Record<ActionType, typeof Eye> = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
};

const defaultActionLabels: Record<ActionType, string> = {
  view: 'View',
  edit: 'Edit',
  delete: 'Delete',
};

export function SmartTableActions<T>({
  item,
  actions,
  actionLabels,
  actionHandlers,
  renderActions,
}: SmartTableActionsProps<T>): React.ReactElement | null {
  if (renderActions) {
    return <div className={SMART_TABLE_ACTIONS_CONTAINER_CLASS}>{renderActions(item)}</div>;
  }

  if (!actions || !actionHandlers) {
    return null;
  }

  return (
    <div className={SMART_TABLE_ACTIONS_CONTAINER_CLASS}>
      {actions.map((action) => {
        const Icon = actionIcons[action];
        const handler = actionHandlers[
          `on${action.charAt(0).toUpperCase()}${action.slice(1)}` as keyof ActionHandlers<T>
        ];

        return (
          <Button
            key={action}
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={actionLabels?.[action] ?? defaultActionLabels[action]}
            onClick={(event) => {
              event.stopPropagation();
              (handler as ((value: T) => void) | undefined)?.(item);
            }}
          >
            <Icon className="size-4" />
          </Button>
        );
      })}
    </div>
  );
}
