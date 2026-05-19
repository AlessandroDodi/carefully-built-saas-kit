'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { buildSearchText, rankBySearch } from '../utils/search';

import type { LucideIcon } from 'lucide-react';

import { Input } from '../primitives/input';
import { cn } from '../utils/cn';
import { resolveSearchableSelectDropdownPosition } from './searchable-select-position';

export const AUTO_SEARCHABLE_SELECT_THRESHOLD = 5;

export interface SearchableSelectOption {
  readonly value: string;
  readonly label: string;
  readonly searchText?: string;
}

export interface SearchableSelectProps<TOption extends SearchableSelectOption> {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly options: readonly TOption[];
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly triggerClassName?: string;
  readonly contentClassName?: string;
  readonly ariaLabel?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly leadingIcon?: LucideIcon;
  readonly searchThreshold?: number;
  readonly size?: 'sm' | 'default';
  readonly renderOption?: (option: TOption) => React.ReactNode;
  readonly renderValue?: (option: TOption) => React.ReactNode;
}

interface SearchableSelectBoundaryElement {
  contains(target: EventTarget | null): boolean;
}

interface SearchableSelectPortalAnchor {
  closest(selectors: string): Element | null;
}

const SEARCHABLE_SELECT_MODAL_CONTENT_SELECTOR =
  '[data-slot="sheet-content"], [data-slot="drawer-content"]';

function getSearchableSelectBoundaryRect(element: HTMLElement): DOMRect | undefined {
  return element.closest(SEARCHABLE_SELECT_MODAL_CONTENT_SELECTOR)?.getBoundingClientRect();
}

export function isSearchableSelectPointerInside(
  target: EventTarget | null,
  triggerContainer: SearchableSelectBoundaryElement | null,
  dropdownContent: SearchableSelectBoundaryElement | null,
): boolean {
  return Boolean(triggerContainer?.contains(target) || dropdownContent?.contains(target));
}

export function getSearchableSelectPortalContainer(
  trigger: SearchableSelectPortalAnchor | null,
): Element | null {
  return trigger?.closest(SEARCHABLE_SELECT_MODAL_CONTENT_SELECTOR) ?? null;
}

