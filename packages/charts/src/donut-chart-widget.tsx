"use client";

import { BriefcaseBusiness } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

import { DashboardWidget } from "@carefully-built/widgets";

import { ChartLegend } from "./chart-legend";

const DEFAULT_DONUT_COLORS = ["#6D41FF", "#C026F4", "#2793E8", "#44D7E8", "#8BD65A", "#F5B942"] as const;

function getChartColor(colors: readonly string[], index: number): string {
  return colors[index % colors.length] ?? DEFAULT_DONUT_COLORS[0];
}

export interface DonutChartWidgetProps {
  readonly title: string;
  readonly data: ReadonlyArray<{ label: string; value: number }>;
  readonly colors?: readonly string[];
  readonly icon?: LucideIcon;
  readonly emptyStateTitle?: string;
  readonly emptyStateDescription?: string;
  readonly isLoading?: boolean;
  readonly innerRadius?: string;
  readonly legendPreviousAriaLabel?: string;
  readonly legendNextAriaLabel?: string;
}

export function DonutChartWidget({
  title,
  data,
  colors = DEFAULT_DONUT_COLORS,
  icon = BriefcaseBusiness,
  emptyStateTitle = "No data available",
  emptyStateDescription,
  isLoading = false,
  innerRadius = "62%",
  legendPreviousAriaLabel,
  legendNextAriaLabel,
}: DonutChartWidgetProps): React.ReactElement {
  const chartData = data.filter((entry) => entry.value > 0);
  const isEmpty = chartData.length === 0;

  return (
    <DashboardWidget
      icon={icon}
      title={title}
      className="min-h-[320px]"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyState={{
        title: emptyStateTitle,
        description:
          emptyStateDescription ??
          "When data is available, the distribution will appear here.",
        minHeightClassName: "min-h-[264px]",
      }}
    >
      {!isEmpty ? (
        <div className="w-full pt-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "var(--border)",
                    boxShadow: "none",
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  outerRadius="78%"
                  innerRadius={innerRadius}
                  strokeWidth={0}
                  cx="50%"
                  cy="50%"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.label} fill={getChartColor(colors, index)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            entries={chartData.map((entry, index) => ({
              label: entry.label,
              value: entry.value,
              color: getChartColor(colors, index),
            }))}
            previousAriaLabel={legendPreviousAriaLabel ?? `Scroll ${title} legend backward`}
            nextAriaLabel={legendNextAriaLabel ?? `Scroll ${title} legend forward`}
          />
        </div>
      ) : null}
    </DashboardWidget>
  );
}
