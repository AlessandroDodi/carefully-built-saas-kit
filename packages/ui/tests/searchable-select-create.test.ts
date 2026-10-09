import { describe, expect, test } from 'bun:test';

import { shouldOfferSearchableSelectCreate } from '../src/search/searchable-select';

const OPTIONS = [
  { value: 'a', label: 'Esselunga' },
  { value: 'b', label: 'Coop' },
];

describe('shouldOfferSearchableSelectCreate', () => {
  test('offers nothing for an empty or blank query', () => {
    expect(shouldOfferSearchableSelectCreate('', OPTIONS)).toBe(false);
    expect(shouldOfferSearchableSelectCreate('   ', OPTIONS)).toBe(false);
  });

  test('offers nothing when the typed text matches an option label (case-insensitive, trimmed)', () => {
    expect(shouldOfferSearchableSelectCreate(' esselunga ', OPTIONS)).toBe(false);
  });

  test('offers the create row for a partial or new value', () => {
    expect(shouldOfferSearchableSelectCreate('Essel', OPTIONS)).toBe(true);
    expect(shouldOfferSearchableSelectCreate('Lidl', OPTIONS)).toBe(true);
  });
});
