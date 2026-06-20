'use client';

import { Plus } from 'lucide-react';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Button, cn, useIsMobile } from '@carefully-built/ui';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;
type ButtonVariant = Exclude<ButtonProps['variant'], null | undefined>;
type ButtonSize = Exclude<ButtonProps['size'], null | undefined>;

export interface ResponsiveButtonProps extends Omit<ButtonProps, 'children'> {
  readonly desktopLabel: ReactNode;
  readonly mobileLabel?: ReactNode;
  readonly mobileVariant?: ButtonProps['variant'];
  readonly mobileSize?: ButtonProps['size'];
  readonly icon?: ReactNode;
  readonly hideIconOnMobile?: boolean;
}

interface ResolveResponsiveButtonStateArgs {
  readonly isMobile: boolean;
  readonly desktopLabel: ReactNode;
  readonly mobileLabel?: ReactNode;
  readonly variant?: ButtonVariant;
  readonly mobileVariant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly mobileSize?: ButtonSize;
}

export interface ResponsiveButtonState {
  readonly visibleLabel: ReactNode;
  readonly isIconOnlyMobile: boolean;
  readonly resolvedVariant: ButtonVariant;
  readonly resolvedSize: ButtonSize;
}

function isGenericAddAction(label: ReactNode): label is string {
  return typeof label === 'string' && label.trim().toLocaleLowerCase().startsWith('add');
}

export function resolveResponsiveButtonState({
  isMobile,
  desktopLabel,
  mobileLabel,
  variant = 'default',
  mobileVariant,
  size = 'default',
  mobileSize,
}: ResolveResponsiveButtonStateArgs): ResponsiveButtonState {
  const isAddAction = isGenericAddAction(desktopLabel);
  const resolvedMobileLabel =
    isMobile && mobileLabel === undefined && isAddAction ? 'Add' : mobileLabel;
  const visibleLabel = isMobile ? resolvedMobileLabel : desktopLabel;
  const isIconOnlyMobile = isMobile && (visibleLabel === null || visibleLabel === undefined);

  return {
    visibleLabel,
    isIconOnlyMobile,
    resolvedVariant: isIconOnlyMobile
      ? mobileVariant ?? 'outline'
      : isMobile && isAddAction
        ? 'default'
        : variant,
    resolvedSize: isIconOnlyMobile ? mobileSize ?? 'icon-sm' : size,
  };
}

export function ResponsiveButton({
  desktopLabel,
  mobileLabel,
  mobileVariant,
  mobileSize,
  icon,
  hideIconOnMobile = false,
  variant = 'default',
  size = 'default',
  ...buttonProps
}: ResponsiveButtonProps): React.ReactElement {
  const isMobile = useIsMobile();
  const showIcon = !isMobile || !hideIconOnMobile;
  const defaultIcon = <Plus className="size-4" />;
  const { visibleLabel, isIconOnlyMobile, resolvedVariant, resolvedSize } =
    resolveResponsiveButtonState({
      isMobile,
      desktopLabel,
      mobileLabel,
      variant: variant ?? 'default',
      mobileVariant: mobileVariant ?? undefined,
      size: size ?? 'default',
      mobileSize: mobileSize ?? undefined,
    });
  const fallbackLabel =
    typeof desktopLabel === 'string' || typeof desktopLabel === 'number'
      ? String(desktopLabel)
      : undefined;
  const ariaLabel = buttonProps['aria-label'] ?? (isIconOnlyMobile ? fallbackLabel : undefined);

  return (
    <Button variant={resolvedVariant} size={resolvedSize} aria-label={ariaLabel} {...buttonProps}>
      {showIcon ? (
        <span className={cn('shrink-0', !isIconOnlyMobile && 'mr-2')}>
          {icon ?? defaultIcon}
        </span>
      ) : null}
      {visibleLabel}
    </Button>
  );
}
