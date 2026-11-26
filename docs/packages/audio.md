# @carefully-built/audio

Audio players for Carefully Built SaaS apps: a waveform player coloured by who is speaking.

## Install

```bash
bun add @carefully-built/audio
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/audio`

## Component Usage

```tsx
import { WaveformPlayer } from '@carefully-built/audio';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `WaveformPlayer`: import from `@carefully-built/audio`.

## Helper Usage

```ts
import { WaveformPlayer } from '@carefully-built/audio';
```

Helpers in this package:

- `WaveformPlayer`

## Types And Schemas

- `WaveformPlayerProps`
- `WaveformSegment`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `WaveformPlayer` | Component | `packages/audio/src/waveform-player.tsx` |
| `WaveformPlayer` | Helper | `packages/audio/src/index.ts` |
| `WaveformPlayerProps` | Type | `packages/audio/src/waveform-player.tsx` |
| `WaveformSegment` | Type | `packages/audio/src/waveform-player.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
