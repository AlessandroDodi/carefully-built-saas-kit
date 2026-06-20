'use client';

import {
  CornerDownLeft,
  Loader2,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from 'react';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Input,
  KeyboardKeycap,
  ShortcutModifierKeycap,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
  useIsMobile,
} from '@carefully-built/ui';

import { getCommandPaletteFallbackIconStyle } from './command-palette-fallback';
import { buildSearchText, rankBySearch } from './index';

export interface CommandPaletteTypeOption<TType extends string> {
  readonly value: TType;
  readonly label: ReactNode;
  readonly aliases?: readonly string[];
  readonly completionLabel?: string;
  readonly icon?: ReactNode;
}

export interface CommandPaletteItemMeta {
  readonly label: ReactNode;
  readonly className?: string;
  readonly icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  readonly iconColor?: string | null;
}

export interface CommandPaletteProps<TItem, TType extends string> {
  readonly items: readonly TItem[];
  readonly typeOptions: readonly CommandPaletteTypeOption<TType>[];
  readonly activeAllType: TType;
  readonly getItemKey: (item: TItem) => string;
  readonly getItemType: (item: TItem) => TType;
  readonly getItemLabel: (item: TItem) => ReactNode;
  readonly getItemSearchText?: (item: TItem) => string;
  readonly getItemImageUrl?: (item: TItem) => string | null | undefined;
  readonly getItemMeta?: (item: TItem) => CommandPaletteItemMeta;
  readonly onSelect: (item: TItem) => void;
  readonly enableShortcut?: boolean;
  readonly isCollapsed?: boolean;
  readonly isMobile?: boolean;
  readonly isLoading?: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly placeholder?: string;
  readonly noResultsLabel?: string;
  readonly loadingLabel?: string;
  readonly triggerLabel?: string;
  readonly triggerTooltip?: string;
  readonly triggerVariant?: 'sidebar' | 'bottom-nav';
}

const keycapClassName =
  'border-border bg-background text-muted-foreground h-5 min-w-5 text-[10px] shadow-[0_1px_0_rgba(15,23,42,0.04)]';

function getShortcutLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'Ctrl';
  }

  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Cmd' : 'Ctrl';
}

function isCommandSearchShortcut(event: globalThis.KeyboardEvent): boolean {
  return event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.shiftKey;
}

function normalizeCommandSearchToken(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
}

export function getCommandPaletteTypeCompletion<TType extends string>(
  query: string,
  typeOptions: readonly CommandPaletteTypeOption<TType>[],
): CommandPaletteTypeOption<TType> | null {
  const normalizedQuery = normalizeCommandSearchToken(query);

  if (normalizedQuery.length === 0) {
    return null;
  }

  const matches = typeOptions.filter((option) => {
    const aliases = [String(option.label), option.completionLabel, ...(option.aliases ?? [])];
    return aliases.some((alias) =>
      normalizeCommandSearchToken(alias ?? '').startsWith(normalizedQuery),
    );
  });

  return matches.length === 1 ? matches[0] ?? null : null;
}

export function moveCommandPaletteIndex({
  currentIndex,
  direction,
  itemCount,
}: {
  readonly currentIndex: number;
  readonly direction: -1 | 1;
  readonly itemCount: number;
}): number {
  if (itemCount === 0) {
    return -1;
  }

  return (currentIndex + direction + itemCount) % itemCount;
}

function filterCommandPaletteItems<TItem, TType extends string>({
  activeAllType,
  activeType,
  getItemSearchText,
  getItemType,
  items,
  search,
}: {
  readonly activeAllType: TType;
  readonly activeType: TType;
  readonly getItemSearchText?: (item: TItem) => string;
  readonly getItemType: (item: TItem) => TType;
  readonly items: readonly TItem[];
  readonly search: string;
}): TItem[] {
  const scopedItems = items.filter((item) => {
    return activeType === activeAllType || getItemType(item) === activeType;
  });

  return rankBySearch(scopedItems, search, (item) =>
    getItemSearchText ? getItemSearchText(item) : buildSearchText(String(item)),
  );
}