export function SearchableSelect<TOption extends SearchableSelectOption>({
  value,
  onValueChange,
  options,
  placeholder = 'Seleziona...',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  ariaLabel,
  searchPlaceholder = 'Cerca...',
  emptyMessage = 'Nessun risultato trovato',
  leadingIcon: LeadingIcon,
  searchThreshold = AUTO_SEARCHABLE_SELECT_THRESHOLD,
  size = 'default',
  renderOption,
  renderValue,
}: SearchableSelectProps<TOption>): React.ReactElement {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const selectedOption = options.find((option) => option.value === value);
  const showSearchInput = options.length > searchThreshold;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function closeOtherSearchableSelects(event: Event): void {
      if (event instanceof CustomEvent && event.detail !== selectId) {
        setIsOpen(false);
      }
    }

    window.addEventListener('searchable-select:open', closeOtherSearchableSelects);

    return () => {
      window.removeEventListener('searchable-select:open', closeOtherSearchableSelects);
    };
  }, [selectId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.dispatchEvent(new CustomEvent('searchable-select:open', { detail: selectId }));
  }, [isOpen, selectId]);

  useEffect(() => {
    if (!showSearchInput || !isOpen) {
      setSearch('');
      return;
    }

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [isOpen, showSearchInput]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent): void {
      if (isSearchableSelectPointerInside(event.target, containerRef.current, contentRef.current)) {
        return;
      }

      setIsOpen(false);
    }

    if (!isOpen) {
      return undefined;
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(
    () =>
      rankBySearch(options, search, (option) => buildSearchText(option.label, option.searchText)),
    [options, search],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const selectedIndex = filteredOptions.findIndex((option) => option.value === value);
    if (selectedIndex >= 0) {
      setHighlightedOptionIndex(selectedIndex);
      return;
    }

    setHighlightedOptionIndex(0);
  }, [filteredOptions, isOpen, value]);

  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, filteredOptions.length);

    if (filteredOptions.length === 0) {
      setHighlightedOptionIndex(0);
      return;
    }

    setHighlightedOptionIndex((currentValue) => Math.min(currentValue, filteredOptions.length - 1));
  }, [filteredOptions]);

  useEffect(() => {
    if (!isOpen || filteredOptions.length === 0) {
      return;
    }

    optionRefs.current[highlightedOptionIndex]?.scrollIntoView({ block: 'nearest' });
  }, [filteredOptions.length, highlightedOptionIndex, isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setDropdownPosition(null);
      setPortalContainer(null);
      return;
    }

    function updateDropdownPosition(): void {
      const trigger = triggerRef.current;
      const content = contentRef.current;

      if (!trigger || !content) {
        return;
      }

      const nextPortalContainer = getSearchableSelectPortalContainer(trigger);
      setPortalContainer(nextPortalContainer);

      const triggerRect = trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const nextPosition = resolveSearchableSelectDropdownPosition({
        triggerRect,
        boundaryRect: getSearchableSelectBoundaryRect(trigger),
        portalRect: nextPortalContainer?.getBoundingClientRect(),
        contentWidth: Math.max(triggerRect.width, contentRect.width, 250),
        contentHeight: contentRect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });

      setDropdownPosition((currentValue) => {
        if (
          currentValue?.top === nextPosition.top &&
          currentValue?.left === nextPosition.left &&
          currentValue?.width === nextPosition.width &&
          currentValue?.maxHeight === nextPosition.maxHeight
        ) {
          return currentValue;
        }

        return nextPosition;
      });
    }

    updateDropdownPosition();
    const animationFrameId = window.requestAnimationFrame(updateDropdownPosition);

    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [filteredOptions.length, isOpen, search, showSearchInput]);

  function selectHighlightedOption(): void {
    const highlightedOption = filteredOptions[highlightedOptionIndex];

    if (!highlightedOption) {
      return;
    }

    onValueChange(highlightedOption.value);
    setIsOpen(false);
  }

  function selectOption(value: string): void {
    onValueChange(value);
    setIsOpen(false);
  }

  function moveHighlightedOption(direction: 'up' | 'down'): void {
    if (filteredOptions.length === 0) {
      return;
    }

    setHighlightedOptionIndex((currentValue) => {
      if (direction === 'down') {
        return (currentValue + 1) % filteredOptions.length;
      }

      return (currentValue - 1 + filteredOptions.length) % filteredOptions.length;
    });
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className={cn(
          'border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex w-full items-center justify-between gap-1.5 rounded-lg border bg-transparent py-1 pr-2 pl-2 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3',
          size === 'sm' ? 'h-7 rounded-[min(var(--radius-md),10px)]' : 'h-8',
          triggerClassName,
        )}
      >
        {LeadingIcon ? (
          <LeadingIcon className="text-muted-foreground size-4 shrink-0" strokeWidth={1.8} />
        ) : null}
        <span className="min-w-0 flex-1 truncate text-left">
          {selectedOption ? (
            (renderValue?.(selectedOption) ?? selectedOption.label)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && isMounted
        ? createPortal(
            <div
              ref={contentRef}
              data-searchable-select-content=""
              className={cn(
                'bg-popover text-popover-foreground pointer-events-auto z-[60] min-w-0 rounded-xl border p-2 shadow-lg',
                portalContainer ? 'absolute' : 'fixed',
                contentClassName,
              )}
              style={{
                top: dropdownPosition?.top ?? 0,
                left: dropdownPosition?.left ?? 0,
                width: dropdownPosition?.width ?? triggerRef.current?.getBoundingClientRect().width,
                visibility: dropdownPosition ? 'visible' : 'hidden',
              }}
            >
              {showSearchInput ? (
                <div className="relative mb-2">
                  <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <Input
                    ref={searchInputRef}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        moveHighlightedOption('down');
                      }

                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        moveHighlightedOption('up');
                      }

                      if (event.key === 'Enter') {
                        event.preventDefault();
                        selectHighlightedOption();
                      }

                      if (event.key === 'Escape') {
                        event.preventDefault();
                        setIsOpen(false);
                      }
                    }}
                    placeholder={searchPlaceholder}
                    className="pl-9"
                  />
                </div>
              ) : null}

              <div
                className="space-y-1 overflow-y-auto"
                style={{
                  maxHeight: Math.min(256, dropdownPosition?.maxHeight ?? 256),
                }}
              >
                {filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      ref={(element) => {
                        optionRefs.current[index] = element;
                      }}
                      type="button"
                      className={cn(
                        'hover:bg-accent hover:text-accent-foreground flex h-auto w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                        isSelected && 'bg-muted/60',
                        highlightedOptionIndex === index && 'bg-accent text-accent-foreground',
                      )}
                      onMouseEnter={() => setHighlightedOptionIndex(index)}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        selectOption(option.value);
                      }}
                      onClick={(event) => {
                        if (event.detail === 0) {
                          selectOption(option.value);
                        }
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {renderOption?.(option) ?? option.label}
                      </span>
                      {isSelected ? <Check className="size-4 shrink-0" /> : null}
                    </button>
                  );
                })}

                {filteredOptions.length === 0 ? (
                  <p className="text-muted-foreground px-2 py-4 text-sm">{emptyMessage}</p>
                ) : null}
              </div>
            </div>,
            portalContainer ?? document.body,
          )
        : null}
    </div>
  );
}
