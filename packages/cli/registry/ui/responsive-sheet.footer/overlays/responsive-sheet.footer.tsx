'use client';

import { CornerDownLeft } from 'lucide-react';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { KeyboardKeycap, ShortcutModifierKeycap } from '@/components/ui/keyboard-shortcut-hint';

export function DesktopConfirmShortcutHint({
  desktopModifierLabel,
}: {
  readonly desktopModifierLabel: string;
}): React.ReactElement {
  const keycapClassName = 'border-primary-foreground/20 bg-primary-foreground/10';

  return (
    <span className="text-primary-foreground/70 inline-flex items-center gap-1">
      <ShortcutModifierKeycap modifierLabel={desktopModifierLabel} className={keycapClassName} />
      <KeyboardKeycap className={keycapClassName}>
        <CornerDownLeft className="size-[10px]" />
      </KeyboardKeycap>
    </span>
  );
}

interface SheetActionFooterProps {
  readonly footer?: ReactNode;
  readonly onCancel?: () => void;
  readonly cancelLabel: ReactNode;
  readonly onConfirm?: () => void;
  readonly confirmLabel: ReactNode;
  readonly confirmDisabled: boolean;
  readonly confirmLoading: boolean;
  readonly desktopConfirmShortcutEnabled?: boolean;
  readonly desktopModifierLabel?: string | null;
}

export function SheetActionFooter({
  footer,
  onCancel,
  cancelLabel,
  onConfirm,
  confirmLabel,
  confirmDisabled,
  confirmLoading,
  desktopConfirmShortcutEnabled = false,
  desktopModifierLabel = null,
}: SheetActionFooterProps): React.ReactNode {
  if (footer) return footer;

  if (!onCancel && !onConfirm) return null;

  const actionCount = Number(Boolean(onCancel)) + Number(Boolean(onConfirm));
  const footerButtonClassName = actionCount === 1 ? 'w-full' : 'min-w-0 flex-1';

  return (
    <div className="flex w-full flex-nowrap items-center gap-2">
      {onCancel ? (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={footerButtonClassName}
        >
          {cancelLabel}
        </Button>
      ) : null}
      {onConfirm ? (
        <Button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled}
          className={`${footerButtonClassName} relative`}
        >
          <span className="inline-flex w-full items-center justify-center">
            <span>{confirmLoading ? 'Saving...' : confirmLabel}</span>
            {desktopConfirmShortcutEnabled && desktopModifierLabel ? (
              <span className="absolute top-1/2 right-2 -translate-y-1/2">
                <DesktopConfirmShortcutHint desktopModifierLabel={desktopModifierLabel} />
              </span>
            ) : null}
          </span>
        </Button>
      ) : null}
    </div>
  );
}
