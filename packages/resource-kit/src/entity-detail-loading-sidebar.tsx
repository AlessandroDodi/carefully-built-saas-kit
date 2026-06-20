'use client';

import { Button, FieldDetailRow, Skeleton } from '@carefully-built/ui';
import { Pencil } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EntityDetailLoadingField {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly valueClassName?: string;
}

interface EntityDetailLoadingSidebarProps {
  readonly icon: LucideIcon;
  readonly title?: string;
  readonly fields: readonly EntityDetailLoadingField[];
  readonly media?: 'avatar' | 'image';
  readonly labelColumnClassName?: string;
  readonly titleSkeletonClassName?: string;
}

export function EntityDetailLoadingSidebar({
  icon: Icon,
  title,
  fields,
  media,
  labelColumnClassName,
  titleSkeletonClassName = 'h-4 w-36',
}: EntityDetailLoadingSidebarProps): React.ReactElement {
  return (
    <section className="bg-background h-full">
      <div className="mb-2 flex h-8 items-center justify-between gap-3">
        <div className="text-foreground flex items-center gap-2 text-[14px] font-medium">
          <Icon className="text-muted-foreground size-4" />
          {title ? <span>{title}</span> : <Skeleton className={titleSkeletonClassName} />}
        </div>
        <Button type="button" variant="ghost" size="icon-sm" disabled aria-label="Edit">
          <Pencil className="size-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {media === 'avatar' ? <AvatarLoadingBlock /> : null}
        {media === 'image' ? <Skeleton className="h-[139px] w-full rounded-[10px]" /> : null}

        <div className="space-y-0">
          {fields.map((field) => (
            <FieldDetailRow
              key={field.label}
              icon={field.icon}
              label={field.label}
              labelColumnClassName={labelColumnClassName}
              value={<FieldValueSkeleton className={field.valueClassName} />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AvatarLoadingBlock(): React.ReactElement {
  return (
    <div className="border-border/60 bg-muted/20 flex items-center gap-3 rounded-[10px] border p-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

function FieldValueSkeleton({
  className = 'h-4 w-32',
}: {
  readonly className?: string;
}): ReactNode {
  return <Skeleton className={className} />;
}
