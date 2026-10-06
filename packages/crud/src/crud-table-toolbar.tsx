'use client';

import type { AssociationPickerOption } from '@carefully-built/association-picker';
import type {
  CustomTableToolbarFilter,
  FilterConfig,
  FilterOption,
  TableToolbarProps as BaseTableToolbarProps,
} from '@carefully-built/ui';
import type { LucideIcon } from 'lucide-react';

import { AssociationPicker } from '@carefully-built/association-picker';
import { CustomDateField } from '@carefully-built/forms';
import {
  FilterDropdown,
  Input,
  SearchInput,
  TableToolbar as BaseTableToolbar,
} from '@carefully-built/ui';

export type { FilterConfig, FilterOption };
export { FilterDropdown, SearchInput };

interface AssociationFilter {
  readonly key: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly options: AssociationPickerOption[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly clearable?: boolean;
}

export interface CrudTableToolbarProps extends Omit<
  BaseTableToolbarProps,
  'customFilters' | 'renderRangeInput'
> {
  readonly associationFilters?: readonly AssociationFilter[];
}

function getAssociationCustomFilters(
  associationFilters?: readonly AssociationFilter[],
): CustomTableToolbarFilter[] | undefined {
  return associationFilters?.map((filter) => ({
    key: filter.key,
    label: filter.label,
    icon: filter.icon,
    value: filter.value,
    clearValue: 'all',
    clearable: filter.clearable,
    onChange: filter.onChange,
    render: ({ value, setValue }) => (
      <AssociationPicker
        options={filter.options}
        value={value === 'all' ? [] : [value]}
        onChange={(values) => {
          setValue(values[0] ?? 'all');
        }}
        maxSelections={1}
        placeholder={filter.placeholder ?? `All: ${filter.label}`}
        searchPlaceholder={filter.searchPlaceholder ?? `Search ${filter.label.toLocaleLowerCase()}...`}
        className="w-full"
      />
    ),
  }));
}

export function CrudTableToolbar({
  associationFilters,
  rangeFilters,
  ...props
}: CrudTableToolbarProps): React.ReactElement {
  return (
    <BaseTableToolbar
      {...props}
      rangeFilters={rangeFilters}
      customFilters={getAssociationCustomFilters(associationFilters)}
      renderRangeInput={({ filter, value, onChange, placeholder }) =>
        filter.inputType === 'date' ? (
          <CustomDateField
            value={value}
            onChange={(nextValue) => {
              onChange(nextValue ?? '');
            }}
            placeholder={placeholder}
          />
        ) : (
          <Input
            type={filter.inputType ?? 'text'}
            inputMode={filter.inputMode ?? 'decimal'}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            placeholder={placeholder}
          />
        )
      }
    />
  );
}
