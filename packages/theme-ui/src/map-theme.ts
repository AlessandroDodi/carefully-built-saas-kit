export const MAP_THEME_VALUES = [
  "standard",
  "silver",
  "retro",
  "dark",
  "night",
  "aubergine",
] as const;

export type MapTheme = (typeof MAP_THEME_VALUES)[number];

export const DEFAULT_MAP_THEME: MapTheme = "standard";

export interface SavedMapThemeConfig {
  readonly mapTheme?: string;
  readonly websiteMapTheme?: string;
}

export interface MapThemeOption {
  readonly value: MapTheme;
  readonly label: string;
  readonly imageSrc: string;
}

export const MAP_THEME_OPTIONS: readonly MapThemeOption[] = [
  {
    value: "standard",
    label: "Standard",
    imageSrc: "/dashboard/settings/maps_theme/standard.png",
  },
  {
    value: "silver",
    label: "Silver",
    imageSrc: "/dashboard/settings/maps_theme/silver.png",
  },
  {
    value: "retro",
    label: "Retro",
    imageSrc: "/dashboard/settings/maps_theme/retro.png",
  },
  {
    value: "dark",
    label: "Dark",
    imageSrc: "/dashboard/settings/maps_theme/dark.png",
  },
  {
    value: "night",
    label: "Night",
    imageSrc: "/dashboard/settings/maps_theme/night.png",
  },
  {
    value: "aubergine",
    label: "Aubergine",
    imageSrc: "/dashboard/settings/maps_theme/aubergine.png",
  },
] as const;

export function isMapTheme(value: string): value is MapTheme {
  return MAP_THEME_VALUES.includes(value as MapTheme);
}

export function resolveMapTheme(
  savedConfig: SavedMapThemeConfig | undefined,
  key: keyof SavedMapThemeConfig = "mapTheme",
): MapTheme {
  const savedTheme = savedConfig?.[key];
  return savedTheme && isMapTheme(savedTheme) ? savedTheme : DEFAULT_MAP_THEME;
}
