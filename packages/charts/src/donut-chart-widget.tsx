'use client';

import { BriefcaseBusiness } from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip as RechartsTooltip } from 'recharts';

import type { LucideIcon } from 'lucide-react';

import { DashboardWidget } from '@carefully-built/widgets';

const DEFAULT_DONUT_COLORS = ['#2793E8', '#1BB5A0', '#F5A200', '#F2405E', '#6D41FF', '#8BD65A'] as const;

function getChartColor(colors: readonly string[], index: number): string {
  return colors[index % colors.length] ?? DEFAULT_DONUT_COLORS[0];
}

export interface DonutChartWidgetProps {
  readonly title: string;
  readonly data: ReadonlyArray<{ label: string; value: number }>;
  readonly colors?: readonly string[];
  readonly icon?: LucideIcon;
  /** Caption under the total in the middle of the ring, e.g. "Chiamate". */
  readonly centerLabel?: string;
  readonly valueFormatter?: (value: number) => string;
  readonly emptyStateTitle?: string;
  readonly emptyStateDescription?: string;
  readonly isLoading?: boolean;
  readonly legendPreviousAriaLabel?: string;
  readonly legendNextAriaLabel?: string;
}

interface SectorShapeProps {
  readonly cx?: number;
  readonly cy?: number;
  readonly innerRadius?: number;
  readonly outerRadius?: number;
  readonly startAngle?: number;
  readonly endAngle?: number;
  readonly fill?: string;
}

/** The hovered segment grows outwards a little; everything else keeps its shape. */
function ActiveSector(props: unknown): React.ReactElement {
  const { outerRadius = 0, ...rest } = props as SectorShapeProps;
  return <Sector {...rest} outerRadius={outerRadius + 6} cornerRadius={14} />;
}

/**
 * Thick ring with rounded, spaced segments, the total in the middle and a
 * legend with the share of each slice. Hovering a slice lifts it.
 */
export function DonutChartWidget({
  title,
  data,
  colors = DEFAULT_DONUT_COLORS,
  icon = BriefcaseBusiness,
  centerLabel,
  valueFormatter = (value) => value.toLocaleString(),
  emptyStateTitle = 'No data available',
  emptyStateDescription,
  isLoading = false,
}: DonutChartWidgetProps): React.ReactElement {
  const chartData = data.filter((entry) => entry.value > 0);
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
  const isEmpty = chartData.length === 0;
  const [activeIndex, setActiveIndex] = useState<number>();
  const active = activeIndex === undefined ? undefined : chartData[activeIndex];

  return (
    <DashboardWidget
      icon={icon}
      title={title}
      className="min-h-[320px]"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyState={{
        title: emptyStateTitle,
        description: emptyStateDescription ?? 'When data is available, the distribution will appear here.',
        minHeightClassName: 'min-h-[264px]',
      }}
    >
      {!isEmpty ? (
        <div className="flex w-full flex-col items-center gap-5 pt-1">
          <div className="relative h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip content={() => null} cursor={false} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius="64%"
                  outerRadius="92%"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={chartData.length > 1 ? 4 : 0}
                  cornerRadius={14}
                  strokeWidth={0}
                  animationDuration={900}
                  animationEasing="ease-out"
                  activeIndex={activeIndex}
                  activeShape={ActiveSector}
                  onMouseEnter={(_entry, index) => { setActiveIndex(index); }}
                  onMouseLeave={() => { setActiveIndex(undefined); }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.label} fill={getChartColor(colors, index)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-foreground text-3xl font-semibold tracking-tight tabular-nums">
                {valueFormatter(active ? active.value : total)}
              </p>
              <p className="text-muted-foreground max-w-[45%] truncate text-xs">
                {active ? active.label : centerLabel}
              </p>
            </div>
          </div>
          <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {chartData.map((entry, index) => (
              <li
                key={entry.label}
                className="flex min-w-0 items-center gap-2"
                onMouseEnter={() => { setActiveIndex(index); }}
                onMouseLeave={() => { setActiveIndex(undefined); }}
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: getChartColor(colors, index) }} />
                <span className="text-foreground min-w-0 flex-1 truncate">{entry.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {Math.round((entry.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DashboardWidget>
  );
}
