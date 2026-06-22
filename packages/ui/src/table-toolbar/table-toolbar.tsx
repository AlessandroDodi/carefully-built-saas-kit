'use client';

import { Filter, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '../primitives/button';
import { Input } from '../primitives/input';
import { DesktopConfirmShortcutHint } from '../overlays/responsive-sheet.footer';
import { ResponsiveSheet } from '../overlays/responsive-sheet';
import { useDesktopShortcutModifierLabel } from '../overlays/responsive-sheet.shortcuts';
import { SearchableSelect } from '../search/searchable-select';
import { cn } from '../utils/cn';
import { useIsMobile } from '../utils/use-media-query';

export interface FilterOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
}

interface FilterDropdownProps<T extends string> {
  readonly label: string;
  readonly value: T | 'all';
  readonly options: readonly FilterOption<T>[];
  readonly onChange: (value: T | 'all') => void;
  readonly className?: string;
  readonly icon?: LucideIcon;
  readonly allowAll?: boolean;
}

export function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
  allowAll = true,
}: FilterDropdownProps<T>): React.ReactElement {
  return (
    <SearchableSelect
      value={value}
      onValueChange={(nextValue) => {
        onChange(nextValue as T | 'all');
      }}
      placeholder={label}
      className={className ?? 'w-full sm:w-[140px]'}
      searchPlaceholder={`Search ${label.toLocaleLowerCase()}...`}
      options={[...(allowAll ? [{ value: 'all', label: `Tutti: ${label}` }] : []), ...options]}
    />
  );
}

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchInputProps): React.ReactElement {
  return (
    <div className={cn('relative', className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="pr-9 pl-9"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('');
          }}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export interface FilterConfig<T extends string = string> {
  readonly key: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly options: readonly FilterOption<T>[];
}

interface SelectFilter {
  readonly config: FilterConfig;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly allowAll?: boolean;
  readonly clearable?: boolean;
}

interface TextFilter {
  readonly key: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

interface RangeFilter {
  readonly key: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly minValue: string;
  readonly maxValue: string;
  readonly onMinChange: (value: string) => void;
  readonly onMaxChange: (value: string) => void;
  readonly minPlaceholder?: string;
  readonly maxPlaceholder?: string;
  readonly inputType?: 'text' | 'date';
  readonly inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

export interface CustomTableToolbarFilter {
  readonly key: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly value: string;
  readonly clearValue?: string;
  readonly clearable?: boolean;
  readonly onChange: (value: string) => void;
  readonly render: (args: {
    readonly value: string;
    readonly setValue: (value: string) => void;
  }) => ReactNode;
}

export interface TableToolbarProps {
  readonly search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  readonly filters?: SelectFilter[];
  readonly textFilters?: TextFilter[];
  readonly customFilters?: CustomTableToolbarFilter[];
  readonly rangeFilters?: RangeFilter[];
  readonly renderRangeInput?: (args: {
    readonly filter: RangeFilter;
    readonly input: 'min' | 'max';
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly placeholder: string;
  }) => ReactNode;
  readonly inlineControls?: ReactNode;
  readonly onClearAll?: () => void;
  readonly getDraftResultCount?: (draftValues: Record<string, string>) => number | undefined;
  readonly children?: ReactNode;
}

export function TableToolbar({
  search,
  filters,
  textFilters,
  customFilters,
  rangeFilters,
  renderRangeInput,
  inlineControls,
  onClearAll,
  getDraftResultCount,
  children,
}: TableToolbarProps): React.ReactElement {
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilterValues, setDraftFilterValues] = useState<Record<string, string>>({});
  const hasFilters = Boolean(
    (filters?.length ?? 0) +
      (textFilters?.length ?? 0) +
      (customFilters?.length ?? 0) +
      (rangeFilters?.length ?? 0),
  );
  const desktopConfirmShortcutEnabled = filtersOpen && !isMobile;
  const desktopModifierLabel = useDesktopShortcutModifierLabel(desktopConfirmShortcutEnabled);
  const clearableFilters = filters?.filter((filter) => filter.clearable !== false) ?? [];
  const clearableCustomFilters =
    customFilters?.filter((filter) => filter.clearable !== false) ?? [];
  const filterValues = useMemo(
    () => ({
      ...Object.fromEntries((filters ?? []).map((filter) => [filter.config.key, filter.value])),
      ...Object.fromEntries((textFilters ?? []).map((filter) => [filter.key, filter.value])),
      ...Object.fromEntries((customFilters ?? []).map((filter) => [filter.key, filter.value])),
      ...Object.fromEntries(
        (rangeFilters ?? []).flatMap((filter) => [
          [`${filter.key}Min`, filter.minValue],
          [`${filter.key}Max`, filter.maxValue],
        ]),
      ),
    }),
    [customFilters, filters, rangeFilters, textFilters],
  );

  const activeFilterCount = clearableFilters.filter((filter) => filter.value !== 'all').length;
  const activeCustomFilterCount = clearableCustomFilters.filter(
    (filter) => filter.value !== (filter.clearValue ?? 'all'),
  ).length;
  const activeRangeFilterCount =
    rangeFilters?.filter((filter) => filter.minValue.trim() || filter.maxValue.trim()).length ?? 0;
  const activeTextFilterCount =
    textFilters?.filter((filter) => filter.value.trim().length > 0).length ?? 0;
  const hasDraftFilters =
    clearableFilters.some((filter) => {
      const draftValue = draftFilterValues[filter.config.key] ?? filter.value;
      return draftValue !== 'all';
    }) ||
    clearableCustomFilters.some((filter) => {
      const draftValue = draftFilterValues[filter.key] ?? filter.value;
      return draftValue !== (filter.clearValue ?? 'all');
    }) ||
    (rangeFilters ?? []).some((filter) => {
      const minValue = draftFilterValues[`${filter.key}Min`] ?? filter.minValue;
      const maxValue = draftFilterValues[`${filter.key}Max`] ?? filter.maxValue;
      return Boolean(minValue.trim() || maxValue.trim());
    }) ||
    (textFilters ?? []).some((filter) => {
      const draftValue = draftFilterValues[filter.key] ?? filter.value;
      return draftValue.trim().length > 0;
    });
  const draftResultCount = useMemo(
    () => (filtersOpen ? getDraftResultCount?.(draftFilterValues) : undefined),
    [draftFilterValues, filtersOpen, getDraftResultCount],
  );
  const applyButtonLabel =
    typeof draftResultCount === 'number'
      ? `Show ${draftResultCount.toLocaleString('en-US')} ${
          draftResultCount === 1 ? 'result' : 'results'
        }`
      : 'Show results';

  function openFiltersSheet(): void {
    setDraftFilterValues(filterValues);
    setFiltersOpen(true);
  }

  const activeFilterTotal =
    activeFilterCount + activeCustomFilterCount + activeRangeFilterCount + activeTextFilterCount;

  function updateDraftFilterValue(key: string, value: string): void {
    setDraftFilterValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  function clearAndApplyFilters(): void {
    const clearedValues = Object.fromEntries(
      clearableFilters.map((filter) => [filter.config.key, 'all']),
    );
    const clearedRangeValues = Object.fromEntries(
      (rangeFilters ?? []).flatMap((filter) => [
        [`${filter.key}Min`, ''],
        [`${filter.key}Max`, ''],
      ]),
    );
    const clearedTextValues = Object.fromEntries(
      (textFilters ?? []).map((filter) => [filter.key, '']),
    );
    const clearedCustomValues = Object.fromEntries(
      clearableCustomFilters.map((filter) => [filter.key, filter.clearValue ?? 'all']),
    );
    setDraftFilterValues((currentValues) => ({
      ...currentValues,
      ...clearedValues,
      ...clearedRangeValues,
      ...clearedTextValues,
      ...clearedCustomValues,
    }));
    filters?.forEach((filter) => {
      const nextValue = filter.clearable === false ? filter.value : 'all';
      if (nextValue !== filter.value) {
        filter.onChange(nextValue);
      }
    });
    rangeFilters?.forEach((filter) => {
      if (filter.minValue) {
        filter.onMinChange('');
      }
      if (filter.maxValue) {
        filter.onMaxChange('');
      }
    });
    textFilters?.forEach((filter) => {
      if (filter.value) {
        filter.onChange('');
      }
    });
    customFilters?.forEach((filter) => {
      const nextValue = filter.clearable === false ? filter.value : (filter.clearValue ?? 'all');
      if (nextValue !== filter.value) {
        filter.onChange(nextValue);
      }
    });
    setFiltersOpen(false);
  }

  function applyDraftFilters(): void {
    filters?.forEach((filter) => {
      const nextValue = draftFilterValues[filter.config.key] ?? filter.value;
      if (nextValue !== filter.value) {
        filter.onChange(nextValue);
      }
    });
    rangeFilters?.forEach((filter) => {
      const nextMinValue = draftFilterValues[`${filter.key}Min`] ?? filter.minValue;
      const nextMaxValue = draftFilterValues[`${filter.key}Max`] ?? filter.maxValue;
      if (nextMinValue !== filter.minValue) {
        filter.onMinChange(nextMinValue);
      }
      if (nextMaxValue !== filter.maxValue) {
        filter.onMaxChange(nextMaxValue);
      }
    });
    textFilters?.forEach((filter) => {
      const nextValue = draftFilterValues[filter.key] ?? filter.value;
      if (nextValue !== filter.value) {
        filter.onChange(nextValue);
      }
    });
    customFilters?.forEach((filter) => {
      const nextValue = draftFilterValues[filter.key] ?? filter.value;
      if (nextValue !== filter.value) {
        filter.onChange(nextValue);
      }
    });
    setFiltersOpen(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {search ? (
          <SearchInput
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder}
            className="min-w-0 flex-1 sm:w-64 sm:flex-initial"
          />
        ) : null}

        {inlineControls}

        {hasFilters ? (
          <Button variant="outline" className="relative gap-2" onClick={openFiltersSheet}>
            <Filter className="size-4" />
            Filters
            {activeFilterTotal > 0 ? (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px]">
                {activeFilterTotal}
              </span>
            ) : null}
          </Button>
        ) : null}

        {children ? (
          <div className="hidden sm:ml-auto sm:flex sm:items-center sm:gap-2">{children}</div>
        ) : null}
      </div>

      {hasFilters ? (
        <ResponsiveSheet
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          title="Filters"
          description="Restringi l'elenco con i criteri disponibili."
          onConfirm={applyDraftFilters}
          footer={
            <div className="flex w-full gap-2">
              {onClearAll ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!hasDraftFilters}
                  onClick={clearAndApplyFilters}
                  className="min-w-0 flex-1"
                >
                  <X className="mr-1 size-4" />
                  Azzera
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={applyDraftFilters}
                className={cn(
                  'relative min-w-0 flex-1',
                  desktopConfirmShortcutEnabled ? 'pr-12' : null,
                )}
              >
                <span className="inline-flex w-full items-center justify-center">
                  <span className="min-w-0 truncate">{applyButtonLabel}</span>
                  {desktopConfirmShortcutEnabled && desktopModifierLabel ? (
                    <span className="absolute top-1/2 right-2 -translate-y-1/2">
                      <DesktopConfirmShortcutHint desktopModifierLabel={desktopModifierLabel} />
                    </span>
                  ) : null}
                </span>
              </Button>
            </div>
          }
          width={420}
        >
          <div className="space-y-4">
            {filters?.map((filter) => {
              const Icon = filter.config.icon;

              return (
                <div key={filter.config.key} className="flex flex-col gap-1.5">
                  <span className="text-foreground flex items-center gap-2 text-sm font-medium">
                    {Icon ? (
                      <Icon className="text-foreground/70 size-3.5 shrink-0" strokeWidth={1.8} />
                    ) : null}
                    {filter.config.label}
                  </span>
                  <FilterDropdown
                    label={filter.config.label}
                    value={draftFilterValues[filter.config.key] ?? filter.value}
                    options={filter.config.options}
                    onChange={(value) => {
                      updateDraftFilterValue(filter.config.key, value);
                    }}
                    className="w-full"
                    allowAll={filter.allowAll}
                  />
                </div>
              );
            })}
            {customFilters?.map((filter) => {
              const Icon = filter.icon;

              return (
                <div key={filter.key} className="flex flex-col gap-1.5">
                  <span className="text-foreground flex items-center gap-2 text-sm font-medium">
                    {Icon ? (
                      <Icon className="text-foreground/70 size-3.5 shrink-0" strokeWidth={1.8} />
                    ) : null}
                    {filter.label}
                  </span>
                  {filter.render({
                    value: draftFilterValues[filter.key] ?? filter.value,
                    setValue: (value) => {
                      updateDraftFilterValue(filter.key, value);
                    },
                  })}
                </div>
              );
            })}
            {textFilters?.map((filter) => {
              const Icon = filter.icon;

              return (
                <div key={filter.key} className="flex flex-col gap-1.5">
                  <span className="text-foreground flex items-center gap-2 text-sm font-medium">
                    {Icon ? (
                      <Icon className="text-foreground/70 size-3.5 shrink-0" strokeWidth={1.8} />
                    ) : null}
                    {filter.label}
                  </span>
                  <Input
                    type="text"
                    value={draftFilterValues[filter.key] ?? filter.value}
                    onChange={(event) => {
                      updateDraftFilterValue(filter.key, event.target.value);
                    }}
                    placeholder={filter.placeholder ?? filter.label}
                  />
                </div>
              );
            })}
            {rangeFilters?.map((filter) => {
              const Icon = filter.icon;
              const minKey = `${filter.key}Min`;
              const maxKey = `${filter.key}Max`;

              return (
                <div key={filter.key} className="flex flex-col gap-1.5">
                  <span className="text-foreground flex items-center gap-2 text-sm font-medium">
                    {Icon ? (
                      <Icon className="text-foreground/70 size-3.5 shrink-0" strokeWidth={1.8} />
                    ) : null}
                    {filter.label}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {renderRangeInput ? (
                      <>
                        {renderRangeInput({
                          filter,
                          input: 'min',
                          value: draftFilterValues[minKey] ?? filter.minValue,
                          onChange: (value) => {
                            updateDraftFilterValue(minKey, value);
                          },
                          placeholder: filter.minPlaceholder ?? 'Da',
                        })}
                        {renderRangeInput({
                          filter,
                          input: 'max',
                          value: draftFilterValues[maxKey] ?? filter.maxValue,
                          onChange: (value) => {
                            updateDraftFilterValue(maxKey, value);
                          },
                          placeholder: filter.maxPlaceholder ?? 'A',
                        })}
                      </>
                    ) : (
                      <>
                        <Input
                          type={filter.inputType ?? 'text'}
                          inputMode={filter.inputMode ?? 'decimal'}
                          value={draftFilterValues[minKey] ?? filter.minValue}
                          onChange={(event) => {
                            updateDraftFilterValue(minKey, event.target.value);
                          }}
                          placeholder={filter.minPlaceholder ?? 'Min'}
                        />
                        <Input
                          type={filter.inputType ?? 'text'}
                          inputMode={filter.inputMode ?? 'decimal'}
                          value={draftFilterValues[maxKey] ?? filter.maxValue}
                          onChange={(event) => {
                            updateDraftFilterValue(maxKey, event.target.value);
                          }}
                          placeholder={filter.maxPlaceholder ?? 'Max'}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ResponsiveSheet>
      ) : null}
    </div>
  );
}
