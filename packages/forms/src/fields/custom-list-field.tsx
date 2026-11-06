'use client';

import { Button, cn, defineKitTexts, useKitTexts } from '@carefully-built/ui';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { ReactNode } from 'react';
import type { ArrayPath, FieldArray, FieldValues, Path } from 'react-hook-form';

const texts = defineKitTexts({
  en: { add: 'Add', remove: 'Remove' },
  it: { add: 'Aggiungi', remove: 'Rimuovi' },
});

interface CustomListFieldProps<TValues extends FieldValues, TName extends ArrayPath<TValues>> {
  readonly name: TName;
  readonly label?: string;
  readonly addLabel?: string;
  readonly emptyLabel?: string;
  /** A fresh row appended by the add button. */
  readonly newItem: () => FieldArray<TValues, TName>;
  /** Renders the fields of one row; `path` prefixes the row's field names, e.g. `${path}.label`. */
  readonly renderItem: (path: `${TName}.${number}`, index: number) => ReactNode;
  readonly max?: number;
  readonly className?: string;
}

/**
 * A repeatable group of fields (rows added and removed by the user) for
 * array values in a CustomForm, e.g. a list of objections with their answers.
 */
export function CustomListField<TValues extends FieldValues, TName extends ArrayPath<TValues>>({
  name,
  label,
  addLabel,
  emptyLabel,
  newItem,
  renderItem,
  max,
  className,
}: CustomListFieldProps<TValues, TName>): React.ReactElement {
  const t = useKitTexts(texts);
  const { control } = useFormContext<TValues>();
  const { fields, append, remove } = useFieldArray<TValues, TName>({ control, name });

  return (
    <div className={cn('space-y-3', className)}>
      {label ? <FormFieldLabel htmlFor={name as Path<TValues>} label={label} /> : null}
      {fields.length === 0 && emptyLabel ? <p className="text-muted-foreground text-sm">{emptyLabel}</p> : null}
      <ol className="space-y-3">
        {fields.map((field, index) => (
          <li key={field.id} className="border-border bg-card animate-in fade-in-0 slide-in-from-top-1 relative rounded-xl border p-3 pr-11">
            {renderItem(`${name}.${String(index)}` as `${TName}.${number}`, index)}
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label={t.remove}
              className="text-muted-foreground hover:text-destructive absolute top-2 right-2"
              onClick={() => { remove(index); }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </li>
        ))}
      </ol>
      <Button type="button" variant="outline" size="sm" disabled={max !== undefined && fields.length >= max} onClick={() => { append(newItem()); }}>
        <Plus className="size-4" />
        {addLabel ?? t.add}
      </Button>
    </div>
  );
}
