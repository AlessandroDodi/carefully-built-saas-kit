'use client';

import type { ReactNode } from 'react';

import { SheetActionFooter } from './responsive-sheet.footer';
import { resolveResponsiveSheetLabels } from './responsive-sheet.labels';
import { DesktopSheetLayout, MobileSheetLayout } from './responsive-sheet.layouts';
import {
  useDesktopConfirmShortcut,
  useDesktopShortcutModifierLabel,
} from './responsive-sheet.shortcuts';
import { cn } from '../utils/cn';
import { useIsMobile } from '../utils/use-media-query';

export interface SheetOutsideInteractionGuard {
  readonly selectors: readonly string[];
}

export interface ResponsiveSheetClassNames {
  readonly desktopContent?: string;
  readonly mobileContent?: string;
  readonly header?: string;
  readonly body?: string;
  readonly footer?: string;
  readonly title?: string;
  readonly description?: string;
}

export interface ResponsiveSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly onCancel?: () => void;
  readonly cancelLabel?: ReactNode;
  readonly onConfirm?: () => void;
  readonly confirmLabel?: ReactNode;
  readonly confirmDisabled?: boolean;
  readonly confirmLoading?: boolean;
  readonly confirmLoadingLabel?: ReactNode;
  readonly closeLabel?: ReactNode;
  readonly width?: number;
  readonly modal?: boolean;
  readonly outsideInteractionGuard?: SheetOutsideInteractionGuard;
  readonly enableDesktopConfirmShortcut?: boolean;
  readonly mobileDrawerContentClassName?: string;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly footerClassName?: string;
  readonly classes?: ResponsiveSheetClassNames;
}

export function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  onCancel,
  cancelLabel,
  onConfirm,
  confirmLabel,
  confirmDisabled = false,
  confirmLoading = false,
  confirmLoadingLabel,
  closeLabel,
  width = 550,
  modal = true,
  outsideInteractionGuard,
  enableDesktopConfirmShortcut = true,
  mobileDrawerContentClassName,
  className,
  contentClassName,
  footerClassName,
  classes,
}: ResponsiveSheetProps): React.ReactElement {
  const labels = resolveResponsiveSheetLabels({
    cancelLabel,
    confirmLabel,
    confirmLoadingLabel,
    closeLabel,
  });
  const isMobile = useIsMobile();
  const desktopConfirmShortcutEnabled =
    !isMobile && enableDesktopConfirmShortcut && Boolean(onConfirm);
  const desktopModifierLabel = useDesktopShortcutModifierLabel(desktopConfirmShortcutEnabled);

  useDesktopConfirmShortcut({
    open,
    enabled: desktopConfirmShortcutEnabled,
    confirmDisabled,
    confirmLoading,
    onConfirm: onConfirm
      ? () => {
          onConfirm();
        }
      : undefined,
  });

  const resolvedFooter = (
    <SheetActionFooter
      footer={footer}
      onCancel={onCancel}
      cancelLabel={labels.cancelLabel}
      onConfirm={onConfirm}
      confirmLabel={labels.confirmLabel}
      confirmDisabled={confirmDisabled}
      confirmLoading={confirmLoading}
      confirmLoadingLabel={labels.confirmLoadingLabel}
      desktopConfirmShortcutEnabled={desktopConfirmShortcutEnabled}
      desktopModifierLabel={desktopModifierLabel}
    />
  );
  const hasFooter = [footer, onCancel, onConfirm].some(
    (value) => value !== null && value !== undefined,
  );
  const sharedLayoutProps = {
    open,
    onOpenChange,
    modal,
    outsideInteractionGuard,
    title,
    description,
    footer: hasFooter ? resolvedFooter : null,
    closeLabel: labels.closeLabel,
    children,
    contentClassName,
    footerClassName,
    mobileDrawerContentClassName,
    classes: {
      ...classes,
      desktopContent: cn(className, classes?.desktopContent),
      mobileContent: cn(className, mobileDrawerContentClassName, classes?.mobileContent),
    },
  };

  return isMobile ? (
    <MobileSheetLayout {...sharedLayoutProps} />
  ) : (
    <DesktopSheetLayout {...sharedLayoutProps} width={width} />
  );
}
