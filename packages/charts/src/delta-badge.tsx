import { cn } from '@carefully-built/ui';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export interface DeltaBadgeProps {
  /** Change versus the comparison period, as a ratio (0.15 = +15%). */
  readonly ratio: number | null;
  /** When a decrease is good news (costs), flip the colours. */
  readonly lowerIsBetter?: boolean;
  readonly className?: string;
}

/** "▲ 15%" pill next to a KPI value. */
export function DeltaBadge({ ratio, lowerIsBetter = false, className }: DeltaBadgeProps): React.ReactElement {
  const direction = ratio === null || Math.abs(ratio) < 0.005 ? 'flat' : ratio > 0 ? 'up' : 'down';
  const isGood = direction === 'flat' ? null : (direction === 'up') !== lowerIsBetter;
  const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus;
  const text = ratio === null ? '–' : `${Math.abs(Math.round(ratio * 100))}%`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
        isGood === null && 'bg-muted text-muted-foreground',
        isGood === true && 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
        isGood === false && 'bg-rose-500/12 text-rose-700 dark:text-rose-400',
        className,
      )}
    >
      <Icon className="size-3" />
      {text}
    </span>
  );
}
