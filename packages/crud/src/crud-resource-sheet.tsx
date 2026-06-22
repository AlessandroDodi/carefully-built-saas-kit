"use client";

import type { ReactNode } from "react";

import { ResponsiveSheet } from "@carefully-built/ui";
import type { ResponsiveSheetClassNames, SheetOutsideInteractionGuard } from "@carefully-built/ui";

export interface CrudResourceSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: ReactNode;
  readonly children: ReactNode;
  readonly formId?: string;
  readonly description?: ReactNode;
  readonly onCancel?: () => void;
  readonly cancelLabel?: ReactNode;
  readonly onConfirm?: () => void;
  readonly confirmLabel?: ReactNode;
  readonly confirmDisabled?: boolean;
  readonly confirmLoading?: boolean;
  readonly confirmCloseWhenDirty?: boolean;
  readonly width?: number;
  readonly outsideInteractionGuard?: SheetOutsideInteractionGuard;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly footerClassName?: string;
  readonly classes?: ResponsiveSheetClassNames;
}

export function CrudResourceSheet({
  children,
  formId,
  onConfirm,
  confirmCloseWhenDirty: _confirmCloseWhenDirty,
  outsideInteractionGuard,
  ...sheetProps
}: CrudResourceSheetProps): React.ReactElement {
  const submitForm = (): void => {
    const form = formId ? document.getElementById(formId) : null;

    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
      return;
    }

    onConfirm?.();
  };

  return (
    <ResponsiveSheet
      {...sheetProps}
      outsideInteractionGuard={outsideInteractionGuard}
      onConfirm={formId || onConfirm ? submitForm : undefined}
    >
      {children}
    </ResponsiveSheet>
  );
}
