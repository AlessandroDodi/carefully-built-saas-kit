'use client';

import { RotateCcw } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { ReactNode } from 'react';

import { Button, cn, useKitTexts } from '@carefully-built/ui';

import {
  buildStrokePath,
  computeExportLayout,
  fitSignatureBox,
  isFarEnough,
  isSignatureEmpty,
  signatureToSvg,
} from './geometry';
import { signatureTexts } from './signature-texts';

import type {
  SignatureExportOptions,
  SignatureGeometry,
  SignaturePoint,
  SignatureStroke,
  SignatureTransform,
} from './geometry';

export interface SignaturePadChange {
  readonly isEmpty: boolean;
  readonly strokeCount: number;
}

export interface SignaturePadHandle {
  /** Remove every stroke. */
  clear: () => void;
  /** Remove the last stroke. */
  undo: () => void;
  isEmpty: () => boolean;
  /** PNG as a data URL. Opaque white background unless `backgroundColor` says otherwise. */
  toDataURL: (options?: SignatureExportOptions) => string;
  /** PNG as a Blob; null when the browser cannot encode it. */
  toBlob: (options?: SignatureExportOptions) => Promise<Blob | null>;
  /** Standalone SVG document. No background unless `backgroundColor` is given. */
  toSVG: (options?: SignatureExportOptions) => string;
}

export interface SignaturePadClassNames {
  readonly root?: string;
  readonly canvas?: string;
  readonly clearButton?: string;
  /** Wrapper of the baseline and the caption. */
  readonly guide?: string;
  readonly baseline?: string;
  readonly caption?: string;
}

export interface SignaturePadLabels {
  readonly clear?: string;
  /** Accessible name of the drawing area. */
  readonly canvasLabel?: string;
}

export interface SignaturePadProps {
  /** Called after every stroke, undo and clear. */
  readonly onChange?: (change: SignaturePadChange) => void;
  /** A stroke started. */
  readonly onBegin?: () => void;
  /** A stroke ended. */
  readonly onEnd?: () => void;
  readonly disabled?: boolean;
  /** Ink colour on screen. Defaults to the text colour of the pad (`text-foreground`). */
  readonly penColor?: string;
  /** Stroke width in CSS pixels. Constant along the stroke. Defaults to 2.5. */
  readonly strokeWidth?: number;
  /** Text under the baseline, e.g. the signer's name. */
  readonly caption?: ReactNode;
  readonly showBaseline?: boolean;
  readonly showClearButton?: boolean;
  readonly labels?: SignaturePadLabels;
  readonly className?: string;
  readonly classes?: SignaturePadClassNames;
}

const MIN_POINT_DISTANCE = 0.75;
const EXPORT_PEN_COLOR = '#000000';

interface PadSize {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
}

function drawStroke(
  context: CanvasRenderingContext2D,
  points: SignatureStroke,
  lineWidth: number,
): void {
  const first = points[0];
  if (!first) return;

  if (points.length === 1) {
    context.beginPath();
    context.arc(first.x, first.y, lineWidth / 2, 0, Math.PI * 2);
    context.fill();
    return;
  }

  context.beginPath();
  for (const command of buildStrokePath(points)) {
    if (command.type === 'M') context.moveTo(command.x, command.y);
    else if (command.type === 'L') context.lineTo(command.x, command.y);
    else context.quadraticCurveTo(command.cx, command.cy, command.x, command.y);
  }
  context.stroke();
}

/** Draws every stroke with a transform from signature coordinates to canvas pixels. */
function drawSignature(
  context: CanvasRenderingContext2D,
  strokes: readonly SignatureStroke[],
  transform: SignatureTransform,
  strokeWidth: number,
  color: string,
): void {
  context.setTransform(transform.scale, 0, 0, transform.scale, transform.offsetX, transform.offsetY);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = strokeWidth;
  context.strokeStyle = color;
  context.fillStyle = color;
  for (const stroke of strokes) drawStroke(context, stroke, strokeWidth);
}

/**
 * A canvas to sign on with a finger, a stylus or a mouse.
 *
 * Privacy: only the x/y position of the pointer is read and kept. Pressure,
 * tilt, speed and per-point timestamps are never read, stored or exported,
 * so what comes out is a drawing of the signature and not a recording of how
 * it was made.
 */
