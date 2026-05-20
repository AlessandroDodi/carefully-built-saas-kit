"use client";

interface KanbanStageBadgeProps {
  readonly label: string;
  readonly color: string;
  readonly className?: string;
}

export function KanbanStageBadge({
  label,
  color,
  className,
}: KanbanStageBadgeProps): React.ReactElement {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      ].filter(Boolean).join(" ")}
      style={{
        backgroundColor: `${color}1A`,
        color,
      }}
    >
      {label}
    </span>
  );
}
