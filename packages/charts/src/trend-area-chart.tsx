'use client';

import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ReactNode } from 'react';

export interface TrendPoint {
  readonly label: string;
  readonly value: number;
  /** Same metric in the comparison period, drawn as a dashed line. */
  readonly previous?: number;
}

export interface TrendAreaChartProps {
  readonly data: readonly TrendPoint[];
  readonly color?: string;
  readonly height?: number;
  readonly valueFormatter?: (value: number) => string;
  readonly seriesLabel?: string;
  readonly previousLabel?: string;
}

interface TooltipPayload {
  readonly dataKey?: string | number;
  readonly value?: number;
}

interface TooltipProps {
  readonly active?: boolean;
  readonly label?: string;
  readonly payload?: readonly TooltipPayload[];
}

/**
 * A smooth area with a hatched gradient fill and a comparison line, animated on
 * mount. Colours come from the theme tokens, the accent from `color`.
 */
export function TrendAreaChart({
  data,
  color = '#2563eb',
  height = 240,
  valueFormatter = (value) => String(value),
  seriesLabel,
  previousLabel,
}: TrendAreaChartProps): React.ReactElement {
  const id = useId();
  const gradientId = `trend-gradient-${id}`;
  const hatchId = `trend-hatch-${id}`;

  const renderTooltip = ({ active, label, payload }: TooltipProps): ReactNode => {
    if (!active || !payload?.length) return null;
    const current = payload.find((entry) => entry.dataKey === 'value')?.value;
    const previous = payload.find((entry) => entry.dataKey === 'previous')?.value;
    return (
      <div className="bg-popover text-popover-foreground rounded-xl border px-3 py-2 text-xs shadow-md">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold tabular-nums">
          {seriesLabel ? `${seriesLabel}: ` : ''}
          {valueFormatter(current ?? 0)}
        </p>
        {previous !== undefined ? (
          <p className="text-muted-foreground tabular-nums">
            {previousLabel ? `${previousLabel}: ` : ''}
            {valueFormatter(previous)}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={[...data]} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
          <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={`url(#${gradientId})`} />
            <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeOpacity={0.18} strokeWidth="1.5" />
          </pattern>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis hide />
        <Tooltip content={renderTooltip} cursor={{ stroke: 'var(--border)' }} />
        <Area
          type="monotone"
          dataKey="previous"
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeOpacity={0.5}
          fill="none"
          animationDuration={900}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${hatchId})`}
          animationDuration={1200}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--card)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
