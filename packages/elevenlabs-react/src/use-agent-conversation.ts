'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState } from 'react';

export type AgentConversationStatus = 'disconnected' | 'connecting' | 'connected';

export interface UseAgentConversationOptions {
  /** Fetches a WebRTC conversation token from your backend (which holds the API key). */
  readonly getToken: () => Promise<string>;
  /** Values for the agent's `{{placeholders}}`, e.g. the name of the person talking. */
  readonly dynamicVariables?: Record<string, string | number | boolean>;
}

export interface AgentConversation {
  readonly status: AgentConversationStatus;
  /** True while the agent is talking, false while it listens. */
  readonly isSpeaking: boolean;
  readonly error: string | null;
  readonly start: () => Promise<void>;
  readonly stop: () => void;
}

/**
 * Talk to an ElevenLabs agent through the microphone. Must be rendered inside
 * `AgentConversationProvider`. The token is requested only when `start` runs,
 * so the agent id and API key never reach the browser.
 */
export function useAgentConversation({ getToken, dynamicVariables }: UseAgentConversationOptions): AgentConversation {
  const conversation = useConversation();
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const start = useCallback(async () => {
    setError(null);
    setIsStarting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const conversationToken = await getToken();
      conversation.startSession({
        conversationToken,
        connectionType: 'webrtc',
        dynamicVariables,
        onError: (message) => { setError(message); },
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsStarting(false);
    }
  }, [conversation, dynamicVariables, getToken]);

  const failed = conversation.status === 'error';
  return {
    status: isStarting ? 'connecting' : failed ? 'disconnected' : conversation.status,
    isSpeaking: conversation.status === 'connected' && conversation.isSpeaking,
    error: error ?? (failed ? conversation.message ?? 'Connessione fallita' : null),
    start,
    stop: conversation.endSession,
  };
}
