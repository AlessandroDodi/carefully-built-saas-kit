# @carefully-built/elevenlabs-react

React hook for talking to an ElevenLabs agent from the browser (microphone, WebRTC), with the token fetched from your own backend.

## Install

```bash
bun add @carefully-built/elevenlabs-react
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/elevenlabs-react`

## Component Usage

```tsx
import { CallScreen } from '@carefully-built/elevenlabs-react';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `CallScreen`: import from `@carefully-built/elevenlabs-react`.
- `VoiceCarousel`: import from `@carefully-built/elevenlabs-react`.

## Hook Usage

```tsx
import { useAgentConversation } from '@carefully-built/elevenlabs-react';

export function Example() {
  const state = useAgentConversation({} as never);
  return null;
}
```

Hooks in this package:

- `useAgentConversation`: keep app-specific data fetching and mutations in the consuming app.
- `useAgentConversation`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { AgentConversationProvider } from '@carefully-built/elevenlabs-react';
```

Helpers in this package:

- `AgentConversationProvider`
- `CallScreen`
- `VoiceCarousel`

## Types And Schemas

- `AgentConversation`
- `AgentConversationStatus`
- `CallScreenProps`
- `UseAgentConversationOptions`
- `VoiceCardData`
- `VoiceCarouselProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `CallScreen` | Component | `packages/elevenlabs-react/src/call-screen.tsx` |
| `VoiceCarousel` | Component | `packages/elevenlabs-react/src/voice-carousel.tsx` |
| `AgentConversationProvider` | Helper | `packages/elevenlabs-react/src/index.ts` |
| `CallScreen` | Helper | `packages/elevenlabs-react/src/index.ts` |
| `VoiceCarousel` | Helper | `packages/elevenlabs-react/src/index.ts` |
| `useAgentConversation` | Hook | `packages/elevenlabs-react/src/index.ts` |
| `useAgentConversation` | Hook | `packages/elevenlabs-react/src/use-agent-conversation.ts` |
| `AgentConversation` | Type | `packages/elevenlabs-react/src/use-agent-conversation.ts` |
| `AgentConversationStatus` | Type | `packages/elevenlabs-react/src/use-agent-conversation.ts` |
| `CallScreenProps` | Type | `packages/elevenlabs-react/src/call-screen.tsx` |
| `UseAgentConversationOptions` | Type | `packages/elevenlabs-react/src/use-agent-conversation.ts` |
| `VoiceCardData` | Type | `packages/elevenlabs-react/src/voice-carousel.tsx` |
| `VoiceCarouselProps` | Type | `packages/elevenlabs-react/src/voice-carousel.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
