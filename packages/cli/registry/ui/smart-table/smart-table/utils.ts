import { createElement } from 'react';

import type { Column } from '@/components/ui/smart-table/types';
import type { ReactNode } from 'react';


import { DisplayDate } from '@/components/ui/display-date';
import { formatDisplayDate } from '@/components/ui/date-display';

function formatListEntry(value: unknown): string {
  const formatted = formatValue(value);

  if (typeof formatted === 'string' || typeof formatted === 'number') {
    return String(formatted);
  }

  return '—';
}

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'user.profile.name')
 */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Format a value for display
 */
function formatValue(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No';
  }

  if (value instanceof Date) {
    return createElement(DisplayDate, { value });
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '—';
    }

    return value.map((entry) => formatListEntry(entry)).join(', ');
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    for (const key of ['label', 'name', 'title']) {
      const nestedValue = record[key];
      if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
        return String(nestedValue);
      }
    }
  }

  return '[Object]';
}

function formatValueAsText(value: unknown): string | null {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No';
  }

  if (value instanceof Date) {
    return formatDisplayDate(value);
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '—';
    }

    return value.map((entry) => formatValueAsText(entry) ?? '—').join(', ');
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    for (const key of ['label', 'name', 'title']) {
      const nestedValue = record[key];
      if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
        return String(nestedValue);
      }
    }
  }

  return null;
}

export function getColumnValue<T>(column: Column<T>, item: T): unknown {
  if (!column.accessor) {
    return null;
  }

  if (typeof column.accessor === 'string' && column.accessor.includes('.')) {
    return getNestedValue(item, column.accessor);
  }

  return (item as Record<string, unknown>)[column.accessor as string];
}

export function renderColumnValue<T>(column: Column<T>, item: T): ReactNode {
  const value = getColumnValue(column, item);

  if (column.render) {
    return column.render(value, item);
  }

  return formatValue(value);
}

export function getColumnTooltipText<T>(column: Column<T>, item: T): string | null {
  if (column.render) {
    return null;
  }

  return formatValueAsText(getColumnValue(column, item));
}
