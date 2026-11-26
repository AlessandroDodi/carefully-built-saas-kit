/**
 * Pure signature geometry: no DOM, no React.
 *
 * A signature is a list of strokes, and a stroke is a list of x/y points.
 * That is all that is ever kept: no pressure, tilt, speed or timestamps, so
 * the data describes the shape of the signature and nothing about how the
 * hand moved while drawing it.
 */

export interface SignaturePoint {
  readonly x: number;
  readonly y: number;
}

export type SignatureStroke = readonly SignaturePoint[];

/**
 * Strokes in the coordinates of a reference box: the size the pad had when
 * the first stroke began. Drawing at any other size is a uniform scale of
 * this box, so a resize or a rotation never distorts the signature.
 */
export interface SignatureGeometry {
  readonly width: number;
  readonly height: number;
  readonly strokes: readonly SignatureStroke[];
}

export interface SignatureBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface SignatureTransform {
  readonly scale: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

export type SignaturePathCommand =
  | { readonly type: 'M'; readonly x: number; readonly y: number }
  | { readonly type: 'L'; readonly x: number; readonly y: number }
  | {
      readonly type: 'Q';
      readonly cx: number;
      readonly cy: number;
      readonly x: number;
      readonly y: number;
    };

export interface SignatureExportOptions {
  /** Output width in pixels. With only one of width/height the other follows the aspect ratio. */
  readonly width?: number;
  /** Output height in pixels. */
  readonly height?: number;
  /** Output pixels per pad pixel when neither width nor height is given. PNG defaults to 2, SVG to 1. */
  readonly pixelRatio?: number;
  /**
   * Fill behind the strokes. PNG defaults to opaque white, so the image has
   * no alpha channel; pass `null` for a transparent background. SVG defaults
   * to no background.
   */
  readonly backgroundColor?: string | null;
  /** Ink colour of the exported image. Defaults to the pad's `penColor` prop, or black. */
  readonly penColor?: string;
  /** Crop to the strokes instead of exporting the whole pad. */
  readonly trim?: boolean;
  /** Empty margin around the content, in output pixels. Defaults to 0. */
  readonly padding?: number;
}

export interface SignatureExportLayout extends SignatureTransform {
  readonly width: number;
  readonly height: number;
}

const FALLBACK_BOX: SignatureBox = { x: 0, y: 0, width: 300, height: 150 };

function midpoint(a: SignaturePoint, b: SignaturePoint): SignaturePoint {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** True when there is nothing drawn: no strokes, or only strokes without points. */
export function isSignatureEmpty(strokes: readonly SignatureStroke[]): boolean {
  return strokes.every((stroke) => stroke.length === 0);
}

/** Whether `next` is far enough from `last` to be worth keeping; drops jitter and duplicates. */
export function isFarEnough(
  last: SignaturePoint | undefined,
  next: SignaturePoint,
  minDistance: number,
): boolean {
  if (!last) return true;
  return Math.hypot(next.x - last.x, next.y - last.y) >= minDistance;
}

/**
 * The smoothed path of a stroke. Each recorded point becomes the control
 * point of a quadratic curve between the midpoints of its neighbours, which
 * rounds the corners a raw polyline would have. A single point is a dot, two
 * points a straight line.
 */
export function buildStrokePath(points: SignatureStroke): SignaturePathCommand[] {
  const first = points[0];
  if (!first) return [];

  const commands: SignaturePathCommand[] = [{ type: 'M', x: first.x, y: first.y }];
  const last = points[points.length - 1] ?? first;
  if (points.length === 1) {
    // A zero-length line with round caps draws a dot.
    commands.push({ type: 'L', x: first.x, y: first.y });
    return commands;
  }

  const second = points[1] ?? first;
  const firstMid = midpoint(first, second);
  commands.push({ type: 'L', x: firstMid.x, y: firstMid.y });

  for (let index = 1; index < points.length - 1; index += 1) {
    const control = points[index];
    const next = points[index + 1];
    if (!control || !next) continue;
    const mid = midpoint(control, next);
    commands.push({ type: 'Q', cx: control.x, cy: control.y, x: mid.x, y: mid.y });
  }

  commands.push({ type: 'L', x: last.x, y: last.y });
  return commands;
}

/**
 * The box that contains every stroke, grown by half the stroke width so the
 * ink itself is inside. Null when nothing is drawn.
 */
export function getSignatureBounds(
  strokes: readonly SignatureStroke[],
  strokeWidth = 0,
): SignatureBox | null {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const stroke of strokes) {
    for (const point of stroke) {
      if (point.x < minX) minX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.x > maxX) maxX = point.x;
      if (point.y > maxY) maxY = point.y;
    }
  }

  if (!Number.isFinite(minX)) return null;

