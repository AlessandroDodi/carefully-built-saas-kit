"use client";

import { CircleDashed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

import { DashboardWidget } from "@carefully-built/widgets";

const DEFAULT_BAR_COLORS = ["#6D41FF", "#A92AE8", "#27A8E8", "#5EEAD4", "#84CC16", "#F59E0B"] as const;

function getBarColor(colors: readonly string[], index: number): string {
  return colors[index % colors.length] ?? DEFAULT_BAR_COLORS[0];
}

export interface BarDistributionWidgetProps {
  readonly title: string;
  readonly data: ReadonlyArray<{ label: string; value: number }>;
  readonly colors?: readonly string[];
  readonly icon?: LucideIcon;
  readonly emptyStateTitle?: string;
  readonly emptyStateDescription?: string;
  readonly isLoading?: boolean;
}

export function BarDistributionWidget({
  title,
  data,
  colors = DEFAULT_BAR_COLORS,
  icon = CircleDashed,
  emptyStateTitle = "No data available",
  emptyStateDescription = "When data is available, the distribution will appear here.",
  isLoading = false,
}: BarDistributionWidgetProps): React.ReactElement {
  const isEmpty = data.length === 0;

  return (
    <DashboardWidget
      icon={icon}
      title={title}
      className="min-h-[320px]"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyState={{
        title: emptyStateTitle,
        description: emptyStateDescription,
        minHeightClassName: "min-h-[264px]",
      }}
    >
      {!isEmpty ? (
        <div className="h-[264px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...data]} margin={{ top: 8, right: 8, left: -24, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <RechartsTooltip
                cursor={{ fill: "rgba(109,65,255,0.08)" }}
                contentStyle={{ borderRadius: 12, borderColor: "var(--border)", boxShadow: "none" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={getBarColor(colors, index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </DashboardWidget>
  );
}
