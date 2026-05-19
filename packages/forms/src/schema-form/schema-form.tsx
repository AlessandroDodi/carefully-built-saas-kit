'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

import { CustomInputField } from '../fields/custom-input-field';
import { CustomPasswordField } from '../fields/custom-password-field';
import { CustomSelectField } from '../fields/custom-select-field';
import { CustomTextareaField } from '../fields/custom-textarea-field';

interface SchemaFormOption {
  readonly value: string;
  readonly label: string;
}

interface BaseSchemaField<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

export type SchemaFormField<TValues extends FieldValues> =
  | (BaseSchemaField<TValues> & {
      readonly type?: 'text' | 'email' | 'number' | 'url' | 'tel';
      readonly min?: number;
      readonly max?: number;
      readonly step?: number | 'any';
    })
  | (BaseSchemaField<TValues> & {
      readonly type: 'textarea';
      readonly rows?: number;
    })
  | (BaseSchemaField<TValues> & {
      readonly type: 'select';
      readonly options: readonly SchemaFormOption[];
    })
  | (BaseSchemaField<TValues> & {
      readonly type: 'password';
      readonly autoComplete?: string;
    })
  | (BaseSchemaField<TValues> & {
      readonly type: 'custom';
      readonly render: () => ReactNode;
    });

interface SchemaFormProps<TValues extends FieldValues> {
  readonly fields: readonly SchemaFormField<TValues>[];
  readonly className?: string;
}

function renderSchemaField<TValues extends FieldValues>(
  field: SchemaFormField<TValues>,
): ReactNode {
  if (field.type === 'custom') {
    return field.render();
  }

  if (field.type === 'textarea') {
    return (
      <CustomTextareaField<TValues>
        key={field.name}
        name={field.name}
        label={field.label}
        labelIcon={field.labelIcon}
        placeholder={field.placeholder}
        disabled={field.disabled}
        rows={field.rows}
        className={field.className}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <CustomSelectField<TValues>
        key={field.name}
        name={field.name}
        label={field.label}
        labelIcon={field.labelIcon}
        placeholder={field.placeholder}
        disabled={field.disabled}
        options={field.options}
        className={field.className}
      />
    );
  }

  if (field.type === 'password') {
    return (
      <CustomPasswordField<TValues>
        key={field.name}
        name={field.name}
        label={field.label}
        placeholder={field.placeholder}
        disabled={field.disabled}
        autoComplete={field.autoComplete}
        className={field.className}
      />
    );
  }

  return (
    <CustomInputField<TValues>
      key={field.name}
      name={field.name}
      label={field.label}
      labelIcon={field.labelIcon}
      placeholder={field.placeholder}
      type={field.type ?? 'text'}
      min={field.min}
      max={field.max}
      step={field.step}
      disabled={field.disabled}
      className={field.className}
    />
  );
}

export function SchemaForm<TValues extends FieldValues>({
  fields,
  className = 'grid gap-4',
}: SchemaFormProps<TValues>): React.ReactElement {
  return <div className={className}>{fields.map((field) => renderSchemaField(field))}</div>;
}
