"use client";

import { cn } from "@carefully-built/ui";

export interface ProgressMetricCardProps {
  readonly label: string;
  readonly note: string;
  readonly value: number;
  readonly tone: "orange" | "violet";
}

export function ProgressMetricCard({
  label,
  note,
  value,
  tone,
}: ProgressMetricCardProps): React.ReactElement {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div
        className={cn(
          "h-7 rounded-md p-[3px]",
          tone === "violet" ? "bg-primary/12" : "bg-orange-500/12",
        )}
      >
        <div
          className={cn(
            "h-full rounded-md p-[3px]",
            tone === "violet" ? "bg-primary" : "bg-orange-500",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs font-medium text-muted-foreground">{note}</p>
    </div>
  );
}
