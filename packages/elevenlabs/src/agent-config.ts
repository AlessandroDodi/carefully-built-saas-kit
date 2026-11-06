import type { AgentConfigBody, AnalysisProperty, SystemToolConfig } from './types';

/** ElevenLabs' built-in ambient sounds. */
export type BackgroundSoundPreset = 'office1' | 'office2' | 'restaurant' | 'city' | 'typing' | 'elevator1' | 'elevator2' | 'elevator3' | 'elevator4';

export interface OutboundAgentInput {
  readonly name: string;
  /** The host's prompt; `fixedRules` are appended after it and cannot be edited by end users. */
  readonly prompt: string;
  readonly fixedRules?: string;
  readonly firstMessage: string;
  readonly language?: string;
  readonly voiceId: string;
  readonly modelId?: string;
  readonly speed?: number;
  readonly llm?: string;
  readonly turnEagerness?: 'patient' | 'normal' | 'eager';
  readonly maxDurationSeconds?: number;
  /** When set, the agent may hand the call to this number. */
  readonly transferPhone?: string;
  readonly transferCondition?: string;
  /** Spoken to voicemail; omit to hang up on voicemail. */
  readonly voicemailMessage?: string | null;
  readonly dataCollection?: Record<string, AnalysisProperty>;
  /** Language of the post-call summary and analysis, e.g. `it`; defaults to the agent language. */
  readonly summaryLanguage?: string;
  readonly webhook?: { readonly postCallWebhookId: string; readonly events?: readonly ('transcript' | 'audio')[] };
  /**
   * Ambient sound under the voice so the call sounds less synthetic. `volume` is
   * relative to the speech, 0.01–1 (default 0.15). `null` turns it off; omit to leave it as is.
   */
  readonly backgroundSound?: { readonly preset: BackgroundSoundPreset; readonly volume?: number } | null;
}

function backgroundSound(input: OutboundAgentInput['backgroundSound']): { background_sound?: NonNullable<NonNullable<AgentConfigBody['conversation_config']>['conversation']>['background_sound'] } {
  if (input === undefined) return {};
  if (input === null) return { background_sound: { source_type: null, source_id: null } };
  const volume = Math.min(1, Math.max(0.01, input.volume ?? 0.15));
  return { background_sound: { source_type: 'preset', source_id: input.preset, volume, crossfade_loop: true } };
}

function endCallTool(): SystemToolConfig {
  return {
    name: 'end_call',
    description: 'Chiude la chiamata. Usalo solo dopo aver salutato per intero e dopo che il contatto ha risposto al saluto, mai a metà frase.',
    params: { system_tool_type: 'end_call' },
  };
}

function voicemailTool(message: string | null | undefined): SystemToolConfig {
  return { name: 'voicemail_detection', params: { system_tool_type: 'voicemail_detection', voicemail_message: message ?? null } };
}

function transferTool(phone: string, condition: string): SystemToolConfig {
  return {
    name: 'transfer_to_number',
    params: {
      system_tool_type: 'transfer_to_number',
      enable_client_message: true,
      transfers: [{ transfer_destination: { type: 'phone', phone_number: phone }, condition, transfer_type: 'conference' }],
    },
  };
}

/** An outbound-calling agent: Italian by default, with end-call, voicemail and optional transfer tools. */
export function buildOutboundAgentConfig(input: OutboundAgentInput): AgentConfigBody {
  const prompt = input.fixedRules ? `${input.prompt.trim()}\n\n${input.fixedRules.trim()}` : input.prompt.trim();
  return {
    name: input.name,
    conversation_config: {
      agent: {
        first_message: input.firstMessage,
        language: input.language ?? 'it',
        prompt: {
          prompt,
          llm: input.llm ?? 'gpt-5.4-mini',
          temperature: 0.6,
          built_in_tools: {
            end_call: endCallTool(),
            voicemail_detection: voicemailTool(input.voicemailMessage),
            transfer_to_number: input.transferPhone
              ? transferTool(input.transferPhone, input.transferCondition ?? 'Il contatto chiede di parlare con una persona.')
              : null,
          },
        },
      },
      tts: {
        voice_id: input.voiceId,
        model_id: input.modelId ?? 'eleven_v3_conversational',
        speed: input.speed ?? 1,
        expressive_mode: true,
      },
      turn: { turn_timeout: 7, turn_eagerness: input.turnEagerness ?? 'normal', silence_end_call_timeout: 20 },
      conversation: { max_duration_seconds: input.maxDurationSeconds ?? 600, ...backgroundSound(input.backgroundSound) },
    },
    platform_settings: {
      summary_language: input.summaryLanguage ?? input.language ?? 'it',
      ...(input.dataCollection ? { data_collection: input.dataCollection } : {}),
      ...(input.webhook
        ? { workspace_overrides: { webhooks: { post_call_webhook_id: input.webhook.postCallWebhookId, events: input.webhook.events ?? ['transcript', 'audio'] } } }
        : {}),
    },
  };
}
