import type {
  ConversationAnalysis,
  ConversationDetail,
  ConversationMetadata,
  PhoneNumber,
  TranscriptTurn,
} from './types';

type Json = Record<string, unknown>;

function asRecord(value: unknown): Json {
  return typeof value === 'object' && value !== null ? (value as Json) : {};
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function normalizeTranscript(raw: unknown): TranscriptTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const turn = asRecord(item);
    return {
      role: turn.role === 'agent' ? 'agent' : 'user',
      message: asString(turn.message),
      timeInCallSecs: asNumber(turn.time_in_call_secs) ?? 0,
    };
  });
}

export function normalizeMetadata(raw: unknown): ConversationMetadata {
  const metadata = asRecord(raw);
  return {
    startTimeUnixSecs: asNumber(metadata.start_time_unix_secs) ?? 0,
    callDurationSecs: asNumber(metadata.call_duration_secs) ?? 0,
    cost: asNumber(metadata.cost),
    terminationReason: asString(metadata.termination_reason),
  };
}

/** `data_collection_results` arrives as `{ field: { value, rationale, … } }`: keep the values. */
export function normalizeAnalysis(raw: unknown): ConversationAnalysis {
  const analysis = asRecord(raw);
  const results = asRecord(analysis.data_collection_results);
  const dataCollection = Object.fromEntries(
    Object.entries(results).map(([key, entry]) => [key, asRecord(entry).value]),
  );
  const successful = analysis.call_successful;
  return {
    transcriptSummary: asString(analysis.transcript_summary),
    callSuccessful:
      successful === 'success' || successful === 'failure' || successful === 'unknown' ? successful : null,
    dataCollection,
  };
}

/** Both the conversation endpoint and the post-call webhook use this shape. */
export function normalizeConversation(raw: unknown): ConversationDetail {
  const data = asRecord(raw);
  const initiation = asRecord(data.conversation_initiation_client_data);
  return {
    conversationId: asString(data.conversation_id) ?? '',
    agentId: asString(data.agent_id) ?? '',
    status: asString(data.status) ?? 'unknown',
    transcript: normalizeTranscript(data.transcript),
    metadata: normalizeMetadata(data.metadata),
    analysis: normalizeAnalysis(data.analysis),
    dynamicVariables: asRecord(initiation.dynamic_variables),
    hasAudio: data.has_audio === true,
  };
}

export function normalizePhoneNumber(raw: unknown): PhoneNumber {
  const item = asRecord(raw);
  const agent = asRecord(item.assigned_agent);
  return {
    phoneNumberId: asString(item.phone_number_id) ?? '',
    phoneNumber: asString(item.phone_number) ?? '',
    label: asString(item.label) ?? '',
    provider: item.provider === 'sip_trunk' ? 'sip_trunk' : 'twilio',
    assignedAgentId: asString(agent.agent_id),
  };
}
