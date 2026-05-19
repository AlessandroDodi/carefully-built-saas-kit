import { useEffect, useState } from 'react';

interface NavigatorWithUserAgentData extends Navigator {
  readonly userAgentData?: {
    readonly platform?: string;
  };
}

function getDesktopShortcutModifierLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'Ctrl';
  }

  const navigatorWithUserAgentData = navigator as NavigatorWithUserAgentData;
  const platform = navigatorWithUserAgentData.userAgentData?.platform ?? navigator.userAgent;

  return /Mac|iPhone|iPad|iPod/i.test(platform) ? 'Cmd' : 'Ctrl';
}

function isAllowedConfirmShortcutEvent(event: KeyboardEvent, desktopModifierLabel: string): boolean {
  if (event.key !== 'Enter' || event.repeat || event.isComposing) {
    return false;
  }

  const expectsMetaKey = desktopModifierLabel === 'Cmd';
  const usedExpectedModifier = expectsMetaKey ? event.metaKey : event.ctrlKey;
  const usedOtherModifier = expectsMetaKey ? event.ctrlKey : event.metaKey;
  const usedShiftModifier = event.shiftKey;
  const usedAltModifier = event.altKey;

  if (!usedExpectedModifier || usedOtherModifier || usedShiftModifier || usedAltModifier) {
    return false;
  }

  return true;
}

export function useDesktopShortcutModifierLabel(enabled: boolean): string | null {
  const [desktopModifierLabel, setDesktopModifierLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDesktopModifierLabel(null);
      return;
    }

    setDesktopModifierLabel(getDesktopShortcutModifierLabel());
  }, [enabled]);

  return desktopModifierLabel;
}

interface UseDesktopConfirmShortcutOptions {
  readonly open: boolean;
  readonly enabled: boolean;
  readonly confirmDisabled: boolean;
  readonly confirmLoading: boolean;
  readonly onConfirm?: () => void;
}

export function useDesktopConfirmShortcut({
  open,
  enabled,
  confirmDisabled,
  confirmLoading,
  onConfirm,
}: UseDesktopConfirmShortcutOptions): void {
  useEffect(() => {
    if (!open || !enabled || !onConfirm || confirmDisabled || confirmLoading) {
      return;
    }

    const desktopModifierLabel = getDesktopShortcutModifierLabel();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!isAllowedConfirmShortcutEvent(event, desktopModifierLabel)) {
        return;
      }

      event.preventDefault();
      onConfirm();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [confirmDisabled, confirmLoading, enabled, onConfirm, open]);
}
