# @carefully-built/elevenlabs

Typed, fetch-only client for ElevenLabs Agents (outbound calls, phone numbers, conversations) and post-call webhook verification.

## Install

```bash
bun add @carefully-built/elevenlabs
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/elevenlabs`

## Helper Usage

```ts
import { createElevenLabsClient } from '@carefully-built/elevenlabs';
```

Helpers in this package:

- `createElevenLabsClient`
- `createElevenLabsClient`
- `ElevenLabsError`
- `ElevenLabsError`
- `ElevenLabsWebhookError`
- `ElevenLabsWebhookError`
- `normalizeAnalysis`
- `normalizeConversation`
- `normalizeConversation`
- `normalizeMetadata`
- `normalizePhoneNumber`
- `normalizeTranscript`
- `normalizeVoice`
- `normalizeVoice`
- `verifyElevenLabsWebhook`
- `verifyElevenLabsWebhook`

## Types And Schemas

- `AgentConfigBody`
- `AnalysisProperty`
- `BackgroundSoundPreset`
- `BatchCallInput`
- `BatchCallRecipient`
- `BatchCallResult`
- `buildOutboundAgentConfig`
- `buildOutboundAgentConfig`
- `ConversationAnalysis`
- `ConversationDetail`
- `ConversationMetadata`
- `ElevenLabsClient`
- `ElevenLabsClientOptions`
- `ElevenLabsWebhookEvent`
- `EvaluationCriterion`
- `OutboundAgentInput`
- `OutboundCallInput`
- `OutboundCallResult`
- `PhoneNumber`
- `SystemToolConfig`
- `TelephonyProvider`
- `TranscriptTurn`
- `VerifyWebhookInput`
- `Voice`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `createElevenLabsClient` | Helper | `packages/elevenlabs/src/client.ts` |
| `createElevenLabsClient` | Helper | `packages/elevenlabs/src/index.ts` |
| `ElevenLabsError` | Helper | `packages/elevenlabs/src/client.ts` |
| `ElevenLabsError` | Helper | `packages/elevenlabs/src/index.ts` |
| `ElevenLabsWebhookError` | Helper | `packages/elevenlabs/src/index.ts` |
| `ElevenLabsWebhookError` | Helper | `packages/elevenlabs/src/webhook.ts` |
| `normalizeAnalysis` | Helper | `packages/elevenlabs/src/normalize.ts` |
| `normalizeConversation` | Helper | `packages/elevenlabs/src/index.ts` |
| `normalizeConversation` | Helper | `packages/elevenlabs/src/normalize.ts` |
| `normalizeMetadata` | Helper | `packages/elevenlabs/src/normalize.ts` |
| `normalizePhoneNumber` | Helper | `packages/elevenlabs/src/normalize.ts` |
| `normalizeTranscript` | Helper | `packages/elevenlabs/src/normalize.ts` |
| `normalizeVoice` | Helper | `packages/elevenlabs/src/index.ts` |
| `normalizeVoice` | Helper | `packages/elevenlabs/src/normalize.ts` |
| `verifyElevenLabsWebhook` | Helper | `packages/elevenlabs/src/index.ts` |
| `verifyElevenLabsWebhook` | Helper | `packages/elevenlabs/src/webhook.ts` |
| `AgentConfigBody` | Type | `packages/elevenlabs/src/types.ts` |
| `AnalysisProperty` | Type | `packages/elevenlabs/src/types.ts` |
| `BackgroundSoundPreset` | Type | `packages/elevenlabs/src/agent-config.ts` |
| `BatchCallInput` | Type | `packages/elevenlabs/src/types.ts` |
| `BatchCallRecipient` | Type | `packages/elevenlabs/src/types.ts` |
| `BatchCallResult` | Type | `packages/elevenlabs/src/types.ts` |
| `buildOutboundAgentConfig` | Type | `packages/elevenlabs/src/agent-config.ts` |
| `buildOutboundAgentConfig` | Type | `packages/elevenlabs/src/index.ts` |
| `ConversationAnalysis` | Type | `packages/elevenlabs/src/types.ts` |
| `ConversationDetail` | Type | `packages/elevenlabs/src/types.ts` |
| `ConversationMetadata` | Type | `packages/elevenlabs/src/types.ts` |
| `ElevenLabsClient` | Type | `packages/elevenlabs/src/client.ts` |
| `ElevenLabsClientOptions` | Type | `packages/elevenlabs/src/client.ts` |
| `ElevenLabsWebhookEvent` | Type | `packages/elevenlabs/src/webhook.ts` |
| `EvaluationCriterion` | Type | `packages/elevenlabs/src/types.ts` |
| `OutboundAgentInput` | Type | `packages/elevenlabs/src/agent-config.ts` |
| `OutboundCallInput` | Type | `packages/elevenlabs/src/types.ts` |
| `OutboundCallResult` | Type | `packages/elevenlabs/src/types.ts` |
| `PhoneNumber` | Type | `packages/elevenlabs/src/types.ts` |
| `SystemToolConfig` | Type | `packages/elevenlabs/src/types.ts` |
| `TelephonyProvider` | Type | `packages/elevenlabs/src/types.ts` |
| `TranscriptTurn` | Type | `packages/elevenlabs/src/types.ts` |
| `VerifyWebhookInput` | Type | `packages/elevenlabs/src/webhook.ts` |
| `Voice` | Type | `packages/elevenlabs/src/types.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
