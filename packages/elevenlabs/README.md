# `@carefully-built/elevenlabs`

Client minimale per ElevenLabs Agents, solo `fetch`: funziona in Node, edge e
nelle action di Convex. Niente SDK, niente dipendenze.

## Cosa include

- `createElevenLabsClient({ apiKey })`: `agents.create/update/remove`,
  `phoneNumbers.list/importTwilio/assignAgent`, `calls.outbound` (Twilio o SIP
  trunk, con variabili dinamiche e rilevamento segreteria), `batchCalls.submit`,
  `conversations.get/audio`.
- `buildOutboundAgentConfig(...)`: configurazione di un agente per chiamate in
  uscita in italiano, con strumenti `end_call`, `voicemail_detection` e
  `transfer_to_number`, regole fisse accodate al prompt dell'host, `data_collection`
  per l'esito e webhook post-chiamata.
- `verifyElevenLabsWebhook({ secret, signatureHeader, rawBody })`: verifica
  HMAC (`t=…,v0=…`) e restituisce l'evento tipizzato
  (`post_call_transcription` con trascrizione, metadati e analisi normalizzati,
  oppure `post_call_audio` con l'MP3 in base64).

## Esempio

```ts
import { createElevenLabsClient, verifyElevenLabsWebhook } from '@carefully-built/elevenlabs';

const client = createElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY ?? '' });
const call = await client.calls.outbound({
  provider: 'twilio',
  agentId,
  agentPhoneNumberId,
  toNumber: '+393331234567',
  dynamicVariables: { contact_name: 'Giulia Bianchi' },
  hangUpOnMachine: true,
});

// Nell'endpoint del webhook:
const event = await verifyElevenLabsWebhook({ secret, signatureHeader, rawBody });
if (event.type === 'post_call_transcription') {
  event.conversation.analysis.dataCollection.outcome;
}
```
