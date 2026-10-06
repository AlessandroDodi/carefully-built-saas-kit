"use client";

import { LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DashboardWidget } from "@carefully-built/widgets";

import { ChartLegend } from "./chart-legend";

/** Coverage status for a single slot. */
export type CoverageLevel = "met" | "under" | "none";

const DEFAULT_LEVEL_COLORS: Record<CoverageLevel, string> = {
  met: "#10B981",
  under: "#F59E0B",
  none: "#94A3B8",
};

const DEFAULT_LEVEL_LABELS: Record<CoverageLevel, string> = {
  met: "Covered",
  under: "Understaffed",
  none: "No requirement",
};

/** A single time-slot tile in the {@link CoverageGrid}. */
export interface CoverageGridSlot {
  /** Slot label, typically a time (e.g. `"09:00"`). */
  readonly label: string;
  /** Number of people/resources assigned to the slot. */
  readonly assigned: number;
  /** Target coverage for the slot. Omit or `0` means "no requirement". */
  readonly required?: number;
  /** Explicit level override. When omitted the level is derived from assigned vs required. */
  readonly level?: CoverageLevel;
}

export interface CoverageGridProps {
  /** Widget heading. */
  readonly title: string;
  /** Slots to render, in display order. */
  readonly slots: readonly CoverageGridSlot[];
  /** Header icon (default `LayoutGrid`). */
  readonly icon?: LucideIcon;
  /** Slot interval in minutes — metadata for the accessible label (default `30`). */
  readonly intervalMinutes?: number;
  /** Fixed number of columns. When omitted the grid auto-fills responsively. */
  readonly columns?: number;
  /** Show the assigned/required count and coverage percentage inside each tile (default `true`). */
  readonly showCounts?: boolean;
  /** Render the status legend below the grid (default `true`). */
  readonly showLegend?: boolean;
  /** Per-level tile colors. */
  readonly levelColors?: Record<CoverageLevel, string>;
  /** Per-level legend labels. */
  readonly levelLabels?: Record<CoverageLevel, string>;
  /** Invoked with the slot index when a tile is clicked. Makes tiles focusable buttons. */
  readonly onSlotClick?: (index: number) => void;
  readonly emptyStateTitle?: string;
  readonly emptyStateDescription?: string;
  readonly isLoading?: boolean;
  readonly legendPreviousAriaLabel?: string;
  readonly legendNextAriaLabel?: string;
  readonly className?: string;
}

function resolveLevel(slot: CoverageGridSlot): CoverageLevel {
  if (slot.level) {
    return slot.level;
  }

  if (slot.required === undefined || slot.required <= 0) {
    return "none";
  }

  return slot.assigned >= slot.required ? "met" : "under";
}

function toRgba(color: string, alpha: number): string {
  const normalized = color.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (expanded.length !== 6) {
    return color;
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    return color;
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function coveragePercent(slot: CoverageGridSlot): number | null {
  if (slot.required === undefined || slot.required <= 0) {
    return null;
  }

  return Math.round((slot.assigned / slot.required) * 100);
}

/**
 * `CoverageGrid` renders a grid of time-slot tiles colored by coverage status —
 * a lightweight heatmap of "assigned vs required" per interval. Levels are
 * derived from `assigned`/`required` (or overridden per slot) and color-coded.
 *
 * Built for scheduling/staffing surfaces (e.g. a shift planner coverage band)
 * but generic enough for any per-slot intensity grid.
 */
export function CoverageGrid({
  title,
  slots,
  icon = LayoutGrid,
  intervalMinutes = 30,
  columns,
  showCounts = true,
  showLegend = true,
  levelColors = DEFAULT_LEVEL_COLORS,
  levelLabels = DEFAULT_LEVEL_LABELS,
  onSlotClick,
  emptyStateTitle = "No coverage data",
  emptyStateDescription = "When slots are scheduled, their coverage will appear here.",
  isLoading = false,
  legendPreviousAriaLabel,
  legendNextAriaLabel,
  className,
}: CoverageGridProps): React.ReactElement {
  const isEmpty = slots.length === 0;
  const interactive = Boolean(onSlotClick);

  const usedLevels = Array.from(new Set(slots.map((slot) => resolveLevel(slot))));
  const legendEntries = (["met", "under", "none"] as const)
    .filter((level) => usedLevels.includes(level))
    .map((level) => ({
      label: levelLabels[level],
      color: levelColors[level],
    }));

  const gridStyle: React.CSSProperties = columns
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
    : { gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))" };

  return (
    <DashboardWidget
      icon={icon}
      title={title}
      className={className}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyState={{
        title: emptyStateTitle,
        description: emptyStateDescription,
        minHeightClassName: "min-h-[160px]",
      }}
    >
      {!isEmpty ? (
        <div className="pt-2">
          <div
            className="grid gap-1.5"
            style={gridStyle}
            role="group"
            aria-label={`${title} (${intervalMinutes}-minute slots)`}
          >
            {slots.map((slot, index) => {
              const level = resolveLevel(slot);
              const color = levelColors[level];
              const percent = coveragePercent(slot);
              const tileLabel =
                percent === null
                  ? `${slot.label}: no requirement`
                  : `${slot.label}: ${slot.assigned} of ${slot.required} (${percent}%)`;

              const tileStyle: React.CSSProperties = {
                backgroundColor: toRgba(color, 0.14),
                borderColor: toRgba(color, 0.5),
              };

              const content = (
                <>
                  <span className="text-[11px] font-medium text-foreground tabular-nums">
                    {slot.label}
                  </span>
                  {showCounts ? (
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {percent === null ? "—" : `${slot.assigned}/${slot.required}`}
                    </span>
                  ) : null}
                  {showCounts && percent !== null ? (
                    <span className="text-[10px] font-semibold tabular-nums" style={{ color }}>
                      {percent}%
                    </span>
                  ) : null}
                </>
              );

              if (interactive) {
                return (
                  <button
                    key={`${slot.label}-${index}`}
                    type="button"
                    onClick={() => onSlotClick?.(index)}
                    title={tileLabel}
                    aria-label={tileLabel}
                    className="flex min-h-[44px] cursor-pointer flex-col items-start justify-center gap-0.5 rounded-md border px-2 py-1.5 text-left transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none"
                    style={tileStyle}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div
                  key={`${slot.label}-${index}`}
                  title={tileLabel}
                  aria-label={tileLabel}
                  className="flex min-h-[44px] flex-col items-start justify-center gap-0.5 rounded-md border px-2 py-1.5"
                  style={tileStyle}
                >
                  {content}
                </div>
              );
            })}
          </div>
          {showLegend ? (
            <ChartLegend
              entries={legendEntries}
              previousAriaLabel={legendPreviousAriaLabel ?? `Scroll ${title} legend backward`}
              nextAriaLabel={legendNextAriaLabel ?? `Scroll ${title} legend forward`}
            />
          ) : null}
        </div>
      ) : null}
    </DashboardWidget>
  );
}
