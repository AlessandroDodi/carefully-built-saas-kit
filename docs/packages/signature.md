# @carefully-built/signature

Signature pad for Carefully Built SaaS apps: smooth handwritten signatures on a canvas, stored as plain geometry and exported as PNG or SVG.

## Install

```bash
bun add @carefully-built/signature
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/signature`

## Component Usage

```tsx
import { SignaturePad } from '@carefully-built/signature';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `SignaturePad`: import from `@carefully-built/signature`.

## Helper Usage

```ts
import { buildStrokePath } from '@carefully-built/signature';
```

Helpers in this package:

- `buildStrokePath`
- `buildStrokePath`
- `computeExportLayout`
- `computeExportLayout`
- `fitSignatureBox`
- `fitSignatureBox`
- `getSignatureBounds`
- `getSignatureBounds`
- `isFarEnough`
- `isSignatureEmpty`
- `isSignatureEmpty`
- `SignaturePad`
- `signatureTexts`
- `signatureToSvg`
- `signatureToSvg`
- `strokeToSvgPath`
- `strokeToSvgPath`

## Types And Schemas

- `SignatureBox`
- `SignatureExportLayout`
- `SignatureExportOptions`
- `SignatureGeometry`
- `SignaturePadChange`
- `SignaturePadClassNames`
- `SignaturePadHandle`
- `SignaturePadLabels`
- `SignaturePadProps`
- `SignaturePathCommand`
- `SignaturePoint`
- `SignatureStroke`
- `SignatureTransform`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `SignaturePad` | Component | `packages/signature/src/signature-pad.tsx` |
| `buildStrokePath` | Helper | `packages/signature/src/geometry.ts` |
| `buildStrokePath` | Helper | `packages/signature/src/index.ts` |
| `computeExportLayout` | Helper | `packages/signature/src/geometry.ts` |
| `computeExportLayout` | Helper | `packages/signature/src/index.ts` |
| `fitSignatureBox` | Helper | `packages/signature/src/geometry.ts` |
| `fitSignatureBox` | Helper | `packages/signature/src/index.ts` |
| `getSignatureBounds` | Helper | `packages/signature/src/geometry.ts` |
| `getSignatureBounds` | Helper | `packages/signature/src/index.ts` |
| `isFarEnough` | Helper | `packages/signature/src/geometry.ts` |
| `isSignatureEmpty` | Helper | `packages/signature/src/geometry.ts` |
| `isSignatureEmpty` | Helper | `packages/signature/src/index.ts` |
| `SignaturePad` | Helper | `packages/signature/src/index.ts` |
| `signatureTexts` | Helper | `packages/signature/src/signature-texts.ts` |
| `signatureToSvg` | Helper | `packages/signature/src/geometry.ts` |
| `signatureToSvg` | Helper | `packages/signature/src/index.ts` |
| `strokeToSvgPath` | Helper | `packages/signature/src/geometry.ts` |
| `strokeToSvgPath` | Helper | `packages/signature/src/index.ts` |
| `SignatureBox` | Type | `packages/signature/src/geometry.ts` |
| `SignatureExportLayout` | Type | `packages/signature/src/geometry.ts` |
| `SignatureExportOptions` | Type | `packages/signature/src/geometry.ts` |
| `SignatureGeometry` | Type | `packages/signature/src/geometry.ts` |
| `SignaturePadChange` | Type | `packages/signature/src/signature-pad.tsx` |
| `SignaturePadClassNames` | Type | `packages/signature/src/signature-pad.tsx` |
| `SignaturePadHandle` | Type | `packages/signature/src/signature-pad.tsx` |
| `SignaturePadLabels` | Type | `packages/signature/src/signature-pad.tsx` |
| `SignaturePadProps` | Type | `packages/signature/src/signature-pad.tsx` |
| `SignaturePathCommand` | Type | `packages/signature/src/geometry.ts` |
| `SignaturePoint` | Type | `packages/signature/src/geometry.ts` |
| `SignatureStroke` | Type | `packages/signature/src/geometry.ts` |
| `SignatureTransform` | Type | `packages/signature/src/geometry.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
