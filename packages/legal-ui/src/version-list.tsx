'use client';

import type { ReactNode } from 'react';

import { cn, useKitTexts } from '@carefully-built/ui';

import { readerTexts } from './reader-texts';

export type DocumentVersionStatus = 'active' | 'archived' | 'draft';

export interface DocumentVersion {
  readonly id: string;
  /** Short identifier shown in mono, e.g. `v3`. */
  readonly label: string;
  readonly description?: ReactNode;
  readonly status: DocumentVersionStatus;
  /** Replaces the default status text, e.g. `Active since 12/03/2026`. */
  readonly statusLabel?: string;
}

export interface VersionListClassNames {
  readonly root?: string;
  readonly list?: string;
  readonly item?: string;
  /** The row itself: a button when rows are selectable. */
  readonly row?: string;
  readonly selectedRow?: string;
  readonly label?: string;
  readonly description?: string;
  readonly status?: string;
  readonly note?: string;
  readonly empty?: string;
}

export interface VersionListLabels {
  readonly active?: string;
  readonly archived?: string;
  readonly draft?: string;
  readonly empty?: string;
}

export interface VersionListProps<TVersion extends DocumentVersion = DocumentVersion> {
  readonly versions: readonly TVersion[];
  readonly selectedId?: string;
  /** Makes the rows buttons. Without it the list is read-only. */
  readonly onSelect?: (id: string, version: TVersion) => void;
  /** Footer text, e.g. a reminder that published versions cannot be edited. */
  readonly note?: ReactNode;
  readonly labels?: VersionListLabels;
  readonly 'aria-label'?: string;
  readonly className?: string;
  readonly classes?: VersionListClassNames;
}

const statusClasses: Record<DocumentVersionStatus, string> = {
  active: 'text-emerald-600 dark:text-emerald-400',
  archived: 'text-muted-foreground',
  draft: 'text-amber-600 dark:text-amber-400',
};

/** The versions of a document, each with its status. Rows can be selectable. */
export function VersionList<TVersion extends DocumentVersion = DocumentVersion>({
  versions,
  selectedId,
  onSelect,
  note,
  labels,
  'aria-label': ariaLabel,
  className,
  classes,
}: VersionListProps<TVersion>): React.ReactElement {
  const texts = useKitTexts(readerTexts, {
    statusActive: labels?.active,
    statusArchived: labels?.archived,
    statusDraft: labels?.draft,
    noVersions: labels?.empty,
  });
  const statusTexts: Record<DocumentVersionStatus, string> = {
    active: texts.statusActive,
    archived: texts.statusArchived,
    draft: texts.statusDraft,
  };

  return (
    <div
      data-slot="version-list"
      className={cn(
        'border-border bg-card text-card-foreground w-full overflow-hidden rounded-md border',
        className,
        classes?.root,
      )}
    >
      {versions.length === 0 ? (
        <p className={cn('text-muted-foreground px-4 py-6 text-center text-sm', classes?.empty)}>
          {texts.noVersions}
        </p>
      ) : (
        <ul aria-label={ariaLabel} className={cn('flex list-none flex-col', classes?.list)}>
          {versions.map((version) => {
            const selected = version.id === selectedId;
            const rowClassName = cn(
              'flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm',
              onSelect &&
                'hover:bg-muted/50 focus-visible:ring-ring/50 cursor-pointer outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset',
              selected && 'bg-muted',
              classes?.row,
              selected && classes?.selectedRow,
            );
            const content = (
              <>
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className={cn('text-foreground shrink-0 font-mono text-[13px] font-medium', classes?.label)}>
                    {version.label}
                  </span>
                  {version.description !== undefined ? (
                    <>
                      <span aria-hidden="true" className="text-muted-foreground">
                        ·
                      </span>
                      <span className={cn('text-muted-foreground min-w-0 truncate', classes?.description)}>
                        {version.description}
                      </span>
                    </>
                  ) : null}
                </span>
                <span
                  data-status={version.status}
                  className={cn(
                    'shrink-0 text-xs font-medium',
                    statusClasses[version.status],
                    classes?.status,
                  )}
                >
                  {version.statusLabel ?? statusTexts[version.status]}
                </span>
              </>
            );

            return (
              <li
                key={version.id}
                className={cn('border-border border-b last:border-b-0', classes?.item)}
              >
                {onSelect ? (
                  <button
                    type="button"
                    aria-current={selected ? 'true' : undefined}
                    data-selected={selected ? '' : undefined}
                    onClick={() => {
                      onSelect(version.id, version);
                    }}
                    className={rowClassName}
                  >
                    {content}
                  </button>
                ) : (
                  <div data-selected={selected ? '' : undefined} className={rowClassName}>
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {note !== undefined ? (
        <p
          className={cn(
            'border-border bg-muted/40 text-muted-foreground border-t px-4 py-2.5 text-xs',
            classes?.note,
          )}
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}
