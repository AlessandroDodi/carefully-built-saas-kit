import { describe, expect, test } from 'bun:test';

import {
  getAvailableTypeOptions,
  getResolvedAssociationPickerLabels,
} from '../src/associationPicker.options';
import { getCreateButtonLabel } from '../src/associationPicker.create';
import type { AssociationPickerOption } from '../src/types';

const options = [
  {
    entityId: 'contact_1',
    entityType: 'contact',
    label: 'Ada Lovelace',
    typeLabel: 'Contatto',
    value: 'contact:contact_1',
  },
  {
    entityId: 'document_1',
    entityType: 'document',
    label: 'Contract.pdf',
    typeLabel: 'Documento',
    value: 'document:document_1',
  },
] satisfies AssociationPickerOption[];

describe('association picker labels', () => {
  test('defaults multi-type filter labels to English', () => {
    expect(getAvailableTypeOptions(options)[0]?.label).toBe('All');
  });

  test('uses localized all and entity type labels', () => {
    const labels = getResolvedAssociationPickerLabels({
      allTypesLabel: 'Everything',
      entityTypeLabels: {
        contact: 'Contatti',
        document: 'Documenti',
      },
    });

    expect(getAvailableTypeOptions(options, labels).map((option) => option.label)).toEqual([
      'Everything',
      'Contatti',
      'Documenti',
    ]);
  });

  test('uses localized create labels', () => {
    const labels = getResolvedAssociationPickerLabels({
      createLabel: 'Crea',
      createEntityLabel: (entityTypeLabel) => `Crea ${entityTypeLabel}`,
      entityTypeLabels: {
        contact: 'contatto',
      },
    });

    expect(getCreateButtonLabel(null, labels)).toBe('Crea');
    expect(getCreateButtonLabel('contact', labels)).toBe('Crea contatto');
  });
});