export function CommandPalette<TItem, TType extends string>({
  activeAllType,
  description = 'Search and open records.',
  enableShortcut = true,
  getItemImageUrl,
  getItemKey,
  getItemLabel,
  getItemMeta,
  getItemSearchText,
  getItemType,
  isCollapsed = false,
  isLoading = false,
  isMobile = false,
  items,
  loadingLabel = 'Loading...',
  noResultsLabel = 'No results found',
  onSelect,
  placeholder = 'Search...',
  title = 'Search',
  triggerLabel = 'Search',
  triggerTooltip = 'Search',
  triggerVariant = 'sidebar',
  typeOptions,
}: CommandPaletteProps<TItem, TType>): React.ReactElement {
  const isMobileViewport = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<TType>(activeAllType);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [completedTypeFlash, setCompletedTypeFlash] = useState<TType | null>(null);
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl');

  const filteredItems = useMemo(
    () =>
      filterCommandPaletteItems({
        activeAllType,
        activeType,
        getItemSearchText,
        getItemType,
        items,
        search,
      }),
    [activeAllType, activeType, getItemSearchText, getItemType, items, search],
  );
  const completedType = useMemo(
    () => getCommandPaletteTypeCompletion(search, typeOptions),
    [search, typeOptions],
  );
  const completedSearchLabel = completedType?.completionLabel ?? completedType?.label ?? null;

  const selectItem = useCallback(
    (item: TItem | undefined): void => {
      if (!item) {
        return;
      }

      setIsOpen(false);
      setSearch('');
      setHighlightedIndex(0);
      onSelect(item);
    },
    [onSelect],
  );

  useEffect(() => {
    setShortcutLabel(getShortcutLabel());
  }, []);

  useEffect(() => {
    if (!enableShortcut) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (!isCommandSearchShortcut(event)) {
        return;
      }

      event.preventDefault();
      setIsOpen((current) => !current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableShortcut]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusInput = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(focusInput);
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [activeType, search]);

  useEffect(() => {
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  useEffect(() => {
    if (typeOptions.some((option) => option.value === activeType)) {
      return;
    }

    setActiveType(activeAllType);
  }, [activeAllType, activeType, typeOptions]);

  const moveHighlight = useCallback(
    (direction: -1 | 1): void => {
      setHighlightedIndex((currentIndex) =>
        moveCommandPaletteIndex({
          currentIndex,
          direction,
          itemCount: filteredItems.length,
        }),
      );
    },
    [filteredItems.length],
  );

  const handlePanelKeyDown = (event: ReactKeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveHighlight(1);
      return;
    }

    if (event.key === 'Tab') {
      if (!completedType) {
        return;
      }

      event.preventDefault();
      setActiveType(completedType.value);
      setCompletedTypeFlash(completedType.value);
      setSearch('');
      window.setTimeout(() => setCompletedTypeFlash(null), 500);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveHighlight(-1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      selectItem(filteredItems[highlightedIndex] ?? filteredItems[0]);
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isBottomNavTrigger = triggerVariant === 'bottom-nav';
  const trigger = (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        'w-full',
        isBottomNavTrigger
          ? 'text-muted-foreground hover:text-foreground mx-1 my-1 h-auto min-w-0 flex-1 flex-col gap-1 rounded-xl px-2 py-2 text-[11px] font-medium'
          : 'border-sidebar-border bg-background/70 text-sidebar-foreground/75 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-sidebar-accent hover:text-sidebar-primary dark:text-sidebar-foreground/90 dark:hover:text-white border',
        !isBottomNavTrigger &&
          (isCollapsed && !isMobile
            ? 'size-8 px-0'
            : 'h-8 w-full justify-start gap-2 rounded-md px-2.5'),
      )}
      onClick={() => setIsOpen(true)}
    >
      <Search className={cn('shrink-0', isBottomNavTrigger ? 'size-5' : 'size-4')} />
      {isBottomNavTrigger ? <span className="max-w-full truncate">{triggerLabel}</span> : null}
      {(isCollapsed && !isMobile) || isBottomNavTrigger ? null : (
        <>
          <span className="min-w-0 flex-1 truncate text-left text-sm">{triggerLabel}</span>
          <span className="inline-flex items-center gap-1">
            <ShortcutModifierKeycap
              modifierLabel={shortcutLabel}
              className={cn(keycapClassName, 'border-sidebar-border bg-background/70')}
            />
            <KeyboardKeycap
              className={cn(keycapClassName, 'border-sidebar-border bg-background/70')}
            >
              K
            </KeyboardKeycap>
          </span>
        </>
      )}
    </Button>
  );

  return (
    <>
      {isCollapsed && !isMobile ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side="right">{triggerTooltip}</TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}
      <CommandPaletteSurface
        activeType={activeType}
        completedSearchLabel={completedSearchLabel}
        completedType={completedType?.value ?? null}
        completedTypeFlash={completedTypeFlash}
        description={description}
        filteredItems={filteredItems}
        getItemImageUrl={getItemImageUrl}
        getItemKey={getItemKey}
        getItemLabel={getItemLabel}
        getItemMeta={getItemMeta}
        highlightedIndex={highlightedIndex}
        inputRef={inputRef}
        isLoading={isLoading}
        isMobile={isMobileViewport}
        isOpen={isOpen}
        itemRefs={itemRefs}
        loadingLabel={loadingLabel}
        noResultsLabel={noResultsLabel}
        onKeyDown={handlePanelKeyDown}
        onOpenChange={setIsOpen}
        onSelect={selectItem}
        placeholder={placeholder}
        search={search}
        setActiveType={setActiveType}
        setHighlightedIndex={setHighlightedIndex}
        setSearch={setSearch}
        title={title}
        typeOptions={typeOptions}
      />
    </>
  );
}

interface CommandPaletteSurfaceProps<TItem, TType extends string> {
  readonly activeType: TType;
  readonly completedSearchLabel: ReactNode | null;
  readonly completedType: TType | null;
  readonly completedTypeFlash: TType | null;
  readonly description: string;
  readonly filteredItems: readonly TItem[];
  readonly getItemImageUrl?: (item: TItem) => string | null | undefined;
  readonly getItemKey: (item: TItem) => string;
  readonly getItemLabel: (item: TItem) => ReactNode;
  readonly getItemMeta?: (item: TItem) => CommandPaletteItemMeta;
  readonly highlightedIndex: number;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly isLoading: boolean;
  readonly isMobile: boolean;
  readonly isOpen: boolean;
  readonly itemRefs: RefObject<(HTMLButtonElement | null)[]>;
  readonly loadingLabel: string;
  readonly noResultsLabel: string;
  readonly onKeyDown: (event: ReactKeyboardEvent) => void;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSelect: (item: TItem) => void;
  readonly placeholder: string;
  readonly search: string;
  readonly setActiveType: (type: TType) => void;
  readonly setHighlightedIndex: (index: number) => void;
  readonly setSearch: (search: string) => void;
  readonly title: string;
  readonly typeOptions: readonly CommandPaletteTypeOption<TType>[];
}

function CommandPaletteSurface<TItem, TType extends string>({
  isMobile,
  isOpen,
  onOpenChange,
  title,
  description,
  ...contentProps
}: CommandPaletteSurfaceProps<TItem, TType>): React.ReactElement {
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[80vh] px-0 pb-[calc(env(safe-area-inset-bottom)+16px)] md:hidden">
          <DrawerHeader className="px-3 pb-3 text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className="sr-only">{description}</DrawerDescription>
          </DrawerHeader>
          <CommandPaletteContent {...contentProps} title={title} />
        </DrawerContent>
      </Drawer>
    );
  }

  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 z-50 hidden items-start justify-center bg-black/40 px-4 pt-[10vh] md:flex">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close search"
        onClick={() => onOpenChange(false)}
      />
      <div className="bg-background relative h-[min(640px,calc(100vh-4rem))] w-full max-w-2xl overflow-hidden rounded-lg border shadow-xl">
        <h2 className="sr-only">{title}</h2>
        <p className="sr-only">{description}</p>
        <CommandPaletteContent {...contentProps} title={title} />
      </div>
    </div>
  );
}

