import { useEffect } from 'react';

import type { AssociationPickerOption } from './types';

export function useAssociationPickerValueCleanup(
  visibleOptions: readonly AssociationPickerOption[],
  value: readonly string[],
  onChange: (value: string[]) => void,
): void {
  useEffect(() => {
    const allowedValues = new Set(visibleOptions.map((option) => option.value));
    const nextValue = value.filter((currentValue) => allowedValues.has(currentValue));
    if (nextValue.length !== value.length) {
      onChange(nextValue);
    }
  }, [onChange, value, visibleOptions]);
}
