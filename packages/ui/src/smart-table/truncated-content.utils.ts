import type { ColumnAlign } from './types';

export function getTruncatedContentAlignmentClass(
  align?: ColumnAlign
): string {
  if (align === 'right') {
    return 'text-right';
  }

  if (align === 'center') {
    return 'text-center';
  }

  return 'text-left';
}

export function shouldRenderTooltipTrigger(options: {
  tooltip?: string | null;
  isOverflowing: boolean;
}): boolean {
  return Boolean(options.tooltip) && options.isOverflowing;
}
