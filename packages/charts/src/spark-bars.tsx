'use client';

import { Bar, BarChart, Cell, ResponsiveContainer } from 'recharts';

export interface SparkBarsProps {
  readonly values: readonly number[];
  readonly color?: string;
  readonly height?: number;
  /** Index of the bar to emphasise; defaults to the highest value. */
  readonly highlightIndex?: number;
}

/** Tiny bar sparkline for KPI cards: the peak in full colour, the rest faded. */
export function SparkBars({
  values,
  color = '#2563eb',
  height = 40,
  highlightIndex,
}: SparkBarsProps): React.ReactElement {
  const peak = highlightIndex ?? values.indexOf(Math.max(...values));
  const data = values.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap="30%" margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <Bar dataKey="value" radius={[3, 3, 3, 3]} animationDuration={900} isAnimationActive>
          {data.map((entry) => (
            <Cell key={entry.index} fill={color} fillOpacity={entry.index === peak ? 1 : 0.28} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
