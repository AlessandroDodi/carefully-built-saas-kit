'use client';

import { CalendarDays, Plus } from 'lucide-react';

import { ActivityItem } from './activity-item';

import type { ActivityListItem } from './activity-helpers';
import type { ReactNode } from 'react';

import {
  buildActivityDisplayModel,
  toAlphaColor,
} from './activity-helpers';

import { Button, Card, CardContent, Chip } from '@carefully-built/ui';

interface ActivityListViewProps {
  readonly activities: ActivityListItem[];
  readonly currentUserId: string;
  readonly onEdit: (activity: ActivityListItem) => void;
  readonly onCreate: () => void;
  readonly emptyState?: ReactNode;
}

export function ActivityListView({
  activities,
  currentUserId,
  onEdit,
  onCreate,
  emptyState,
}: ActivityListViewProps): React.ReactElement {
  if (activities.length === 0) {
    return emptyState ? (
      <>{emptyState}</>
    ) : (
      <Card className="w-full border border-dashed border-border shadow-none ring-0">
        <CardContent className="flex flex-col items-center justify-start px-6 py-10 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CalendarDays className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-medium tracking-tight">Nessuna attività trovata</h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Crea la prima attività o modifica i filtri per vedere piu risultati.
            </p>
          </div>
          <Button className="mt-5" onClick={onCreate}>
            <Plus className="mr-2 size-4" />
            Aggiungi attività
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const displayModel = buildActivityDisplayModel(activity, {
          density: 'large',
          scope: 'week',
          viewerUserId: currentUserId,
        });
        const canEdit = !displayModel.isPrivatePlaceholder;

        return (
          <ActivityItem
            key={activity._id}
            density="large"
            name={displayModel.title}
            time={displayModel.timeLabel}
            assignee={displayModel.assigneeLabel}
            description={displayModel.description}
            isPrivatePlaceholder={displayModel.isPrivatePlaceholder}
            type={
              displayModel.typeLabel ? (
                <Chip
                  className="text-[11px]"
                  style={{
                    backgroundColor: toAlphaColor(activity.activityTypeColor, 0.14),
                    color: activity.activityTypeColor,
                  }}
                >
                  {displayModel.typeLabel}
                </Chip>
              ) : null
            }
            content={
              canEdit && activity.associations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activity.associations.slice(0, 3).map((association) => (
                    <Chip
                      key={association.value}
                      className="bg-muted text-muted-foreground"
                    >
                      {association.label}
                    </Chip>
                  ))}
                </div>
              ) : undefined
            }
            onClick={
              canEdit
                ? () => {
                    onEdit(activity);
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
