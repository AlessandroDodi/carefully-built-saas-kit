import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  buildStrokePath,
  computeExportLayout,
  fitSignatureBox,
  getSignatureBounds,
  isFarEnough,
  isSignatureEmpty,
  signatureToSvg,
  strokeToSvgPath,
} from '../src/geometry';

import type { SignatureGeometry } from '../src/geometry';

const zigzag = [
  { x: 10, y: 10 },
  { x: 30, y: 50 },
  { x: 50, y: 10 },
  { x: 70, y: 50 },
];

const geometry: SignatureGeometry = {
  width: 400,
  height: 200,
  strokes: [zigzag, [{ x: 200, y: 100 }]],
};

describe('isSignatureEmpty', () => {
  test('no strokes is empty', () => {
    expect(isSignatureEmpty([])).toBe(true);
  });

  test('strokes without points are still empty', () => {
    expect(isSignatureEmpty([[], []])).toBe(true);
  });

  test('a single dot is a signature', () => {
    expect(isSignatureEmpty([[{ x: 1, y: 1 }]])).toBe(false);
  });
});

describe('isFarEnough', () => {
  test('the first point is always kept', () => {
    expect(isFarEnough(undefined, { x: 0, y: 0 }, 5)).toBe(true);
  });

  test('jitter under the threshold is dropped', () => {
    expect(isFarEnough({ x: 0, y: 0 }, { x: 0.3, y: 0.4 }, 0.75)).toBe(false);
    expect(isFarEnough({ x: 0, y: 0 }, { x: 3, y: 4 }, 5)).toBe(true);
  });
});

describe('buildStrokePath', () => {
  test('no points, no path', () => {
    expect(buildStrokePath([])).toEqual([]);
  });

  test('one point is a dot: a zero-length line', () => {
    expect(buildStrokePath([{ x: 5, y: 7 }])).toEqual([
      { type: 'M', x: 5, y: 7 },
      { type: 'L', x: 5, y: 7 },
    ]);
  });

  test('two points are a straight line through their midpoint', () => {
    expect(buildStrokePath([{ x: 0, y: 0 }, { x: 10, y: 20 }])).toEqual([
      { type: 'M', x: 0, y: 0 },
      { type: 'L', x: 5, y: 10 },
      { type: 'L', x: 10, y: 20 },
    ]);
  });

  test('inner points become control points of curves between midpoints', () => {
    expect(buildStrokePath(zigzag)).toEqual([
      { type: 'M', x: 10, y: 10 },
      { type: 'L', x: 20, y: 30 },
      { type: 'Q', cx: 30, cy: 50, x: 40, y: 30 },
      { type: 'Q', cx: 50, cy: 10, x: 60, y: 30 },
      { type: 'L', x: 70, y: 50 },
    ]);
  });

  test('the path starts and ends on the first and last recorded points', () => {
    const path = buildStrokePath(zigzag);
    expect(path[0]).toEqual({ type: 'M', x: 10, y: 10 });
    expect(path[path.length - 1]).toEqual({ type: 'L', x: 70, y: 50 });
  });
});

describe('getSignatureBounds', () => {
  test('null when nothing is drawn', () => {
    expect(getSignatureBounds([])).toBeNull();
    expect(getSignatureBounds([[]])).toBeNull();
  });

  test('covers every stroke', () => {
    expect(getSignatureBounds(geometry.strokes)).toEqual({ x: 10, y: 10, width: 190, height: 90 });
  });

  test('grows by half the stroke width on each side', () => {
    expect(getSignatureBounds(geometry.strokes, 4)).toEqual({ x: 8, y: 8, width: 194, height: 94 });
  });

  test('a dot has the size of the stroke', () => {
    expect(getSignatureBounds([[{ x: 50, y: 50 }]], 3)).toEqual({ x: 48.5, y: 48.5, width: 3, height: 3 });
  });
});

describe('fitSignatureBox', () => {
  test('scales uniformly and centres on the free axis', () => {
    expect(fitSignatureBox({ x: 0, y: 0, width: 400, height: 200 }, 800, 800)).toEqual({
      scale: 2,
      offsetX: 0,
      offsetY: 200,
    });
  });

  test('a rotated pad shrinks the signature instead of stretching it', () => {
    const transform = fitSignatureBox({ x: 0, y: 0, width: 800, height: 300 }, 400, 600);
    expect(transform.scale).toBe(0.5);
    expect(transform.offsetX).toBe(0);
    expect(transform.offsetY).toBe(225);
  });

  test('moves an offset source to the origin', () => {
    expect(fitSignatureBox({ x: 10, y: 10, width: 100, height: 50 }, 100, 50)).toEqual({
      scale: 1,
      offsetX: -10,
      offsetY: -10,
    });
  });
});

