import {
  CalendarDays,
  FileQuestion,
  Hash,
  ListChecks,
  TextCursorInput,
  ToggleLeft,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type CustomFieldEntityType =
  | 'contact'
  | 'property'
  | 'request'
  | 'opportunity'
  | 'note'
  | 'document'
  | 'activity';

export type CustomFieldType =
  | 'text'
  | 'boolean'
  | 'single_select'
  | 'multi_select'
  | 'long_text'
  | 'number'
  | 'date'
  | 'json';

export interface CustomFieldDefinition<TId = string> {
  readonly _id: TId;
  readonly fieldType: CustomFieldType;
  readonly label?: string;
  readonly options?: readonly string[];
}

export interface CustomFieldValue<TDefinitionId = string> {
  readonly fieldDefinitionId: TDefinitionId;
  readonly valueType: CustomFieldType | 'text';
  readonly textValue?: string;
  readonly numberValue?: number;
  readonly booleanValue?: boolean;
  readonly dateValue?: number;
  readonly stringListValue?: string[];
  readonly jsonValue?: unknown;
}

export type CustomFieldFormValues = Record<string, unknown>;

export interface CustomFieldOptionPricing {
  readonly multiplier: number;
  readonly fixedValue: number;
}

export interface CustomFieldOptionPricingEntry extends CustomFieldOptionPricing {
  readonly option: string;
}

export interface CustomFieldOptionConfig {
  readonly pricing?: CustomFieldOptionPricingEntry[] | Record<string, CustomFieldOptionPricing>;
  readonly isSystem?: boolean;
}

export const CUSTOM_FIELD_ENTITY_OPTIONS: readonly {
  readonly value: CustomFieldEntityType;
  readonly label: string;
}[] = [
  { value: 'contact', label: 'Contact' },
  { value: 'property', label: 'Property' },
  { value: 'request', label: 'Request' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'note', label: 'Note' },
  { value: 'document', label: 'Document' },
  { value: 'activity', label: 'Activity' },
];

export const CUSTOM_FIELD_TYPE_OPTIONS: readonly {
  readonly value: CustomFieldType;
  readonly label: string;
}[] = [
  { value: 'boolean', label: 'Yes or no' },
  { value: 'single_select', label: 'List' },
  { value: 'long_text', label: 'Description' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
];

export function getCustomFieldTypeLabel(fieldType: string): string {
  return CUSTOM_FIELD_TYPE_OPTIONS.find((option) => option.value === fieldType)?.label ?? fieldType;
}

export const customFieldTypeChipMeta = {
  boolean: {
    className: 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-blue-500/20 dark:text-blue-200',
    icon: ToggleLeft,
  },
  single_select: {
    className: 'bg-[#70ff8f2b] text-[#008947] dark:bg-emerald-500/20 dark:text-emerald-200',
    icon: ListChecks,
  },
  multi_select: {
    className: 'bg-[#70ff8f2b] text-[#008947] dark:bg-emerald-500/20 dark:text-emerald-200',
    icon: ListChecks,
  },
  long_text: {
    className: 'bg-[#ffe27a33] text-[#8a6d00] dark:bg-amber-500/20 dark:text-amber-200',
    icon: TextCursorInput,
  },
  text: {
    className: 'bg-[#ffe27a33] text-[#8a6d00] dark:bg-amber-500/20 dark:text-amber-200',
    icon: TextCursorInput,
  },
  number: {
    className: 'bg-[#9770ff2b] text-[#250089] dark:bg-violet-500/25 dark:text-violet-200',
    icon: Hash,
  },
  date: {
    className: 'bg-[#f1f5f9] text-[#334155] dark:bg-slate-500/20 dark:text-slate-200',
    icon: CalendarDays,
  },
} as const;

export function getCustomFieldTypeChipMeta(fieldType: string): {
  readonly className: string;
  readonly icon: ComponentType<{ className?: string }>;
} {
  return customFieldTypeChipMeta[fieldType as keyof typeof customFieldTypeChipMeta] ?? {
    className: 'bg-muted text-muted-foreground',
    icon: FileQuestion,
  };
}

export function isChoiceCustomField(fieldType: string): boolean {
  return fieldType === 'single_select' || fieldType === 'multi_select';
}

export function readCustomFieldConfig(config: unknown): CustomFieldOptionConfig {
  return config && typeof config === 'object' ? config as CustomFieldOptionConfig : {};
}

export function readCustomFieldPricing(
  config: unknown
): Record<string, CustomFieldOptionPricing> {
  const pricing = readCustomFieldConfig(config).pricing;

  if (Array.isArray(pricing)) {
    return Object.fromEntries(
      pricing.map((entry) => [
        entry.option,
        {
          multiplier: entry.multiplier,
          fixedValue: entry.fixedValue,
        },
      ])
    );
  }

  return pricing ?? {};
}

function formatDateInputValue(timestamp: number | undefined): string {
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
    return '';
  }

  const date = new Date(timestamp);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: unknown): number | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = new Date(year, month - 1, day).getTime();

  return Number.isFinite(timestamp) ? timestamp : undefined;
}

