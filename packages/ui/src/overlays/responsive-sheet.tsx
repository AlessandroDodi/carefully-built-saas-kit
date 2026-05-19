'use client';

import type { ReactNode } from 'react';

import { SheetActionFooter } from './responsive-sheet.footer';
import { DesktopSheetLayout, MobileSheetLayout } from './responsive-sheet.layouts';
import {
  useDesktopConfirmShortcut,
  useDesktopShortcutModifierLabel,
} from './responsive-sheet.shortcuts';
import { useIsMobile } from '../utils/use-media-query';

export interface SheetOutsideInteractionGuard {
  readonly selectors: readonly string[];
}

interface ResponsiveSheetProps {
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
}

export function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  onCancel,
  cancelLabel = 'Annulla',
  onConfirm,
  confirmLabel = 'Salva',
  confirmDisabled = false,
  confirmLoading = false,
  width = 550,
  modal = true,
  outsideInteractionGuard,
  enableDesktopConfirmShortcut = true,
  mobileDrawerContentClassName,
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
    mobileDrawerContentClassName,
  };

  return isMobile ? (
    <MobileSheetLayout {...sharedLayoutProps} />
  ) : (
    <DesktopSheetLayout {...sharedLayoutProps} width={width} />
  );
}
