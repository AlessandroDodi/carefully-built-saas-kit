'use client';

import type { ReactNode } from 'react';

import { ResponsiveSheet } from '@carefully-built/ui';

export function EntityImportSheet({
  open,
  onOpenChange,
  title,
  confirmLabel,
  confirmDisabled = false,
  confirmLoading = false,
  onConfirm,
  onCancel,
  children,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly confirmLabel: string;
  readonly confirmDisabled?: boolean;
  readonly confirmLoading?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly children: ReactNode;
}): React.ReactElement {
  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={confirmLabel}
      confirmDisabled={confirmDisabled}
      confirmLoading={confirmLoading}
      width={560}
    >
      {children}
    </ResponsiveSheet>
  );
}
