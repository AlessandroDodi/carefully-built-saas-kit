'use client';

import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ReactNode } from 'react';

import {
  filterDeviceCodeCharacters,
  getDeviceCodeInputMode,
  normalizeDeviceCode,
  pasteDeviceCode,
  resolveDeviceCodeGroups,
} from './device-code-input.utils';
import { defineKitTexts, useKitTexts } from '../locale/kit-texts';
import { cn } from '../utils/cn';

import type { DeviceCodeCharset, DeviceCodeSelection } from './device-code-input.utils';

const deviceCodeInputTexts = defineKitTexts({
  en: { label: 'Code' },
  it: { label: 'Codice' },
});

// Layout effects warn during server rendering on React 18.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export interface DeviceCodeInputClassNames {
  readonly root?: string;
  readonly group?: string;
  readonly cell?: string;
  /** Added to the cell that receives the next character. */
  readonly activeCell?: string;
  readonly separator?: string;
  readonly caret?: string;
  /** The real, transparent input laid over the cells. */
  readonly input?: string;
}

export interface DeviceCodeInputProps {
  /** Number of characters. Ignored when `groups` is given: the groups add up to the length. */
  readonly length?: number;
  /** Visual grouping, e.g. `[3, 3]` renders `XXX-XXX`. */
  readonly groups?: readonly number[];
  /** Controlled value, without separators. Omit it to let the component keep its own state. */
  readonly value?: string;
  readonly defaultValue?: string;
  /** Receives the normalized code: allowed characters only, no separators. */
  readonly onChange?: (value: string) => void;
  /** Called when the last character is filled in. */
  readonly onComplete?: (value: string) => void;
  readonly charset?: DeviceCodeCharset;
  /** Upper-case letters as they are typed. Defaults to true. */
  readonly uppercase?: boolean;
  /** Show dots instead of the characters, for PINs. */
  readonly mask?: boolean;
  /** Shown between groups. Defaults to a dash. */
  readonly separator?: ReactNode;
  readonly autoFocus?: boolean;
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly id?: string;
  readonly name?: string;
  /** Defaults to `one-time-code` so the browser can offer a received code. */
  readonly autoComplete?: string;
  readonly 'aria-label'?: string;
  readonly 'aria-describedby'?: string;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly className?: string;
  readonly classes?: DeviceCodeInputClassNames;
}

/** Puts the caret on a cell: a filled cell is selected, so typing replaces it. */
function selectCell(input: HTMLInputElement, index: number): void {
  const length = input.value.length;
  const start = Math.max(0, Math.min(index, length));
  input.setSelectionRange(start, start < length ? start + 1 : start);
}

/**
 * Segmented input for device codes, one-time codes and PINs.
 *
 * One real `<input>` sits transparently over the cells, which is what keeps
 * on-screen keyboards, paste and code autofill working the way they do in a
 * plain text field; the cells only draw its value.
 */
