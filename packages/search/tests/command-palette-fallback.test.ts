import { describe, expect, test } from 'bun:test';

import {
  getCommandPaletteFallbackIconStyle,
} from '../src/command-palette-fallback';

describe('command palette fallback icon style', () => {
  test('uses a supplied entity color for image-less results', () => {
    expect(getCommandPaletteFallbackIconStyle('#2563eb')).toEqual({
      backgroundColor: 'color-mix(in srgb, #2563eb 14%, transparent)',
      color: '#2563eb',
    });
  });

  test('ignores unsupported color values', () => {
    expect(getCommandPaletteFallbackIconStyle('url(javascript:alert(1))')).toBeUndefined();
  });
});