  const half = Math.max(0, strokeWidth) / 2;
  return {
    x: minX - half,
    y: minY - half,
    width: maxX - minX + half * 2,
    height: maxY - minY + half * 2,
  };
}

/** The uniform scale and offsets that fit `source` centred inside a `width` x `height` area. */
export function fitSignatureBox(
  source: SignatureBox,
  width: number,
  height: number,
  padding = 0,
): SignatureTransform {
  const innerWidth = Math.max(1, width - padding * 2);
  const innerHeight = Math.max(1, height - padding * 2);
  const sourceWidth = Math.max(source.width, Number.EPSILON);
  const sourceHeight = Math.max(source.height, Number.EPSILON);
  const scale = Math.min(innerWidth / sourceWidth, innerHeight / sourceHeight);

  return {
    scale,
    offsetX: (width - source.width * scale) / 2 - source.x * scale,
    offsetY: (height - source.height * scale) / 2 - source.y * scale,
  };
}

/**
 * Size of an exported image and where the strokes go in it. Without `trim`
 * the whole pad is exported; with it, only the box around the strokes.
 */
export function computeExportLayout(
  geometry: SignatureGeometry,
  strokeWidth: number,
  options: SignatureExportOptions = {},
  defaultPixelRatio = 2,
): SignatureExportLayout {
  const padding = Math.max(0, options.padding ?? 0);
  const whole: SignatureBox =
    geometry.width > 0 && geometry.height > 0
      ? { x: 0, y: 0, width: geometry.width, height: geometry.height }
      : FALLBACK_BOX;
  const bounds = options.trim ? getSignatureBounds(geometry.strokes, strokeWidth) : null;
  const source: SignatureBox = bounds
    ? { ...bounds, width: Math.max(bounds.width, 1), height: Math.max(bounds.height, 1) }
    : whole;

  let width: number;
  let height: number;
  if (options.width !== undefined && options.height !== undefined) {
    width = options.width;
    height = options.height;
  } else if (options.width !== undefined) {
    width = options.width;
    const scale = Math.max(1, width - padding * 2) / source.width;
    height = source.height * scale + padding * 2;
  } else if (options.height !== undefined) {
    height = options.height;
    const scale = Math.max(1, height - padding * 2) / source.height;
    width = source.width * scale + padding * 2;
  } else {
    const ratio = options.pixelRatio !== undefined && options.pixelRatio > 0 ? options.pixelRatio : defaultPixelRatio;
    width = source.width * ratio + padding * 2;
    height = source.height * ratio + padding * 2;
  }

  width = Math.max(1, Math.round(width));
  height = Math.max(1, Math.round(height));

  return { width, height, ...fitSignatureBox(source, width, height, padding) };
}

function formatNumber(value: number, precision: number): string {
  const rounded = Number(value.toFixed(precision));
  // Avoid "-0" in the output.
  return String(rounded === 0 ? 0 : rounded);
}

/** SVG path data (`d`) for one stroke, optionally moved and scaled. */
export function strokeToSvgPath(
  points: SignatureStroke,
  transform: SignatureTransform = { scale: 1, offsetX: 0, offsetY: 0 },
  precision = 2,
): string {
  const tx = (value: number): string => formatNumber(value * transform.scale + transform.offsetX, precision);
  const ty = (value: number): string => formatNumber(value * transform.scale + transform.offsetY, precision);

  return buildStrokePath(points)
    .map((command) =>
      command.type === 'Q'
        ? `Q${tx(command.cx)} ${ty(command.cy)} ${tx(command.x)} ${ty(command.y)}`
        : `${command.type}${tx(command.x)} ${ty(command.y)}`,
    )
    .join('');
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/** A standalone SVG document of the signature. No background unless one is given. */
export function signatureToSvg(
  geometry: SignatureGeometry,
  strokeWidth: number,
  options: SignatureExportOptions = {},
): string {
  const layout = computeExportLayout(geometry, strokeWidth, options, 1);
  const penColor = escapeAttribute(options.penColor ?? '#000000');
  const lineWidth = formatNumber(strokeWidth * layout.scale, 2);
  const width = String(layout.width);
  const height = String(layout.height);

  const background = options.backgroundColor
    ? `<rect width="${width}" height="${height}" fill="${escapeAttribute(options.backgroundColor)}"/>`
    : '';
  const paths = geometry.strokes
    .filter((stroke) => stroke.length > 0)
    .map((stroke) => `<path d="${strokeToSvgPath(stroke, layout)}"/>`)
    .join('');

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    background +
    `<g fill="none" stroke="${penColor}" stroke-width="${lineWidth}" stroke-linecap="round" stroke-linejoin="round">` +
    paths +
    '</g></svg>'
  );
}
