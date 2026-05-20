export interface NamedColorOption {
  readonly value: string;
  readonly label: string;
}

export const NAMED_COLOR_OPTIONS = [
  { value: "#713DFF", label: "Viola" },
  { value: "#0EA5E9", label: "Blu cielo" },
  { value: "#06B6D4", label: "Turchese" },
  { value: "#22C55E", label: "Verde" },
  { value: "#84CC16", label: "Lime" },
  { value: "#F59E0B", label: "Ambra" },
  { value: "#EAB308", label: "Giallo" },
  { value: "#EF4444", label: "Rosso" },
  { value: "#EC4899", label: "Rosa" },
  { value: "#8B5CF6", label: "Lavanda" },
  { value: "#6366F1", label: "Indaco" },
  { value: "#EA580C", label: "Arancio" },
  { value: "#64748B", label: "Ardesia" },
] as const satisfies readonly NamedColorOption[];

export const NAMED_COLOR_VALUES = NAMED_COLOR_OPTIONS.map((option) => option.value) as readonly string[];

function normalizeHexColor(value: string): string {
  return value.trim().toUpperCase();
}

function hexToRgb(value: string): { red: number; green: number; blue: number } | null {
  const normalizedValue = normalizeHexColor(value);
  const matchedValue = /^#([0-9A-F]{6})$/.exec(normalizedValue);

  if (!matchedValue) {
    return null;
  }

  const hexValue = matchedValue[1];
  if (!hexValue) {
    return null;
  }

  return {
    red: Number.parseInt(hexValue.slice(0, 2), 16),
    green: Number.parseInt(hexValue.slice(2, 4), 16),
    blue: Number.parseInt(hexValue.slice(4, 6), 16),
  };
}

function getColorDistance(left: string, right: string): number {
  const leftRgb = hexToRgb(left);
  const rightRgb = hexToRgb(right);

  if (!leftRgb || !rightRgb) {
    return Number.POSITIVE_INFINITY;
  }

  return (
    (leftRgb.red - rightRgb.red) ** 2 +
    (leftRgb.green - rightRgb.green) ** 2 +
    (leftRgb.blue - rightRgb.blue) ** 2
  );
}

export function normalizeNamedColor(value: string): string {
  const normalizedValue = normalizeHexColor(value);

  if (NAMED_COLOR_VALUES.includes(normalizedValue)) {
    return normalizedValue;
  }

  let closestColor = NAMED_COLOR_VALUES[0] ?? "#713DFF";
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const candidateColor of NAMED_COLOR_VALUES) {
    const candidateDistance = getColorDistance(normalizedValue, candidateColor);
    if (candidateDistance < closestDistance) {
      closestColor = candidateColor;
      closestDistance = candidateDistance;
    }
  }

  return closestColor;
}
