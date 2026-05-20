export interface DashboardMobileNavigationConfig {
  readonly bottom: readonly string[];
}

export interface ResolvedMobileBottomNavigation<TItem> {
  readonly enabled: boolean;
  readonly directItems: readonly TItem[];
  readonly overflowItems: readonly TItem[];
}

export interface KeyedNavigationItem {
  readonly key: string;
}

const MAX_DIRECT_MOBILE_ITEMS = 4;

export function resolveMobileBottomNavigation<TItem extends KeyedNavigationItem>(
  config: DashboardMobileNavigationConfig | undefined,
  mainItems: readonly TItem[],
  secondaryItems: readonly TItem[],
): ResolvedMobileBottomNavigation<TItem> {
  if (!config) {
    return {
      enabled: false,
      directItems: [],
      overflowItems: [],
    };
  }

  const allItems = [...mainItems, ...secondaryItems];
  const itemByKey = new Map(allItems.map((item) => [item.key, item]));
  const seenKeys = new Set<string>();

  const resolvedConfiguredItems = config.bottom.flatMap((key) => {
    if (seenKeys.has(key)) {
      return [];
    }

    seenKeys.add(key);
    const item = itemByKey.get(key);
    return item ? [item] : [];
  });

  if (resolvedConfiguredItems.length === 0) {
    return {
      enabled: false,
      directItems: [],
      overflowItems: [],
    };
  }

  const directItems = resolvedConfiguredItems.slice(0, MAX_DIRECT_MOBILE_ITEMS);
  const directItemKeys = new Set(directItems.map((item) => item.key));
  const overflowItems = allItems.filter((item) => !directItemKeys.has(item.key));

  return {
    enabled: true,
    directItems,
    overflowItems,
  };
}
