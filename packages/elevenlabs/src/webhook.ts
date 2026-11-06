import { normalizeConversation } from './normalize';

import type { ConversationDetail } from './types';

export class ElevenLabsWebhookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ElevenLabsWebhookError';
  }
}

export type ElevenLabsWebhookEvent =
  | { readonly type: 'post_call_transcription'; readonly eventTimestamp: number; readonly conversation: ConversationDetail }
  | { readonly type: 'post_call_audio'; readonly eventTimestamp: number; readonly conversationId: string; readonly audioBase64: string }
  /** Any other event type ElevenLabs may add; `rawType` carries its name. */
  | { readonly type: 'other'; readonly rawType: string; readonly eventTimestamp: number; readonly raw: unknown };

export interface VerifyWebhookInput {
  readonly secret: string;
  /** The `ElevenLabs-Signature` header: `t=<unix seconds>,v0=<hex hmac>`. */
  readonly signatureHeader: string | null;
  readonly rawBody: string;
  /** Reject events older than this (replay protection). Default 30 minutes. */
  readonly toleranceSeconds?: number;
  readonly now?: () => number;
}

function parseSignature(header: string): { timestamp: string; signature: string } {
  const parts = Object.fromEntries(header.split(',').map((part) => part.trim().split('=') as [string, string]));
  const timestamp = parts.t;
  const signature = parts.v0;
  if (!timestamp || !signature) {
    throw new ElevenLabsWebhookError('Malformed ElevenLabs-Signature header');
  }
  return { timestamp, signature };
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

function toEvent(payload: Record<string, unknown>): ElevenLabsWebhookEvent {
  const type = typeof payload.type === 'string' ? payload.type : 'unknown';
  const eventTimestamp = typeof payload.event_timestamp === 'number' ? payload.event_timestamp : 0;
  const data = typeof payload.data === 'object' && payload.data !== null ? (payload.data as Record<string, unknown>) : {};

  if (type === 'post_call_transcription') {
    return { type: 'post_call_transcription', eventTimestamp, conversation: normalizeConversation(data) };
  }
  if (type === 'post_call_audio') {
    return {
      type: 'post_call_audio',
      eventTimestamp,
      conversationId: typeof data.conversation_id === 'string' ? data.conversation_id : '',
      audioBase64: typeof data.full_audio === 'string' ? data.full_audio : '',
    };
  }
  return { type: 'other', rawType: type, eventTimestamp, raw: payload };
}

/**
 * Verifies the HMAC of a post-call webhook (`v0 = HMAC-SHA256(secret, "<t>.<body>")`)
 * and returns the typed event. Uses WebCrypto, so it works in Convex HTTP actions too.
 */
export async function verifyElevenLabsWebhook({
  secret,
  signatureHeader,
  rawBody,
  toleranceSeconds = 30 * 60,
  now = () => Date.now(),
}: VerifyWebhookInput): Promise<ElevenLabsWebhookEvent> {
  if (!signatureHeader) {
    throw new ElevenLabsWebhookError('Missing ElevenLabs-Signature header');
  }
  const { timestamp, signature } = parseSignature(signatureHeader);
  const age = Math.floor(now() / 1000) - Number(timestamp);
  if (!Number.isFinite(age) || Math.abs(age) > toleranceSeconds) {
    throw new ElevenLabsWebhookError('Webhook timestamp outside the accepted window');
  }
  const expected = await hmacHex(secret, `${timestamp}.${rawBody}`);
  if (!timingSafeEqual(expected, signature)) {
    throw new ElevenLabsWebhookError('Webhook signature does not match');
  }
  return toEvent(JSON.parse(rawBody) as Record<string, unknown>);
}
