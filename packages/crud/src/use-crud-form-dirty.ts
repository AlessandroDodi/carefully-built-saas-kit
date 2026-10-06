"use client";

import { useEffect, useState } from "react";

export function useCrudFormDirty({
  formId,
  open,
  enabled,
}: {
  readonly formId: string;
  readonly open: boolean;
  readonly enabled: boolean;
}): boolean {
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    setIsFormDirty(false);

    if (!open || !enabled) {
      return undefined;
    }

    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) {
      return undefined;
    }

    const markDirty = (): void => {
      setIsFormDirty(true);
    };

    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);

    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
    };
  }, [enabled, formId, open]);

  return isFormDirty;
}
