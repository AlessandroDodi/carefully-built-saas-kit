'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type AgentConversationStatus = 'disconnected' | 'connecting' | 'connected';

export interface UseAgentConversationOptions {
  /** Fetches a WebRTC conversation token from your backend (which holds the API key). */
  readonly getToken: () => Promise<string>;
  /** Values for the agent's `{{placeholders}}`, e.g. the name of the person talking. */
  readonly dynamicVariables?: Record<string, string | number | boolean>;
  /** The session is live; `conversationId` is what the post-call webhook will carry. */
  readonly onConnect?: (conversationId: string) => void;
  /** The session ended, by the agent (end_call), the user or a failure. */
  readonly onDisconnect?: (conversationId: string | null) => void;
}

export interface AgentConversation {
  readonly status: AgentConversationStatus;
  /** True while the agent is talking, false while it listens. */
  readonly isSpeaking: boolean;
  readonly conversationId: string | null;
  /** Seconds since the session connected; 0 before. */
  readonly seconds: number;
  readonly error: string | null;
  readonly start: () => Promise<void>;
  readonly stop: () => void;
}

/**
 * Talk to an ElevenLabs agent through the microphone. Must be rendered inside
 * `AgentConversationProvider`. The token is requested only when `start` runs,
 * so the agent id and API key never reach the browser.
 */
export function useAgentConversation({ getToken, dynamicVariables, onConnect, onDisconnect }: UseAgentConversationOptions): AgentConversation {
  const conversation = useConversation();
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const connectedAt = useRef<number | null>(null);
  const callbacks = useRef({ onConnect, onDisconnect });
  callbacks.current = { onConnect, onDisconnect };

  const isConnected = conversation.status === 'connected';
  useEffect(() => {
    if (!isConnected) return undefined;
    connectedAt.current = Date.now();
    setSeconds(0);
    const timer = setInterval(() => { setSeconds(Math.floor((Date.now() - (connectedAt.current ?? Date.now())) / 1000)); }, 500);
    return () => { clearInterval(timer); };
  }, [isConnected]);

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
        onConnect: ({ conversationId: id }) => {
          setConversationId(id);
          callbacks.current.onConnect?.(id);
        },
        onDisconnect: () => {
          setConversationId((id) => {
            callbacks.current.onDisconnect?.(id);
            return id;
          });
        },
        onError: (message) => { setError(message); },
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsStarting(false);
    }
  }, [conversation, dynamicVariables, getToken]);

  const failed = conversation.status === 'error';
  const status: AgentConversationStatus =
    isStarting ? 'connecting' : conversation.status === 'connected' || conversation.status === 'connecting' ? conversation.status : 'disconnected';
  return {
    status,
    isSpeaking: isConnected && conversation.isSpeaking,
    conversationId,
    seconds,
    error: error ?? (failed ? conversation.message ?? 'Connessione fallita' : null),
    start,
    stop: conversation.endSession,
  };
}
