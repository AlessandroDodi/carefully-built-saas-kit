'use client';

import { SearchableSelect, defineKitTexts, useKitTexts } from '@carefully-built/ui';
import { CalendarRange } from 'lucide-react';

export const PERIOD_PRESETS = ['today', '7d', '30d', '90d', 'month', 'year'] as const;

export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

export interface PeriodRange {
  /** Inclusive start, epoch ms. */
  readonly from: number;
  /** Exclusive end, epoch ms. */
  readonly to: number;
}

const periodTexts = defineKitTexts<Record<PeriodPreset, string> & { readonly ariaLabel: string }>({
  en: {
    today: 'Today',
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    month: 'This month',
    year: 'This year',
    ariaLabel: 'Period',
  },
  it: {
    today: 'Oggi',
    '7d': 'Ultimi 7 giorni',
    '30d': 'Ultimi 30 giorni',
    '90d': 'Ultimi 90 giorni',
    month: 'Questo mese',
    year: 'Quest’anno',
    ariaLabel: 'Periodo',
  },
});

export function isPeriodPreset(value: string): value is PeriodPreset {
  return (PERIOD_PRESETS as readonly string[]).includes(value);
}

/** The time range a preset covers, in the browser's time zone, ending tomorrow at 00:00. */
export function resolvePeriodRange(preset: PeriodPreset, now = new Date()): PeriodRange {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const to = start.getTime() + 24 * 60 * 60 * 1000;
  const daysBack = { today: 0, '7d': 6, '30d': 29, '90d': 89 } as const;

  if (preset === 'month') return { from: new Date(now.getFullYear(), now.getMonth(), 1).getTime(), to };
  if (preset === 'year') return { from: new Date(now.getFullYear(), 0, 1).getTime(), to };
  return { from: start.getTime() - daysBack[preset] * 24 * 60 * 60 * 1000, to };
}

interface PeriodSelectProps {
  readonly value: PeriodPreset;
  readonly onChange: (value: PeriodPreset) => void;
  readonly presets?: readonly PeriodPreset[];
  readonly className?: string;
}

/** Dashboard period filter: the same presets, labels and ranges in every app. */
export function PeriodSelect({
  value,
  onChange,
  presets = PERIOD_PRESETS,
  className,
}: PeriodSelectProps): React.ReactElement {
  const texts = useKitTexts(periodTexts);

  return (
    <SearchableSelect
      value={value}
      onValueChange={(next) => {
        if (isPeriodPreset(next)) onChange(next);
      }}
      options={presets.map((preset) => ({ value: preset, label: texts[preset] }))}
      ariaLabel={texts.ariaLabel}
      leadingIcon={CalendarRange}
      searchThreshold={99}
      size="sm"
      className={className ?? 'min-w-40'}
    />
  );
}
