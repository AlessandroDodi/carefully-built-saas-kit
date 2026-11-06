'use client';

import { useId } from 'react';
import { Area, AreaChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ReactNode } from 'react';

export interface TrendPoint {
  readonly label: string;
  readonly value: number;
  /** Same metric in the comparison period, drawn as a dotted line. */
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

interface DotProps {
  readonly cx?: number;
  readonly cy?: number;
  readonly index?: number;
}

/** Ring markers on a few evenly spaced points, so a long series stays clean. */
function dotStep(length: number): number {
  return length <= 14 ? 1 : Math.ceil(length / 7);
}

/**
 * A smooth line over a soft gradient, ring markers, the last value in a pill
 * and the comparison period as a dotted line. The scale hugs the data, so no
 * empty band sits under the curve.
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
  const last = data.at(-1);
  const step = dotStep(data.length);

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

  const renderDot = ({ cx, cy, index }: DotProps): React.ReactElement<SVGElement> => {
    const isLast = index === data.length - 1;
    const show = cx !== undefined && cy !== undefined && (isLast || (index !== undefined && index % step === 0));
    const key = `dot-${String(index)}`;
    if (!show) return <g key={key} />;
    return isLast ? (
      <circle key={key} cx={cx} cy={cy} r={5} fill={color} stroke="var(--card)" strokeWidth={2} />
    ) : (
      <circle key={key} cx={cx} cy={cy} r={4} fill="var(--card)" stroke={color} strokeWidth={2} />
    );
  };

  const renderEndLabel = ({ viewBox }: { viewBox?: { x?: number; y?: number } }): React.ReactElement<SVGElement> => {
    if (!last || viewBox?.x === undefined || viewBox.y === undefined) return <g />;
    const text = valueFormatter(last.value);
    const width = text.length * 7 + 16;
    // Above the last point and ending at it, so it never runs past the right edge.
    return (
      <g transform={`translate(${String(viewBox.x - width + 8)}, ${String(viewBox.y - 34)})`}>
        <rect width={width} height={22} rx={11} fill="var(--card)" stroke={color} strokeWidth={1.5} />
        <text x={width / 2} y={15} textAnchor="middle" fontSize={11} fontWeight={600} fill={color}>
          {text}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={[...data]} margin={{ top: 36, right: 12, bottom: 0, left: 12 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickMargin={10}
          interval="preserveStartEnd"
          minTickGap={28}
        />
        <YAxis hide domain={[(min: number) => Math.max(0, Math.floor(min * 0.85)), (max: number) => Math.ceil(max * 1.08)]} />
        <Tooltip content={renderTooltip} cursor={{ stroke: 'var(--border)' }} />
        <Area
          type="monotone"
          dataKey="previous"
          stroke="var(--muted-foreground)"
          strokeWidth={2}
          strokeDasharray="1 5"
          strokeLinecap="round"
          strokeOpacity={0.55}
          fill="none"
          animationDuration={900}
          dot={false}
          activeDot={false}
        />
        <Area
          type="monotone"
          dataKey="value"
          baseValue="dataMin"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill={`url(#${gradientId})`}
          animationDuration={1200}
          dot={renderDot}
          activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--card)' }}
        />
        {last ? <ReferenceDot x={last.label} y={last.value} r={0} label={renderEndLabel} /> : null}
      </AreaChart>
    </ResponsiveContainer>
  );
}
