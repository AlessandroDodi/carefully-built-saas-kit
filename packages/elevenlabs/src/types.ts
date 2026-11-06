/** Shapes of the ElevenLabs Agents API that the kit uses. Field names mirror the API. */

export type TelephonyProvider = 'twilio' | 'sip_trunk';

export interface PhoneNumber {
  readonly phoneNumberId: string;
  readonly phoneNumber: string;
  readonly label: string;
  readonly provider: TelephonyProvider;
  readonly assignedAgentId: string | null;
}

export interface Voice {
  readonly voiceId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly language: string | null;
  readonly gender: 'male' | 'female' | 'neutral' | null;
  readonly age: string | null;
  readonly accent: string | null;
  /** ElevenLabs' own sample, usually in English. */
  readonly previewUrl: string | null;
}

export interface SystemToolConfig {
  readonly name: string;
  readonly description?: string;
  readonly params: Record<string, unknown>;
}

export interface AnalysisProperty {
  readonly type: 'boolean' | 'string' | 'integer' | 'number';
  readonly description?: string;
  readonly enum?: readonly string[];
}

export interface EvaluationCriterion {
  readonly id: string;
  readonly name: string;
  readonly conversation_goal_prompt: string;
}

/** Request body of POST /v1/convai/agents/create (the subset the kit fills in). */
export interface AgentConfigBody {
  readonly name: string;
  readonly conversation_config: {
    readonly agent: {
      readonly first_message: string;
      readonly language: string;
      readonly prompt: {
        readonly prompt: string;
        readonly llm?: string;
        readonly temperature?: number;
        readonly built_in_tools?: Record<string, SystemToolConfig | null>;
        readonly tool_ids?: readonly string[];
      };
    };
    readonly tts: {
      readonly voice_id: string;
      readonly model_id?: string;
      readonly speed?: number;
      readonly stability?: number;
      readonly similarity_boost?: number;
      readonly expressive_mode?: boolean;
    };
    readonly turn?: {
      readonly turn_timeout?: number;
      readonly turn_eagerness?: 'patient' | 'normal' | 'eager';
      readonly silence_end_call_timeout?: number;
    };
    readonly conversation?: { readonly max_duration_seconds?: number };
  };
  readonly platform_settings?: {
    readonly data_collection?: Record<string, AnalysisProperty>;
    readonly evaluation?: { readonly criteria: readonly EvaluationCriterion[] };
    readonly workspace_overrides?: {
      readonly webhooks?: {
        readonly post_call_webhook_id?: string;
        readonly events?: readonly ('transcript' | 'audio')[];
      };
    };
  };
}

export interface OutboundCallInput {
  readonly provider: TelephonyProvider;
  readonly agentId: string;
  readonly agentPhoneNumberId: string;
  readonly toNumber: string;
  /** Values for `{{name}}` placeholders in the prompt and first message. */
  readonly dynamicVariables?: Record<string, string | number | boolean>;
  readonly firstMessage?: string;
  /** Twilio only: hang up on answering machines instead of talking to them. */
  readonly hangUpOnMachine?: boolean;
  readonly ringingTimeoutSeconds?: number;
}

export interface OutboundCallResult {
  readonly success: boolean;
  readonly message: string;
  readonly conversationId: string | null;
  /** Twilio call SID or SIP call id, when the provider returns one. */
  readonly providerCallId: string | null;
}

export interface BatchCallRecipient {
  readonly phoneNumber: string;
  readonly dynamicVariables?: Record<string, string | number | boolean>;
}

export interface BatchCallInput {
  readonly name: string;
  readonly agentId: string;
  readonly agentPhoneNumberId: string;
  readonly recipients: readonly BatchCallRecipient[];
  readonly scheduledTimeUnix?: number;
  readonly concurrency?: number;
}

export interface BatchCallResult {
  readonly id: string;
  readonly status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  readonly totalCallsScheduled: number;
}

export interface TranscriptTurn {
  readonly role: 'agent' | 'user';
  readonly message: string | null;
  readonly timeInCallSecs: number;
}

export interface ConversationAnalysis {
  readonly transcriptSummary: string | null;
  readonly callSuccessful: 'success' | 'failure' | 'unknown' | null;
  readonly dataCollection: Record<string, unknown>;
}

export interface ConversationMetadata {
  readonly startTimeUnixSecs: number;
  readonly callDurationSecs: number;
  /** ElevenLabs credits, not money. */
  readonly cost: number | null;
  readonly terminationReason: string | null;
}

export interface ConversationDetail {
  readonly conversationId: string;
  readonly agentId: string;
  readonly status: string;
  readonly transcript: readonly TranscriptTurn[];
  readonly metadata: ConversationMetadata;
  readonly analysis: ConversationAnalysis;
  readonly dynamicVariables: Record<string, unknown>;
  readonly hasAudio: boolean;
}