export function mapCustomFieldValuesToFormValues(
  values: readonly CustomFieldValue<unknown>[] | undefined
): CustomFieldFormValues {
  const formValues: CustomFieldFormValues = {};

  for (const value of values ?? []) {
    const key = String(value.fieldDefinitionId);

    if (value.valueType === 'number') {
      formValues[key] = value.numberValue;
      continue;
    }

    if (value.valueType === 'boolean') {
      formValues[key] = value.booleanValue;
      continue;
    }

    if (value.valueType === 'date') {
      formValues[key] = formatDateInputValue(value.dateValue);
      continue;
    }

    if (value.valueType === 'multi_select') {
      formValues[key] = value.stringListValue ?? [];
      continue;
    }

    formValues[key] = value.textValue ?? '';
  }

  return formValues;
}

function areArrayValuesEqual(left: readonly unknown[], right: readonly unknown[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export function areCustomFieldFormValuesEqual(
  left: CustomFieldFormValues,
  right: CustomFieldFormValues
): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!Object.prototype.hasOwnProperty.call(right, key)) {
      return false;
    }

    const leftValue = left[key];
    const rightValue = right[key];

    if (Array.isArray(leftValue) || Array.isArray(rightValue)) {
      if (!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
        return false;
      }

      if (!areArrayValuesEqual(leftValue, rightValue)) {
        return false;
      }

      continue;
    }

    if (leftValue !== rightValue) {
      return false;
    }
  }

  return true;
}

export function buildCustomFieldValuePayload<TId>(
  definitions: readonly CustomFieldDefinition<TId>[] | undefined,
  values: CustomFieldFormValues
): {
  fieldDefinitionId: TId;
  valueType: 'text' | 'long_text' | 'number' | 'boolean' | 'date' | 'single_select' | 'multi_select' | 'json';
  textValue?: string;
  numberValue?: number;
  booleanValue?: boolean;
  dateValue?: number;
  stringListValue?: string[];
}[] {
  return (definitions ?? []).map((definition) => {
    const rawValue = values[String(definition._id)];
    const base = {
      fieldDefinitionId: definition._id,
      valueType: definition.fieldType,
    };

    if (definition.fieldType === 'number') {
      const numberValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);
      return {
        ...base,
        numberValue: Number.isFinite(numberValue) ? numberValue : undefined,
      };
    }

    if (definition.fieldType === 'boolean') {
      return {
        ...base,
        booleanValue: typeof rawValue === 'boolean' ? rawValue : undefined,
      };
    }

    if (definition.fieldType === 'date') {
      return {
        ...base,
        dateValue: parseDateInputValue(rawValue),
      };
    }

    if (definition.fieldType === 'multi_select') {
      return {
        ...base,
        stringListValue: Array.isArray(rawValue)
          ? rawValue.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
          : [],
      };
    }

    return {
      ...base,
      textValue: typeof rawValue === 'string' ? rawValue.trim() : '',
    };
  });
}

export function formatCustomFieldDisplayValue(
  definition: Pick<CustomFieldDefinition, 'fieldType'>,
  value: CustomFieldValue<unknown> | undefined,
  emptyValue = '--'
): string {
  if (!value) {
    return emptyValue;
  }

  if (definition.fieldType === 'number') {
    return typeof value.numberValue === 'number'
      ? new Intl.NumberFormat('en-US').format(value.numberValue)
      : emptyValue;
  }

  if (definition.fieldType === 'boolean') {
    return typeof value.booleanValue === 'boolean'
      ? (value.booleanValue ? 'Yes' : 'No')
      : emptyValue;
  }

  if (definition.fieldType === 'date') {
    return typeof value.dateValue === 'number'
      ? new Intl.DateTimeFormat('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(new Date(value.dateValue))
      : emptyValue;
  }

  if (definition.fieldType === 'multi_select') {
    return value.stringListValue && value.stringListValue.length > 0
      ? value.stringListValue.join(', ')
      : emptyValue;
  }

  if (definition.fieldType === 'json') {
    return value.jsonValue === undefined ? emptyValue : JSON.stringify(value.jsonValue);
  }

  const textValue = value.textValue?.trim();
  if (!textValue) {
    return emptyValue;
  }

  return textValue;
}
