import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@carefully-built/ui";

export interface SettingsSectionCardProps {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly contentClassName?: string;
}

export function SettingsSectionCard({
  title,
  subtitle,
  action,
  children,
  contentClassName,
}: SettingsSectionCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        {/* The title keeps at least 9rem: a wide action wraps under it on a phone instead of squeezing the subtitle to a word per line. */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="min-w-0 flex-[1_1_9rem] space-y-1">
            <CardTitle>{title}</CardTitle>
            {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
          </div>
          {action ? (
            <div className="shrink-0 [&_[data-slot=button]]:h-7 [&_[data-slot=button]]:gap-1 [&_[data-slot=button]]:px-2.5 [&_[data-slot=button]]:text-[0.8rem] [&_[data-slot=button]_svg]:size-3.5">
              {action}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