describe('computeExportLayout', () => {
  test('defaults to the whole pad at twice its size', () => {
    expect(computeExportLayout(geometry, 2)).toEqual({
      width: 800,
      height: 400,
      scale: 2,
      offsetX: 0,
      offsetY: 0,
    });
  });

  test('a width alone keeps the aspect ratio', () => {
    const layout = computeExportLayout(geometry, 2, { width: 600 });
    expect(layout.width).toBe(600);
    expect(layout.height).toBe(300);
    expect(layout.scale).toBe(1.5);
  });

  test('width and height letterbox the pad', () => {
    const layout = computeExportLayout(geometry, 2, { width: 400, height: 400 });
    expect(layout.scale).toBe(1);
    expect(layout.offsetX).toBe(0);
    expect(layout.offsetY).toBe(100);
  });

  test('trim crops to the strokes, ink included', () => {
    const layout = computeExportLayout(geometry, 4, { trim: true, pixelRatio: 1 });
    expect(layout.width).toBe(194);
    expect(layout.height).toBe(94);
    expect(layout.offsetX).toBe(-8);
    expect(layout.offsetY).toBe(-8);
  });

  test('padding is added around trimmed content', () => {
    const layout = computeExportLayout(geometry, 4, { trim: true, pixelRatio: 1, padding: 10 });
    expect(layout.width).toBe(214);
    expect(layout.height).toBe(114);
    expect(layout.offsetX).toBe(2);
    expect(layout.offsetY).toBe(2);
  });

  test('trim on an empty pad falls back to the whole pad', () => {
    const empty = { width: 400, height: 200, strokes: [] };
    expect(computeExportLayout(empty, 2, { trim: true, pixelRatio: 1 })).toEqual({
      width: 400,
      height: 200,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    });
  });

  test('a pad that was never laid out still gives a usable size', () => {
    const layout = computeExportLayout({ width: 0, height: 0, strokes: [] }, 2, { pixelRatio: 1 });
    expect(layout.width).toBe(300);
    expect(layout.height).toBe(150);
  });
});

describe('strokeToSvgPath', () => {
  test('writes move, line and curve commands', () => {
    expect(strokeToSvgPath(zigzag)).toBe('M10 10L20 30Q30 50 40 30Q50 10 60 30L70 50');
  });

  test('applies the transform and rounds', () => {
    expect(
      strokeToSvgPath([{ x: 1, y: 1 }, { x: 2, y: 4 }], { scale: 1 / 3, offsetX: 1, offsetY: 0 }),
    ).toBe('M1.33 0.33L1.5 0.83L1.67 1.33');
  });

  test('a dot is a zero-length line', () => {
    expect(strokeToSvgPath([{ x: 5, y: 7 }])).toBe('M5 7L5 7');
  });
});

describe('signatureToSvg', () => {
  test('one path per stroke, round caps, no fill, no background by default', () => {
    const svg = signatureToSvg(geometry, 2);
    expect(svg).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">' +
        '<g fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 10L20 30Q30 50 40 30Q50 10 60 30L70 50"/>' +
        '<path d="M200 100L200 100"/>' +
        '</g></svg>',
    );
  });

  test('background and pen colour are written when given', () => {
    const svg = signatureToSvg(geometry, 2, { backgroundColor: '#ffffff', penColor: 'rgb(0, 0, 128)' });
    expect(svg).toContain('<rect width="400" height="200" fill="#ffffff"/>');
    expect(svg).toContain('stroke="rgb(0, 0, 128)"');
  });

  test('the stroke width scales with the output', () => {
    expect(signatureToSvg(geometry, 2, { width: 800 })).toContain('stroke-width="4"');
  });

  test('colours cannot break out of their attribute', () => {
    const svg = signatureToSvg(geometry, 2, { penColor: '"/><script>alert(1)</script>' });
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&quot;/&gt;&lt;script&gt;');
  });

  test('an empty signature is an empty drawing', () => {
    const svg = signatureToSvg({ width: 400, height: 200, strokes: [] }, 2);
    expect(svg).not.toContain('<path');
  });

  test('carries nothing but geometry', () => {
    const svg = signatureToSvg(geometry, 2);
    expect(svg).not.toMatch(/pressure|tilt|time|speed|velocity/i);
  });
});

describe('privacy', () => {
  // The pad must only ever read where the pointer is. This fails the build if
  // a biometric pointer property or a clock creeps into the source.
  test('the source never reads pressure, tilt or time', async () => {
    const biometric =
      /\.(pressure|tangentialPressure|tiltX|tiltY|twist|altitudeAngle|azimuthAngle|timeStamp|movementX|movementY)\b/;
    const clock = /Date\.now|performance\.now|new Date\b/;

    for (const file of ['geometry.ts', 'signature-pad.tsx', 'index.ts']) {
      const source = await readFile(path.join(import.meta.dir, '..', 'src', file), 'utf8');
      expect(source).not.toMatch(biometric);
      expect(source).not.toMatch(clock);
    }
  });
});