function CommandPaletteContent<TItem, TType extends string>({
  activeType,
  completedSearchLabel,
  completedType,
  completedTypeFlash,
  filteredItems,
  getItemImageUrl,
  getItemKey,
  getItemLabel,
  getItemMeta,
  highlightedIndex,
  inputRef,
  isLoading,
  itemRefs,
  loadingLabel,
  noResultsLabel,
  onKeyDown,
  onSelect,
  placeholder,
  search,
  setActiveType,
  setHighlightedIndex,
  setSearch,
  typeOptions,
}: Omit<CommandPaletteSurfaceProps<TItem, TType>, 'description' | 'isMobile' | 'isOpen' | 'onOpenChange'>): React.ReactElement {
  const typeScrollerRef = useRef<HTMLDivElement | null>(null);
  const typeScrollerDragRef = useRef({
    hasDragged: false,
    isDragging: false,
    scrollLeft: 0,
    startX: 0,
  });
  const hasSearchCompletion = Boolean(completedType && completedSearchLabel);
  const completionText = typeof completedSearchLabel === 'string' ? completedSearchLabel : '';

  const handleTypeScrollerPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!typeScrollerRef.current) {
      return;
    }

    typeScrollerDragRef.current = {
      hasDragged: false,
      isDragging: true,
      scrollLeft: typeScrollerRef.current.scrollLeft,
      startX: event.clientX,
    };
  };

  const handleTypeScrollerPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const dragState = typeScrollerDragRef.current;
    const scroller = typeScrollerRef.current;

    if (!dragState.isDragging || !scroller) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (Math.abs(deltaX) > 8) {
      dragState.hasDragged = true;
    }

    scroller.scrollLeft = dragState.scrollLeft - deltaX;
  };

  const stopTypeScrollerDrag = (): void => {
    typeScrollerDragRef.current.isDragging = false;
  };

  const handleTypeScrollerClickCapture = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (typeScrollerDragRef.current.hasDragged) {
      event.preventDefault();
      event.stopPropagation();
      typeScrollerDragRef.current.hasDragged = false;
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden" onKeyDownCapture={onKeyDown}>
      <div className="border-border flex items-center gap-2 border-b px-3 py-3">
        <Search className="text-muted-foreground size-4 shrink-0" />
        <div className="relative min-w-0 flex-1">
          {hasSearchCompletion && completionText ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex max-w-full items-center overflow-hidden pr-16 text-base md:text-sm">
              <span className="text-foreground truncate">{search}</span>
              <span className="text-primary font-semibold">
                {completionText.slice(search.length)}
              </span>
            </div>
          ) : null}
          <Input
            ref={inputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            className={cn(
              'h-9 border-0 px-0 pr-14 text-base shadow-none focus-visible:ring-0 md:text-sm',
              hasSearchCompletion && completionText && 'text-transparent caret-foreground',
            )}
          />
          {hasSearchCompletion ? (
            <div className="animate-in fade-in zoom-in-95 pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 duration-150">
              <KeyboardKeycap className={keycapClassName}>Tab</KeyboardKeycap>
            </div>
          ) : null}
        </div>
      </div>
      {typeOptions.length > 1 ? (
        <div
          ref={typeScrollerRef}
          className="border-border flex h-12 items-center gap-1 overflow-x-auto overflow-y-hidden border-b px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerDown={handleTypeScrollerPointerDown}
          onPointerLeave={stopTypeScrollerDrag}
          onPointerMove={handleTypeScrollerPointerMove}
          onPointerUp={stopTypeScrollerDrag}
          onClickCapture={handleTypeScrollerClickCapture}
        >
          {typeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={activeType === option.value ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'shrink-0',
                completedTypeFlash === option.value &&
                  'ring-ring/40 bg-secondary ring-2 ring-offset-1 transition-shadow',
              )}
              onClick={() => setActiveType(option.value)}
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-muted-foreground flex h-36 items-center justify-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            {loadingLabel}
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-muted-foreground px-2 py-10 text-center text-sm">
            {noResultsLabel}
          </p>
        ) : (
          filteredItems.map((item, index) => (
            <CommandPaletteRow
              getItemImageUrl={getItemImageUrl}
              getItemKey={getItemKey}
              getItemLabel={getItemLabel}
              getItemMeta={getItemMeta}
              index={index}
              isHighlighted={highlightedIndex === index}
              item={item}
              itemRefs={itemRefs}
              key={getItemKey(item)}
              onSelect={onSelect}
              setHighlightedIndex={setHighlightedIndex}
            />
          ))
        )}
      </div>
      <div className="border-border text-muted-foreground hidden items-center gap-3 border-t px-3 py-2 text-xs md:flex">
        <span className="inline-flex items-center gap-1">
          <KeyboardKeycap className={keycapClassName}>↑</KeyboardKeycap>
          <KeyboardKeycap className={keycapClassName}>↓</KeyboardKeycap>
          <span>per navigare</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <KeyboardKeycap className={keycapClassName}>
            <CornerDownLeft className="size-3" />
          </KeyboardKeycap>
          per aprire
        </span>
        <span className="inline-flex items-center gap-1">
          <KeyboardKeycap className={keycapClassName}>Esc</KeyboardKeycap>
          <span>per chiudere</span>
        </span>
      </div>
    </div>
  );
}

