import { describe, expect, test } from 'bun:test';

import {
  filterDeviceCodeCharacters,
  formatDeviceCode,
  getDeviceCodeInputMode,
  normalizeDeviceCode,
  pasteDeviceCode,
  resolveDeviceCodeGroups,
  splitDeviceCode,
} from '../src/primitives/device-code-input.utils';

const alphanumeric = { length: 6 } as const;
const numeric = { length: 4, charset: 'numeric' } as const;

describe('normalizeDeviceCode', () => {
  test('strips separators and spaces and upper-cases', () => {
    expect(normalizeDeviceCode('abc-1 2_3', alphanumeric)).toBe('ABC123');
  });

  test('cuts to the length', () => {
    expect(normalizeDeviceCode('ABC123XYZ', alphanumeric)).toBe('ABC123');
  });

  test('numeric codes drop letters', () => {
    expect(normalizeDeviceCode('1a2b 3-4 5', numeric)).toBe('1234');
  });

  test('keeps the case when uppercase is off', () => {
    expect(normalizeDeviceCode('aB-c1', { length: 6, uppercase: false })).toBe('aBc1');
  });

  test('drops characters outside the charset, accents included', () => {
    expect(normalizeDeviceCode('è1•ñ2', alphanumeric)).toBe('12');
  });

  test('an empty or negative length gives an empty code', () => {
    expect(normalizeDeviceCode('123', { length: 0 })).toBe('');
    expect(normalizeDeviceCode('123', { length: -2 })).toBe('');
  });
});

describe('filterDeviceCodeCharacters', () => {
  test('does not cut to a length', () => {
    expect(filterDeviceCodeCharacters('abc-def-ghi')).toBe('ABCDEFGHI');
  });
});

describe('resolveDeviceCodeGroups', () => {
  test('one group of the length by default', () => {
    expect(resolveDeviceCodeGroups()).toEqual([6]);
    expect(resolveDeviceCodeGroups(4)).toEqual([4]);
  });

  test('valid groups win over the length', () => {
    expect(resolveDeviceCodeGroups(6, [3, 3])).toEqual([3, 3]);
    expect(resolveDeviceCodeGroups(6, [4, 4])).toEqual([4, 4]);
  });

  test('invalid groups fall back to the length', () => {
    expect(resolveDeviceCodeGroups(6, [])).toEqual([6]);
    expect(resolveDeviceCodeGroups(6, [3, 0])).toEqual([6]);
    expect(resolveDeviceCodeGroups(6, [2.5, 3])).toEqual([6]);
  });

  test('a length below one still renders a cell', () => {
    expect(resolveDeviceCodeGroups(0)).toEqual([1]);
  });
});

describe('formatDeviceCode', () => {
  test('joins complete groups with the separator', () => {
    expect(formatDeviceCode('ABC123', [3, 3])).toBe('ABC-123');
    expect(formatDeviceCode('ABC123', [3, 3], ' ')).toBe('ABC 123');
  });

  test('an incomplete code has no trailing separator', () => {
    expect(formatDeviceCode('ABC', [3, 3])).toBe('ABC');
    expect(formatDeviceCode('ABC1', [3, 3])).toBe('ABC-1');
    expect(formatDeviceCode('', [3, 3])).toBe('');
  });

  test('splitDeviceCode keeps empty groups', () => {
    expect(splitDeviceCode('ABC1', [3, 3])).toEqual(['ABC', '1']);
    expect(splitDeviceCode('AB', [3, 3])).toEqual(['AB', '']);
  });
});

describe('pasteDeviceCode', () => {
  test('a whole formatted code replaces everything, wherever the caret is', () => {
    expect(pasteDeviceCode('XY', ' abc-123 ', { start: 1, end: 1 }, alphanumeric)).toEqual({
      value: 'ABC123',
      caret: 6,
    });
  });

  test('a longer paste is cut to the length', () => {
    expect(pasteDeviceCode('', '1234567890', { start: 0, end: 0 }, numeric)).toEqual({
      value: '1234',
      caret: 4,
    });
  });

  test('a partial paste is inserted at the caret', () => {
    expect(pasteDeviceCode('AB', 'c1', { start: 2, end: 2 }, alphanumeric)).toEqual({
      value: 'ABC1',
      caret: 4,
    });
  });

  test('a partial paste replaces the selected cell', () => {
    expect(pasteDeviceCode('ABCDEF', 'x', { start: 2, end: 3 }, alphanumeric)).toEqual({
      value: 'ABXDEF',
      caret: 3,
    });
  });

  test('a paste with nothing usable changes nothing', () => {
    expect(pasteDeviceCode('AB', '--  ', { start: 2, end: 2 }, alphanumeric)).toEqual({
      value: 'AB',
      caret: 2,
    });
  });
});

describe('getDeviceCodeInputMode', () => {
  test('digits keyboard only for numeric codes', () => {
    expect(getDeviceCodeInputMode('numeric')).toBe('numeric');
    expect(getDeviceCodeInputMode('alphanumeric')).toBe('text');
    expect(getDeviceCodeInputMode()).toBe('text');
  });
});