export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad(
  {
    onChange,
    onBegin,
    onEnd,
    disabled = false,
    penColor,
    strokeWidth = 2.5,
    caption,
    showBaseline = true,
    showClearButton = true,
    labels,
    className,
    classes,
  },
  forwardedRef,
): React.ReactElement {
  const texts = useKitTexts(signatureTexts, {
    clear: labels?.clear,
    canvasLabel: labels?.canvasLabel,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<SignaturePoint[][]>([]);
  // The pad size when the first stroke began: the box the points are relative to.
  const referenceRef = useRef<{ width: number; height: number } | null>(null);
  const sizeRef = useRef<PadSize>({ width: 0, height: 0, pixelRatio: 1 });
  const activePointerRef = useRef<number | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const latest = useRef({ onChange, onBegin, onEnd, penColor, strokeWidth, disabled });
  latest.current = { onChange, onBegin, onEnd, penColor, strokeWidth, disabled };

  /** From signature coordinates to CSS pixels of the pad at its current size. */
  const getViewTransform = useCallback((): SignatureTransform => {
    const reference = referenceRef.current;
    const size = sizeRef.current;
    if (!reference || size.width === 0 || size.height === 0) {
      return { scale: 1, offsetX: 0, offsetY: 0 };
    }
    return fitSignatureBox(
      { x: 0, y: 0, width: reference.width, height: reference.height },
      size.width,
      size.height,
    );
  }, []);

  /** A drawing context set up for signature coordinates, or null before layout. */
  const prepareContext = useCallback((): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return null;

    const view = getViewTransform();
    const ratio = sizeRef.current.pixelRatio;
    const color = latest.current.penColor ?? getComputedStyle(canvas).color;
    context.setTransform(
      view.scale * ratio,
      0,
      0,
      view.scale * ratio,
      view.offsetX * ratio,
      view.offsetY * ratio,
    );
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = latest.current.strokeWidth;
    context.strokeStyle = color;
    context.fillStyle = color;
    return context;
  }, [getViewTransform]);

  const redraw = useCallback((): void => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!prepareContext()) return;
    for (const stroke of strokesRef.current) drawStroke(context, stroke, latest.current.strokeWidth);
  }, [prepareContext]);

  const notifyChange = useCallback((): void => {
    const strokes = strokesRef.current;
    const empty = isSignatureEmpty(strokes);
    if (empty) referenceRef.current = null;
    setIsEmpty(empty);
    latest.current.onChange?.({ isEmpty: empty, strokeCount: strokes.length });
  }, []);

  const clear = useCallback((): void => {
    activePointerRef.current = null;
    if (strokesRef.current.length === 0) return;
    strokesRef.current = [];
    redraw();
    notifyChange();
  }, [notifyChange, redraw]);

  const undo = useCallback((): void => {
    activePointerRef.current = null;
    if (strokesRef.current.length === 0) return;
    strokesRef.current = strokesRef.current.slice(0, -1);
    redraw();
    notifyChange();
  }, [notifyChange, redraw]);

  const getGeometry = useCallback((): SignatureGeometry => {
    const reference = referenceRef.current ?? sizeRef.current;
    return { width: reference.width, height: reference.height, strokes: strokesRef.current };
  }, []);

  const renderToCanvas = useCallback(
    (options: SignatureExportOptions = {}): HTMLCanvasElement => {
      const geometry = getGeometry();
      const width = latest.current.strokeWidth;
      const layout = computeExportLayout(geometry, width, options);
      const canvas = document.createElement('canvas');
      canvas.width = layout.width;
      canvas.height = layout.height;

      const context = canvas.getContext('2d');
      if (!context) return canvas;

      const background = options.backgroundColor === undefined ? '#ffffff' : options.backgroundColor;
      if (background) {
        context.fillStyle = background;
        context.fillRect(0, 0, layout.width, layout.height);
      }
      drawSignature(
        context,
        geometry.strokes,
        layout,
        width,
        options.penColor ?? latest.current.penColor ?? EXPORT_PEN_COLOR,
      );
      return canvas;
    },
    [getGeometry],
  );

  useImperativeHandle(
    forwardedRef,
    () => ({
      clear,
      undo,
      isEmpty: () => isSignatureEmpty(strokesRef.current),
      toDataURL: (options) => renderToCanvas(options).toDataURL('image/png'),
      toBlob: (options) =>
        new Promise<Blob | null>((resolve) => {
          renderToCanvas(options).toBlob(resolve, 'image/png');
        }),
      toSVG: (options) =>
        signatureToSvg(getGeometry(), latest.current.strokeWidth, {
          ...options,
          penColor: options?.penColor ?? latest.current.penColor ?? EXPORT_PEN_COLOR,
        }),
    }),
    [clear, undo, renderToCanvas, getGeometry],
  );

  // Keep the canvas bitmap in step with its CSS size and the screen density,
  // then draw the strokes again from the stored geometry.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = (): void => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      const pixelRatio = window.devicePixelRatio || 1;
      const previous = sizeRef.current;
      if (previous.width === width && previous.height === height && previous.pixelRatio === pixelRatio) {
        return;
      }

      sizeRef.current = { width, height, pixelRatio };
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      redraw();
    };

    resize();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(canvas);
    // Zooming or moving to another screen changes the density, not the CSS size.
    window.addEventListener('resize', resize);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [redraw]);

  // A new colour or width applies to the whole signature.
  useEffect(() => {
    redraw();
  }, [penColor, strokeWidth, redraw]);

  /** Pointer position in signature coordinates. Only clientX/clientY are read. */
  function toPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): SignaturePoint {
    const rect = canvas.getBoundingClientRect();
    const view = getViewTransform();
    return {
      x: (clientX - rect.left - view.offsetX) / view.scale,
      y: (clientY - rect.top - view.offsetY) / view.scale,
    };
  }

  /** Adds a point to the stroke in progress and draws the piece of curve it completes. */
  function extendStroke(point: SignaturePoint): void {
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    if (!stroke) return;

    const scale = getViewTransform().scale;
    const previous = stroke[stroke.length - 1];
    if (!isFarEnough(previous, point, MIN_POINT_DISTANCE / scale)) return;

    stroke.push(point);
    const context = prepareContext();
    if (!context || !previous) return;

    // The ink follows half a segment behind the pointer: each new point fixes
    // the curve up to the midpoint before it, so nothing is ever redrawn.
    const beforePrevious = stroke[stroke.length - 3];
    const end = { x: (previous.x + point.x) / 2, y: (previous.y + point.y) / 2 };
    context.beginPath();
    if (beforePrevious) {
      context.moveTo((beforePrevious.x + previous.x) / 2, (beforePrevious.y + previous.y) / 2);
      context.quadraticCurveTo(previous.x, previous.y, end.x, end.y);
    } else {
      context.moveTo(previous.x, previous.y);
      context.lineTo(end.x, end.y);
    }
    context.stroke();
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>): void {
    if (latest.current.disabled || activePointerRef.current !== null) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const canvas = event.currentTarget;
    const size = sizeRef.current;
    if (size.width === 0 || size.height === 0) return;

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    activePointerRef.current = event.pointerId;
    referenceRef.current ??= { width: size.width, height: size.height };

    const point = toPoint(canvas, event.clientX, event.clientY);
    strokesRef.current.push([point]);
    const context = prepareContext();
    if (context) drawStroke(context, [point], latest.current.strokeWidth);

    setIsEmpty(false);
    latest.current.onBegin?.();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>): void {
    if (activePointerRef.current !== event.pointerId) return;

    const canvas = event.currentTarget;
    // Browsers merge fast movements into one event; the pieces give a smoother line.
    const native = event.nativeEvent;
    const samples =
      typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [];
    if (samples.length === 0) {
      extendStroke(toPoint(canvas, event.clientX, event.clientY));
      return;
    }
    for (const sample of samples) {
      extendStroke(toPoint(canvas, sample.clientX, sample.clientY));
    }
  }

  function finishStroke(event: React.PointerEvent<HTMLCanvasElement>): void {
    if (activePointerRef.current !== event.pointerId) return;

    activePointerRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // Draws the last half segment and evens out the joins.
    redraw();
    latest.current.onEnd?.();
    notifyChange();
  }

  const hasGuide = showBaseline || (caption !== undefined && caption !== null && caption !== false);

  return (
    <div
      data-slot="signature-pad"
      data-empty={isEmpty ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'border-border bg-background text-foreground relative h-full min-h-40 w-full overflow-hidden rounded-md border border-dashed',
        disabled && 'opacity-60',
        className,
        classes?.root,
      )}
    >
      {hasGuide ? (
        <div
          aria-hidden={caption ? undefined : true}
          className={cn('pointer-events-none absolute inset-x-6 bottom-4 select-none', classes?.guide)}
        >
          {showBaseline ? (
            <div className={cn('border-foreground/25 border-t', classes?.baseline)} />
          ) : null}
          {caption ? (
            <div className={cn('text-muted-foreground mt-1.5 truncate text-xs', classes?.caption)}>
              {caption}
            </div>
          ) : null}
        </div>
      ) : null}

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={texts.canvasLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishStroke}
        onPointerCancel={finishStroke}
        // Capture can be lost without an up or cancel; the stroke must still end.
        onLostPointerCapture={finishStroke}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
        // Without this the browser scrolls or zooms instead of drawing.
        style={{ touchAction: 'none' }}
        className={cn(
          'absolute inset-0 block size-full select-none',
          disabled ? 'cursor-not-allowed' : 'cursor-crosshair',
          classes?.canvas,
        )}
      />

      {showClearButton ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isEmpty}
          onClick={clear}
          className={cn('absolute top-2 right-2', classes?.clearButton)}
        >
          <RotateCcw aria-hidden="true" />
          {texts.clear}
        </Button>
      ) : null}
    </div>
  );
});
