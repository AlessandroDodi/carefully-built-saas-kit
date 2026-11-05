import { useKitLocale } from './kit-locale';

import type { KitLocale } from './kit-locale';

/** Default copy of one component, one entry per supported locale. */
export type KitTexts<T extends object> = Readonly<Record<KitLocale, T>>;

/** Overrides as components receive them from props: any key may be undefined. */
export type KitTextOverrides<T extends object> = { readonly [K in keyof T]?: T[K] | undefined };

/**
 * Identity helper: declaring a dictionary through it makes TypeScript check
 * that every locale defines exactly the same keys.
 */
export function defineKitTexts<T extends object>(texts: KitTexts<T>): KitTexts<T> {
  return texts;
}

/**
 * The locale's defaults with the defined overrides on top. Undefined overrides
 * are skipped, so `{ label: props.label }` keeps the default when the prop is
 * omitted. Pure, for resolvers and tests; components use `useKitTexts`.
 */
export function resolveKitTexts<T extends object>(
  texts: KitTexts<T>,
  locale: KitLocale,
  overrides?: KitTextOverrides<T>,
): T {
  const resolved: { -readonly [K in keyof T]: T[K] } = { ...texts[locale] };
  if (!overrides) return resolved;

  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const value = overrides[key];
    if (value !== undefined) resolved[key] = value as T[keyof T];
  }

  return resolved;
}

export function useKitTexts<T extends object>(
  texts: KitTexts<T>,
  overrides?: KitTextOverrides<T>,
): T {
  return resolveKitTexts(texts, useKitLocale(), overrides);
}
