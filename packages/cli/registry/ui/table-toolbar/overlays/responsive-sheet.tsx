'use client';

import type { ReactNode } from 'react';

import { SheetActionFooter } from '@/components/ui/responsive-sheet.footer';
import { DesktopSheetLayout, MobileSheetLayout } from '@/components/ui/responsive-sheet.layouts';
import {
  useDesktopConfirmShortcut,
  useDesktopShortcutModifierLabel,
} from '@/components/ui/responsive-sheet.shortcuts';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/components/ui/use-media-query';

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
  cancelLabel = 'Cancel',
  onConfirm,
  confirmLabel = 'Save',
  confirmDisabled = false,
  confirmLoading = false,
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
      cancelLabel={cancelLabel}
      onConfirm={onConfirm}
      confirmLabel={confirmLabel}
      confirmDisabled={confirmDisabled}
      confirmLoading={confirmLoading}
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
