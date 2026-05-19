import type { DefaultValues, FieldValues, UseFormProps } from 'react-hook-form';

export function buildCustomFormOptions<T extends FieldValues>(
  defaultValues: DefaultValues<T>,
): Pick<UseFormProps<T>, 'defaultValues' | 'mode' | 'reValidateMode'> {
  return {
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  };
}
