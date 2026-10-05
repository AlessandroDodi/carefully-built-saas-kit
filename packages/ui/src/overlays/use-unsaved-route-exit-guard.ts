'use client';

import { useState } from 'react';

export interface UseUnsavedRouteExitGuardOptions {
  readonly hasUnsavedChanges: boolean;
  readonly onNavigate: (href: string) => void;
  readonly onDiscard?: () => void;
}

export interface UnsavedRouteExitGuard {
  readonly dialogOpen: boolean;
  readonly requestExit: (href: string) => void;
  readonly confirmExit: () => void;
  readonly setDialogOpen: (open: boolean) => void;
}

export function useUnsavedRouteExitGuard({
  hasUnsavedChanges,
  onNavigate,
  onDiscard,
}: UseUnsavedRouteExitGuardOptions): UnsavedRouteExitGuard {
  const [pendingExitHref, setPendingExitHref] = useState<string | null>(null);

  const requestExit = (href: string): void => {
    if (hasUnsavedChanges) {
      setPendingExitHref(href);
      return;
    }

    onNavigate(href);
  };

  const confirmExit = (): void => {
    if (!pendingExitHref) {
      return;
    }

    onDiscard?.();
    onNavigate(pendingExitHref);
  };

  const setDialogOpen = (open: boolean): void => {
    if (!open) {
      setPendingExitHref(null);
    }
  };

  return {
    dialogOpen: Boolean(pendingExitHref),
    requestExit,
    confirmExit,
    setDialogOpen,
  };
}
