# @carefully-built/signature

A signature pad for React: a canvas to sign on with a finger, a stylus or a mouse, with smooth strokes and PNG/SVG export.

## Install

```bash
bun add @carefully-built/signature
```

Peer dependencies: `react`, `react-dom`, `lucide-react`, `@carefully-built/ui`. The app needs Tailwind CSS with the kit's design tokens.

## Basic Usage

```tsx
import { useRef, useState } from 'react';
import { SignaturePad, type SignaturePadHandle } from '@carefully-built/signature';

const pad = useRef<SignaturePadHandle>(null);
const [signed, setSigned] = useState(false);

<div className="h-64">
  <SignaturePad
    ref={pad}
    caption="Signature of Maria Rossi"
    onChange={({ isEmpty }) => setSigned(!isEmpty)}
  />
</div>

<Button
  disabled={!signed}
  onClick={async () => {
    const png = await pad.current?.toBlob({ trim: true, padding: 16 });
    // upload png
  }}
>
  Confirm
</Button>;
```

With no props the pad fills its container (at least 160px tall), shows a dashed border, a baseline and a clear button in the top-right corner that is enabled once something is drawn.

## Privacy

The pad reads **only the x/y position** of the pointer. It never reads, stores or exports pressure, tilt, twist, speed, or per-point timestamps, and there is no option to turn that on.

This is deliberate. A signature captured with its dynamics (how hard and how fast the pen moved) can identify a person and is treated as biometric data. A signature captured as shape only is a drawing: the same thing a scan of a paper signature would give you. Strokes are drawn with a constant width for the same reason: the line does not encode pressure or speed.

A test in this package fails if the source starts reading those pointer properties or a clock.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `onChange` | `({ isEmpty, strokeCount }) => void` | | After every stroke, undo and clear. |
| `onBegin` / `onEnd` | `() => void` | | A stroke started / ended. |
| `disabled` | `boolean` | `false` | Ignores input; `clear()` and `undo()` still work from code. |
| `penColor` | `string` | pad text colour | Ink on screen. Must be a concrete CSS colour, not a `var()`. |
| `strokeWidth` | `number` | `2.5` | CSS pixels, constant along the stroke. |
| `caption` | `ReactNode` | | Text under the baseline. |
| `showBaseline` | `boolean` | `true` | |
| `showClearButton` | `boolean` | `true` | Hide it to place your own button and call `ref.clear()`. |
| `labels` | `{ clear?, canvasLabel? }` | kit locale | English and Italian defaults via `KitLocaleProvider`. |
| `className`, `classes` | | | Slots: `root`, `canvas`, `clearButton`, `guide`, `baseline`, `caption`. |

## Ref Handle

```ts
interface SignaturePadHandle {
  clear(): void;
  undo(): void;
  isEmpty(): boolean;
  toDataURL(options?: SignatureExportOptions): string; // PNG data URL
  toBlob(options?: SignatureExportOptions): Promise<Blob | null>; // PNG
  toSVG(options?: SignatureExportOptions): string; // standalone SVG document
}

interface SignatureExportOptions {
  width?: number; // output pixels; with only one of width/height the other follows the aspect ratio
  height?: number;
  pixelRatio?: number; // used when neither is given: PNG 2, SVG 1
  backgroundColor?: string | null; // PNG: opaque white by default, null for transparent. SVG: none by default
  penColor?: string; // defaults to the `penColor` prop, or black
  trim?: boolean; // crop to the strokes
  padding?: number; // margin in output pixels
}
```

Notes on export:

- PNG is opaque white by default, so the file has no alpha channel and looks the same wherever it is embedded.
- The exported ink is the `penColor` prop when you set one, otherwise black. The on-screen default follows the theme (it would be near-white in a dark theme), which is not what a document should contain.
- Exports are drawn again from the stored geometry at the requested size, so they are sharp at any resolution and never include the baseline, caption or border.

## Resizing And Rotation

Strokes are kept in memory as points relative to the size the pad had when the first stroke began. When the pad changes size (window resize, tablet rotation, a different pixel density) the canvas is rebuilt and the signature is drawn again with a uniform scale, centred: it may get smaller, it is never stretched or lost.

## Geometry Helpers

The pure functions used by the pad are exported for tests and for rendering a stored signature elsewhere: `buildStrokePath`, `strokeToSvgPath`, `signatureToSvg`, `getSignatureBounds`, `isSignatureEmpty`, `fitSignatureBox`, `computeExportLayout`.
