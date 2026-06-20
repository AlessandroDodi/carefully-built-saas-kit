export interface CommandPaletteFallbackIconStyle {
  readonly backgroundColor: string;
  readonly color: string;
}

const unsafeColorPattern = /(?:url|expression|javascript|data):|[;{}]/i;
const supportedColorPattern = /^[#\w\s.,%()+/-]+$/u;

function isCommandPaletteColorValue(value: string): boolean {
  const color = value.trim();

  return color.length > 0 && supportedColorPattern.test(color) && !unsafeColorPattern.test(color);
}

export function getCommandPaletteFallbackIconStyle(
  color: string | null | undefined,
): CommandPaletteFallbackIconStyle | undefined {
  if (!color || !isCommandPaletteColorValue(color)) {
    return undefined;
  }

  const normalizedColor = color.trim();

  return {
    backgroundColor: `color-mix(in srgb, ${normalizedColor} 14%, transparent)`,
    color: normalizedColor,
  };
}