export const DeviceCodeInput = forwardRef<HTMLInputElement, DeviceCodeInputProps>(
  function DeviceCodeInput(
    {
      length: lengthProp = 6,
      groups,
      value: valueProp,
      defaultValue,
      onChange,
      onComplete,
      charset = 'alphanumeric',
      uppercase = true,
      mask = false,
      separator = '-',
      autoFocus = false,
      disabled = false,
      error = false,
      id,
      name,
      autoComplete = 'one-time-code',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      onFocus,
      onBlur,
      className,
      classes,
    },
    forwardedRef,
  ): React.ReactElement {
    const texts = useKitTexts(deviceCodeInputTexts, { label: ariaLabel });
    // Keyed by content, so an inline `groups={[3, 3]}` does not rebuild the cells on every render.
    const groupsKey = groups ? groups.join(',') : '';
    const groupSizes = useMemo(
      () => resolveDeviceCodeGroups(lengthProp, groupsKey ? groupsKey.split(',').map(Number) : undefined),
      [lengthProp, groupsKey],
    );
    const length = groupSizes.reduce((total, size) => total + size, 0);
    const format = useMemo(() => ({ length, charset, uppercase }), [length, charset, uppercase]);

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const value = normalizeDeviceCode(isControlled ? valueProp : internalValue, format);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement, []);

    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
    const composingRef = useRef(false);
    const [focused, setFocused] = useState(false);
    const [selection, setSelection] = useState<DeviceCodeSelection>({
      start: value.length,
      end: value.length,
    });
    // Bumped after a controlled change so the input is put back in line with
    // the prop even when the parent ignores the change.
    const [, setRevision] = useState(0);

    // The latest props, for handlers that outlive a render.
    const latest = useRef({ value, format, onChange, onComplete, isControlled });
    latest.current = { value, format, onChange, onComplete, isControlled };

    const commit = useCallback((next: string): void => {
      const current = latest.current;
      if (next === current.value) return;

      latest.current = { ...current, value: next };
      if (current.isControlled) {
        setRevision((revision) => revision + 1);
      } else {
        setInternalValue(next);
      }
      current.onChange?.(next);
      if (next.length === current.format.length) current.onComplete?.(next);
    }, []);

    /** Mirrors the input's selection into state, which is what the cells draw. */
    const syncSelection = useCallback((): void => {
      const input = inputRef.current;
      if (!input || document.activeElement !== input) return;

      const { charset: activeCharset, uppercase: activeUppercase } = latest.current.format;
      const rawStart = input.selectionStart ?? input.value.length;
      let start = rawStart;
      let end = input.selectionEnd ?? rawStart;

      if (composingRef.current) {
        // The keyboard owns the text while composing: only follow the caret.
        start = filterDeviceCodeCharacters(input.value.slice(0, rawStart), activeCharset, activeUppercase).length;
        end = start;
      } else if (start === end && start < input.value.length) {
        end = start + 1;
        input.setSelectionRange(start, end);
      }

      setSelection((previous) =>
        previous.start === start && previous.end === end ? previous : { start, end },
      );
    }, []);

    // Bring the input in line with the value when it changed from outside.
    useIsomorphicLayoutEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      const shown = composingRef.current ? normalizeDeviceCode(input.value, format) : input.value;
      if (shown === value) return;

      input.value = value;
      if (document.activeElement === input) {
        selectCell(input, value.length);
        syncSelection();
      }
    });

    useEffect(() => {
      document.addEventListener('selectionchange', syncSelection);
      return () => {
        document.removeEventListener('selectionchange', syncSelection);
      };
    }, [syncSelection]);

    // Backspace on a cell in the middle removes it and steps back, instead of
    // leaving the next character selected and deleting forwards on a repeat.
    // `beforeinput` is used because on-screen keyboards do not report key names.
    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      const handleBeforeInput = (event: InputEvent): void => {
        if (event.inputType !== 'deleteContentBackward' || !event.cancelable) return;
        if (event.isComposing || composingRef.current) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start === null || end === null) return;
        if (end - start !== 1 || start === 0 || end >= input.value.length) return;

        event.preventDefault();
        input.value = `${input.value.slice(0, start)}${input.value.slice(end)}`;
        selectCell(input, start - 1);
        commit(input.value);
        syncSelection();
      };

      input.addEventListener('beforeinput', handleBeforeInput);
      return () => {
        input.removeEventListener('beforeinput', handleBeforeInput);
      };
    }, [commit, syncSelection]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
      const input = event.currentTarget;
      const raw = input.value;
      const nativeEvent = event.nativeEvent as InputEvent;
      const composing = composingRef.current || nativeEvent.isComposing === true;

      // A whole code arriving at once (autofill, keyboard clipboard chip)
      // replaces what was there instead of being inserted at the caret.
      const inserted =
        typeof nativeEvent.data === 'string'
          ? filterDeviceCodeCharacters(nativeEvent.data, format.charset, format.uppercase)
          : '';
      const next =
        inserted.length >= length && length > 1
          ? inserted.slice(0, length)
          : normalizeDeviceCode(raw, format);

      // Rewriting the text mid-composition makes on-screen keyboards repeat
      // characters, so the input is cleaned up once composition ends.
      if (!composing && raw !== next) {
        const caret = filterDeviceCodeCharacters(
          raw.slice(0, input.selectionStart ?? raw.length),
          format.charset,
          format.uppercase,
        ).length;
        input.value = next;
        selectCell(input, inserted.length >= length ? next.length : caret);
      }

      commit(next);
      syncSelection();
    }

    function handleCompositionEnd(event: React.CompositionEvent<HTMLInputElement>): void {
      composingRef.current = false;
      const input = event.currentTarget;
      const next = normalizeDeviceCode(input.value, format);
      if (input.value !== next) {
        input.value = next;
        selectCell(input, next.length);
      }
      commit(next);
      syncSelection();
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
      if (composingRef.current || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const input = event.currentTarget;
      const start = input.selectionStart ?? input.value.length;
      const target =
        event.key === 'ArrowLeft'
          ? start - 1
          : event.key === 'ArrowRight'
            ? start + 1
            : event.key === 'Home' || event.key === 'ArrowUp'
              ? 0
              : event.key === 'End' || event.key === 'ArrowDown'
                ? input.value.length
                : null;
      if (target === null) return;

      event.preventDefault();
      selectCell(input, target);
      syncSelection();
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>): void {
      event.preventDefault();
      const input = event.currentTarget;
      const current = normalizeDeviceCode(input.value, format);
      const result = pasteDeviceCode(
        current,
        event.clipboardData.getData('text'),
        {
          start: input.selectionStart ?? current.length,
          end: input.selectionEnd ?? current.length,
        },
        format,
      );

      input.value = result.value;
      selectCell(input, result.caret);
      commit(result.value);
      syncSelection();
    }

    /** A tap lands on the invisible text, so the cell is found from where it happened. */
    function handleClick(event: React.MouseEvent<HTMLInputElement>): void {
      if (composingRef.current) return;

      const input = event.currentTarget;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cellRefs.current.slice(0, length).forEach((cell, index) => {
        if (!cell) return;
        const rect = cell.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });

      selectCell(input, nearest);
      syncSelection();
    }

    const activeStart = Math.min(selection.start, length - 1);
    const activeEnd = Math.max(Math.min(selection.end, length), activeStart + 1);
    let cellIndex = 0;

    return (
      <div
        data-slot="device-code-input"
        data-disabled={disabled ? '' : undefined}
        data-invalid={error ? '' : undefined}
        className={cn('relative inline-flex max-w-full items-center gap-2', className, classes?.root)}
      >
        {groupSizes.map((size, groupIndex) => {
          const cells = Array.from({ length: size }, () => {
            const index = cellIndex;
            cellIndex += 1;
            const character = value[index];
            const isActive = focused && !disabled && index >= activeStart && index < activeEnd;

            return (
              <div
                key={index}
                ref={(node) => {
                  cellRefs.current[index] = node;
                }}
                aria-hidden="true"
                data-active={isActive ? '' : undefined}
                data-filled={character ? '' : undefined}
                className={cn(
                  'border-input bg-background text-foreground flex h-14 w-12 shrink items-center justify-center rounded-md border font-mono text-2xl font-medium tabular-nums transition-colors',
                  error && 'border-destructive',
                  isActive && (error ? 'ring-destructive/20 ring-3' : 'border-ring ring-ring/50 ring-3'),
                  disabled && 'opacity-50',
                  classes?.cell,
                  isActive && classes?.activeCell,
                )}
              >
                {character ? (
                  mask ? (
                    '•'
                  ) : (
                    character
                  )
                ) : isActive && index === activeStart ? (
                  <span className={cn('bg-foreground h-6 w-px animate-pulse', classes?.caret)} />
                ) : null}
              </div>
            );
          });

          return (
            <Fragment key={groupIndex}>
              {groupIndex > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn('text-muted-foreground text-xl select-none', classes?.separator)}
                >
                  {separator}
                </span>
              ) : null}
              <div className={cn('flex min-w-0 items-center gap-1.5', classes?.group)}>{cells}</div>
            </Fragment>
          );
        })}

        <input
          ref={inputRef}
          id={id}
          name={name}
          type={mask ? 'password' : 'text'}
          defaultValue={value}
          inputMode={getDeviceCodeInputMode(charset)}
          pattern={charset === 'numeric' ? '[0-9]*' : '[A-Za-z0-9]*'}
          autoComplete={autoComplete}
          autoCapitalize={charset === 'alphanumeric' && uppercase ? 'characters' : 'none'}
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          autoFocus={autoFocus}
          disabled={disabled}
          aria-label={texts.label}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onClick={handleClick}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={handleCompositionEnd}
          onFocus={(event) => {
            setFocused(true);
            selectCell(event.currentTarget, event.currentTarget.value.length);
            syncSelection();
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          // 16px text keeps iOS from zooming in; the text itself is never seen.
          className={cn(
            'absolute inset-0 size-full cursor-text rounded-md border-0 bg-transparent p-0 text-base text-transparent caret-transparent outline-none selection:bg-transparent selection:text-transparent disabled:cursor-not-allowed',
            classes?.input,
          )}
        />
      </div>
    );
  },
);
