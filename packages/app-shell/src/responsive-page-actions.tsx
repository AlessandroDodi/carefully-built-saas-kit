'use client';

import { MoreHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useIsMobile,
} from '@carefully-built/ui';

export interface ResponsivePageAction {
  readonly label: ReactNode;
  readonly shortLabel?: ReactNode;
  readonly icon?: ReactNode;
  readonly onClick?: () => void;
  readonly href?: string;
  readonly disabled?: boolean;
  readonly destructive?: boolean;
}

export interface ResponsivePageActionsProps {
  readonly primaryAction: ResponsivePageAction;
  readonly secondaryActions?: readonly ResponsivePageAction[];
  readonly moreLabel?: string;
}

function renderActionContent(action: ResponsivePageAction): React.ReactElement {
  return (
    <>
      {action.icon ? <span className="shrink-0">{action.icon}</span> : null}
      <span>{action.label}</span>
    </>
  );
}

function getDefaultShortLabel(label: ReactNode): ReactNode {
  if (typeof label !== 'string') {
    return label;
  }

  const trimmedLabel = label.trim();
  return trimmedLabel.toLocaleLowerCase().startsWith('add ') ? 'Add' : trimmedLabel;
}

function SecondaryActionItem({ action }: { readonly action: ResponsivePageAction }): React.ReactElement {
  const className = action.destructive ? 'text-destructive focus:text-destructive' : undefined;

  if (action.href) {
    return (
      <DropdownMenuItem asChild disabled={action.disabled} className={className}>
        <a href={action.href}>{renderActionContent(action)}</a>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      disabled={action.disabled}
      className={className}
      onClick={() => action.onClick?.()}
    >
      {renderActionContent(action)}
    </DropdownMenuItem>
  );
}

export function ResponsivePageActions({
  primaryAction,
  secondaryActions = [],
  moreLabel = 'More actions',
}: ResponsivePageActionsProps): React.ReactElement {
  const isMobile = useIsMobile();
  const shortLabel = primaryAction.shortLabel ?? getDefaultShortLabel(primaryAction.label);
  const primaryContent = (
    <>
      {primaryAction.icon ? <span className="shrink-0">{primaryAction.icon}</span> : null}
      <span className={cn(isMobile && 'max-[359px]:sr-only')}>
        {isMobile ? shortLabel : primaryAction.label}
      </span>
    </>
  );
  const primaryAriaLabel =
    typeof primaryAction.label === 'string' ? primaryAction.label : 'Primary action';

  return (
    <div className="flex items-center gap-2">
      {primaryAction.href ? (
        <Button
          asChild
          size="sm"
          className={isMobile ? 'max-[359px]:size-7 max-[359px]:px-0' : undefined}
          disabled={primaryAction.disabled}
          aria-label={isMobile && primaryAction.icon ? primaryAriaLabel : undefined}
        >
          <a href={primaryAction.href}>{primaryContent}</a>
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          className={isMobile ? 'max-[359px]:size-7 max-[359px]:px-0' : undefined}
          disabled={primaryAction.disabled}
          aria-label={isMobile && primaryAction.icon ? primaryAriaLabel : undefined}
          onClick={primaryAction.onClick}
        >
          {primaryContent}
        </Button>
      )}

      {secondaryActions.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="icon-sm" aria-label={moreLabel}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {secondaryActions.map((action, index) => (
              <SecondaryActionItem key={index} action={action} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
