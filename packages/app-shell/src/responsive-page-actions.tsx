'use client';

import { ChevronDown, MoreHorizontal } from 'lucide-react';
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

/** A named group of actions behind its own outlined button (e.g. "Import" → from file / from the web). */
export interface ResponsivePageActionMenu {
  readonly label: string;
  readonly icon?: ReactNode;
  readonly items: readonly ResponsivePageAction[];
}

export interface ResponsivePageActionsProps {
  readonly primaryAction: ResponsivePageAction;
  /** Shown before the primary action: labelled on desktop, icon only on mobile when it has an icon. */
  readonly secondaryMenu?: ResponsivePageActionMenu;
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

function SecondaryMenu({ menu, isMobile }: { readonly menu: ResponsivePageActionMenu; readonly isMobile: boolean }): React.ReactElement {
  const iconOnly = isMobile && Boolean(menu.icon);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={iconOnly ? 'icon-sm' : 'sm'}
          aria-label={iconOnly ? menu.label : undefined}
        >
          {menu.icon ? <span className="shrink-0">{menu.icon}</span> : null}
          {iconOnly ? null : (
            <>
              <span>{menu.label}</span>
              <ChevronDown className="size-3.5 opacity-60" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        {menu.items.map((action, index) => (
          <SecondaryActionItem key={index} action={action} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ResponsivePageActions({
  primaryAction,
  secondaryMenu,
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
      {secondaryMenu && secondaryMenu.items.length > 0 ? <SecondaryMenu menu={secondaryMenu} isMobile={isMobile} /> : null}

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
