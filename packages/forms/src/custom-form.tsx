'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import type { ReactNode } from 'react';
import type { DefaultValues, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { buildCustomFormOptions } from './custom-form-options';

interface CustomFormProps<T extends FieldValues> {
  readonly schema: unknown;
  readonly defaultValues: DefaultValues<T>;
  readonly onSubmit: SubmitHandler<T>;
  readonly children: ReactNode | ((methods: UseFormReturn<T>) => ReactNode);
  readonly id?: string;
  readonly className?: string;
}

export function CustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  id,
  className,
}: CustomFormProps<T>): React.ReactElement {
  const methods = useForm<T>({
    // Zod 4 and hookform resolver currently expose slightly different generic shapes.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(schema as any) as any,
    ...buildCustomFormOptions(defaultValues),
  });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={className}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void methods.handleSubmit(onSubmit)(event);
        }}
      >
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
}
