"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";

export interface UrlStringFilterDefinition<TKey extends string = string> {
  readonly key: TKey;
  readonly param?: string;
  readonly defaultValue?: string;
  readonly clearValue?: string;
}

type UrlStringFilterValues<TDefinitions extends readonly UrlStringFilterDefinition[]> = {
  readonly [TDefinition in TDefinitions[number] as TDefinition["key"]]: string;
};

export interface UrlStringFiltersState<
  TDefinitions extends readonly UrlStringFilterDefinition[],
> {
  readonly values: UrlStringFilterValues<TDefinitions>;
  readonly setValue: (key: TDefinitions[number]["key"], value: string) => void;
  readonly clear: () => void;
  readonly getDraftValues: (
    draftValues: Record<string, string>,
  ) => UrlStringFilterValues<TDefinitions>;
}

function buildParserMap(definitions: readonly UrlStringFilterDefinition[]) {
  return Object.fromEntries(
    definitions.map((definition) => [
      definition.param ?? definition.key,
      parseAsString.withDefault(definition.defaultValue ?? "all"),
    ]),
  );
}

function normalizeFilterValue(
  value: string,
  definition: UrlStringFilterDefinition,
): string | null {
  const clearValue = definition.clearValue ?? definition.defaultValue ?? "all";

  if (value === clearValue) {
    return null;
  }

  return value.length > 0 ? value : null;
}

export function useUrlStringFilters<
  const TDefinitions extends readonly UrlStringFilterDefinition[],
>(definitions: TDefinitions): UrlStringFiltersState<TDefinitions> {
  const parserMap = useMemo(() => buildParserMap(definitions), [definitions]);
  const [params, setParams] = useQueryStates(parserMap);

  const values = useMemo(
    () =>
      Object.fromEntries(
        definitions.map((definition) => {
          const param = definition.param ?? definition.key;
          return [definition.key, params[param] ?? definition.defaultValue ?? "all"];
        }),
      ) as UrlStringFilterValues<TDefinitions>,
    [definitions, params],
  );

  const setValue = useCallback(
    (key: TDefinitions[number]["key"], value: string) => {
      const definition = definitions.find((item) => item.key === key);

      if (!definition) {
        return;
      }

      void setParams({
        [definition.param ?? definition.key]: normalizeFilterValue(value, definition),
      });
    },
    [definitions, setParams],
  );

  const clear = useCallback(() => {
    void setParams(
      Object.fromEntries(
        definitions.map((definition) => [definition.param ?? definition.key, null]),
      ),
    );
  }, [definitions, setParams]);

  const getDraftValues = useCallback(
    (draftValues: Record<string, string>) =>
      ({
        ...values,
        ...draftValues,
      }) as UrlStringFilterValues<TDefinitions>,
    [values],
  );

  return {
    values,
    setValue,
    clear,
    getDraftValues,
  };
}
