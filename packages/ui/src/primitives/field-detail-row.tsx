import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface FieldDetailRowProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: ReactNode;
  readonly labelColumnClassName?: string;
}

export function FieldDetailRow({
  icon: Icon,
  label,
  value,
  labelColumnClassName = "grid-cols-[110px_minmax(0,1fr)]",
}: FieldDetailRowProps): React.ReactElement {
  return (
    <div className={`grid ${labelColumnClassName} items-start gap-2 py-1.5`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        <span className="text-[12px]">{label}</span>
      </div>
      <div className="min-w-0 text-[14px] leading-5 tracking-[-0.28px] text-foreground">
        {value}
      </div>
    </div>
  );
}
