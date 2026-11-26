'use client';

import { ArrowDown, Check } from 'lucide-react';
import { useRef } from 'react';

import type { ReactNode } from 'react';

import { cn, useKitTexts } from '@carefully-built/ui';

import { readerTexts } from './reader-texts';
import { useReadProgress } from './use-read-progress';

import type { ReadProgressState } from './read-progress';
import type { UseReadProgressResult } from './use-read-progress';

export interface DocumentReaderClassNames {
  readonly root?: string;
  readonly header?: string;
  readonly title?: string;
  readonly meta?: string;
  /** The scrolling area. */
  readonly body?: string;
  /** The wrapper around `children` inside the scrolling area. */
  readonly content?: string;
  readonly footer?: string;
  readonly status?: string;
}

export interface DocumentReaderLabels {
  /** Status line while the end has not been reached. */
  readonly scrollHint?: string;
  /** Status line once the end has been reached. */
  readonly reachedEnd?: string;
}

export interface DocumentReaderProps {
  readonly title?: ReactNode;
  /** Shown next to the title in mono, e.g. a version and a date. */
  readonly meta?: ReactNode;
  /** The text to read. */
  readonly children: ReactNode;
  /**
   * The result of a `useReadProgress` call made by the parent. Pass it when
   * something outside the reader (a progress bar, a continue button) needs the
   * same state; the reader then attaches that hook's refs instead of tracking
   * on its own, and `enabled`, `resetKey`, `tolerance`, `onProgress` and
   * `onReachEnd` belong on the parent's hook call.
   */
  readonly readProgress?: UseReadProgressResult;
  /** Set to false while the text is loading, so an empty body does not count as read. */
  readonly enabled?: boolean;
  /** Start over when this changes, e.g. the id of the version shown. */
  readonly resetKey?: string | number | null;
  /** Pixels from the bottom that still count as the end. Defaults to 8. */
  readonly tolerance?: number;
  readonly onProgress?: (state: ReadProgressState) => void;
  /** Called once, the first time the end is reached. */
  readonly onReachEnd?: (state: ReadProgressState) => void;
  /** Hide the status line under the text. */
  readonly showStatus?: boolean;
  readonly labels?: DocumentReaderLabels;
  /** Accessible name of the scrolling area when `title` is not plain text. */
  readonly 'aria-label'?: string;
  readonly className?: string;
  readonly classes?: DocumentReaderClassNames;
}

/**
 * A card that shows a document to be read to the end: header, scrolling text
 * and a status line that confirms when the end was reached.
 *
 * The card needs a bounded height for the text to scroll, so it is capped at
 * 80% of the viewport by default; pass `className="max-h-none"` when the
 * parent already sets the height.
 */
export function DocumentReader({
  title,
  meta,
  children,
  readProgress,
  enabled = true,
  resetKey,
  tolerance,
  onProgress,
  onReachEnd,
  showStatus = true,
  labels,
  'aria-label': ariaLabel,
  className,
  classes,
}: DocumentReaderProps): React.ReactElement {
  const texts = useKitTexts(readerTexts, {
    scrollHint: labels?.scrollHint,
    reachedEnd: labels?.reachedEnd,
  });

  const ownRef = useRef<HTMLElement | null>(null);
  const own = useReadProgress(ownRef, {
    enabled: enabled && readProgress === undefined,
    resetKey,
    tolerance,
    onProgress,
    onReachEnd,
  });
  const reader = readProgress ?? own;
  const hasHeader = title !== undefined || meta !== undefined;

  return (
    <section
      data-slot="document-reader"
      data-reached-end={reader.reachedEnd ? '' : undefined}
      className={cn(
        'border-border bg-card text-card-foreground flex h-full max-h-[80dvh] min-h-0 w-full flex-col overflow-hidden rounded-md border',
        className,
        classes?.root,
      )}
    >
      {hasHeader ? (
        <header
          className={cn(
            'border-border flex shrink-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-5 py-3',
            classes?.header,
          )}
        >
          {title !== undefined ? (
            <h2 className={cn('text-foreground text-sm font-semibold', classes?.title)}>{title}</h2>
          ) : null}
          {meta !== undefined ? (
            <div className={cn('text-muted-foreground font-mono text-xs', classes?.meta)}>{meta}</div>
          ) : null}
        </header>
      ) : null}

      <div
        ref={(node) => {
          reader.scrollRef.current = node;
        }}
        role="region"
        aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
        // Focusable so the text can be scrolled from a keyboard.
        tabIndex={0}
        className={cn(
          'focus-visible:ring-ring/50 min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset',
          classes?.body,
        )}
      >
        <div className={cn('text-foreground text-[15px] leading-7', classes?.content)}>{children}</div>
        <div ref={reader.sentinelRef} aria-hidden="true" className="h-px w-full" />
      </div>

      {showStatus ? (
        <footer
          className={cn('border-border shrink-0 border-t px-5 py-2.5', classes?.footer)}
        >
          <p
            role="status"
            className={cn(
              'flex items-center gap-1.5 text-xs',
              reader.reachedEnd
                ? 'font-medium text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground',
              classes?.status,
            )}
          >
            {reader.reachedEnd ? (
              <Check aria-hidden="true" className="size-3.5 shrink-0" />
            ) : (
              <ArrowDown aria-hidden="true" className="size-3.5 shrink-0" />
            )}
            {reader.reachedEnd ? texts.reachedEnd : texts.scrollHint}
          </p>
        </footer>
      ) : null}
    </section>
  );
}
