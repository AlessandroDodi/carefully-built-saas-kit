import { normalizeConversation, normalizePhoneNumber } from './normalize';

import type {
  AgentConfigBody,
  BatchCallInput,
  BatchCallResult,
  ConversationDetail,
  OutboundCallInput,
  OutboundCallResult,
  PhoneNumber,
} from './types';

export interface ElevenLabsClientOptions {
  readonly apiKey: string;
  /** Defaults to the global API; set the EU residency host when the workspace is there. */
  readonly baseUrl?: string;
  readonly fetch?: typeof fetch;
}

export class ElevenLabsError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = 'ElevenLabsError';
  }
}

type Json = Record<string, unknown>;

function buildClientData(input: OutboundCallInput): Json {
  const override = input.firstMessage ? { agent: { first_message: input.firstMessage } } : undefined;
  return {
    dynamic_variables: input.dynamicVariables ?? {},
    ...(override ? { conversation_config_override: override } : {}),
  };
}

function buildTelephonyConfig(input: OutboundCallInput): Json {
  return {
    ringing_timeout_secs: input.ringingTimeoutSeconds ?? 45,
    ...(input.provider === 'twilio' && input.hangUpOnMachine
      ? {
          twilio_machine_detection: {
            mode: 'enable',
            actions: [{ action: 'hang_up', answered_by: ['machine_start', 'fax'] }],
          },
        }
      : {}),
  };
}

/**
 * Minimal client over the ElevenLabs Agents REST API. Only `fetch` is used, so
 * it runs in Node, the edge and Convex actions alike.
 */
export function createElevenLabsClient({
  apiKey,
  baseUrl = 'https://api.elevenlabs.io',
  fetch: fetchImpl = fetch,
}: ElevenLabsClientOptions) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', ...init.headers },
    });
    const text = await response.text();
    const body: unknown = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new ElevenLabsError(`ElevenLabs ${init.method ?? 'GET'} ${path} → ${String(response.status)}`, response.status, body);
    }
    return body as T;
  }

  const post = <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) });

  return {
    agents: {
      async create(body: AgentConfigBody): Promise<{ agentId: string }> {
        const result = await post<{ agent_id: string }>('/v1/convai/agents/create', body);
        return { agentId: result.agent_id };
      },
      async update(agentId: string, body: Partial<AgentConfigBody>): Promise<void> {
        await request(`/v1/convai/agents/${agentId}`, { method: 'PATCH', body: JSON.stringify(body) });
      },
      async remove(agentId: string): Promise<void> {
        await request(`/v1/convai/agents/${agentId}`, { method: 'DELETE' });
      },
    },
    phoneNumbers: {
      async list(): Promise<PhoneNumber[]> {
        const result = await request<unknown[]>('/v1/convai/phone-numbers');
        return result.map(normalizePhoneNumber);
      },
      async importTwilio(input: { phoneNumber: string; label: string; sid: string; token: string }): Promise<string> {
        const result = await post<{ phone_number_id: string }>('/v1/convai/phone-numbers', {
          phone_number: input.phoneNumber,
          label: input.label,
          sid: input.sid,
          token: input.token,
          provider: 'twilio',
        });
        return result.phone_number_id;
      },
      async assignAgent(phoneNumberId: string, agentId: string): Promise<void> {
        await request(`/v1/convai/phone-numbers/${phoneNumberId}`, {
          method: 'PATCH',
          body: JSON.stringify({ agent_id: agentId }),
        });
      },
    },
    calls: {
      /** Starts one outbound call; the result arrives later through the post-call webhook. */
      async outbound(input: OutboundCallInput): Promise<OutboundCallResult> {
        const path = input.provider === 'twilio' ? '/v1/convai/twilio/outbound-call' : '/v1/convai/sip-trunk/outbound-call';
        const result = await post<Json>(path, {
          agent_id: input.agentId,
          agent_phone_number_id: input.agentPhoneNumberId,
          to_number: input.toNumber,
          conversation_initiation_client_data: buildClientData(input),
          telephony_call_config: buildTelephonyConfig(input),
        });
        const providerCallId = result.callSid ?? result.sip_call_id;
        return {
          success: result.success === true,
          message: typeof result.message === 'string' ? result.message : '',
          conversationId: typeof result.conversation_id === 'string' ? result.conversation_id : null,
          providerCallId: typeof providerCallId === 'string' ? providerCallId : null,
        };
      },
    },
    batchCalls: {
      async submit(input: BatchCallInput): Promise<BatchCallResult> {
        const result = await post<Json>('/v1/convai/batch-calling/submit', {
          call_name: input.name,
          agent_id: input.agentId,
          agent_phone_number_id: input.agentPhoneNumberId,
          scheduled_time_unix: input.scheduledTimeUnix,
          target_concurrency_limit: input.concurrency,
          recipients: input.recipients.map((recipient) => ({
            phone_number: recipient.phoneNumber,
            conversation_initiation_client_data: { dynamic_variables: recipient.dynamicVariables ?? {} },
          })),
        });
        return {
          id: String(result.id),
          status: result.status as BatchCallResult['status'],
          totalCallsScheduled: typeof result.total_calls_scheduled === 'number' ? result.total_calls_scheduled : 0,
        };
      },
    },
    conversations: {
      /** Short-lived WebRTC token so a browser can talk to a private agent without the API key. */
      async token(agentId: string): Promise<string> {
        const result = await request<{ token: string }>(`/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`);
        return result.token;
      },
      async get(conversationId: string): Promise<ConversationDetail> {
        return normalizeConversation(await request<unknown>(`/v1/convai/conversations/${conversationId}`));
      },
      /** The call recording as MP3 bytes. */
      async audio(conversationId: string): Promise<ArrayBuffer> {
        const response = await fetchImpl(`${baseUrl}/v1/convai/conversations/${conversationId}/audio`, {
          headers: { 'xi-api-key': apiKey },
        });
        if (!response.ok) {
          throw new ElevenLabsError(`ElevenLabs audio → ${String(response.status)}`, response.status, null);
        }
        return response.arrayBuffer();
      },
    },
  };
}

export type ElevenLabsClient = ReturnType<typeof createElevenLabsClient>;
