'use client';

import { ResponsiveButton } from '@carefully-built/app-shell';
import { EntityInfoWidget } from '@carefully-built/widgets';
import { Plus } from 'lucide-react';

import type { EntityInfoWidgetProps } from '@carefully-built/widgets';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EntityAssociatedTabPanelProps {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly children: ReactNode;
  readonly addLabel?: string;
  readonly addIcon?: ReactNode;
  readonly onAdd?: () => void;
  readonly addDisabled?: boolean;
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly nameActions?: ReactNode;
  readonly buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
}

export function EntityAssociatedTabPanel({
  icon,
  name,
  children,
  addLabel,
  addIcon,
  onAdd,
  addDisabled,
  actions,
  className,
  contentClassName,
  nameActions,
  buttonVariant = 'outline',
}: EntityAssociatedTabPanelProps): React.ReactElement {
  const headerActions =
    actions ??
    (addLabel && onAdd ? (
      <ResponsiveButton
        type="button"
        desktopLabel={addLabel}
        variant={buttonVariant}
        size="sm"
        icon={addIcon ?? <Plus className="size-4" />}
        onClick={onAdd}
        disabled={addDisabled}
      />
    ) : undefined);

  return (
    <EntityInfoWidget
      icon={icon}
      name={name}
      className={className}
      contentClassName={contentClassName}
      nameActions={nameActions}
      headerActions={headerActions}
    >
      {children}
    </EntityInfoWidget>
  );
}

export type EntityAssociatedTabPanelBaseProps = Pick<
  EntityInfoWidgetProps,
  'className' | 'contentClassName' | 'nameActions'
>;