function CommandPaletteRow<TItem>({
  getItemImageUrl,
  getItemLabel,
  getItemMeta,
  index,
  isHighlighted,
  item,
  itemRefs,
  onSelect,
  setHighlightedIndex,
}: {
  readonly getItemImageUrl?: (item: TItem) => string | null | undefined;
  readonly getItemKey: (item: TItem) => string;
  readonly getItemLabel: (item: TItem) => ReactNode;
  readonly getItemMeta?: (item: TItem) => CommandPaletteItemMeta;
  readonly index: number;
  readonly isHighlighted: boolean;
  readonly item: TItem;
  readonly itemRefs: RefObject<(HTMLButtonElement | null)[]>;
  readonly onSelect: (item: TItem) => void;
  readonly setHighlightedIndex: (index: number) => void;
}): React.ReactElement {
  const meta = getItemMeta?.(item);
  const Icon = meta?.icon;
  const imageUrl = getItemImageUrl?.(item);
  const fallbackIconStyle = getCommandPaletteFallbackIconStyle(meta?.iconColor);

  return (
    <button
      ref={(node) => {
        itemRefs.current[index] = node;
      }}
      type="button"
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors',
        isHighlighted ? 'bg-muted text-foreground' : 'hover:bg-muted/60',
      )}
      onClick={() => onSelect(item)}
      onMouseEnter={() => setHighlightedIndex(index)}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="bg-muted h-11 w-11 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span
          className="bg-muted grid h-11 w-11 shrink-0 place-items-center rounded-md"
          style={fallbackIconStyle}
        >
          {Icon ? (
            <Icon
              className={cn(
                'size-5',
                fallbackIconStyle ? 'text-current' : 'text-muted-foreground',
              )}
            />
          ) : null}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="text-foreground block truncate text-sm font-medium">
          {getItemLabel(item)}
        </span>
        {meta ? (
          <span className="mt-1 flex">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                meta.className,
              )}
            >
              {Icon ? <Icon className="size-2.5" /> : null}
              {meta.label}
            </span>
          </span>
        ) : null}
      </span>
    </button>
  );
}
