# @carefully-built/elevenlabs-react

Talk to an ElevenLabs agent from the browser (microphone, WebRTC). The
conversation token comes from your backend, so the API key stays there.

```tsx
<AgentConversationProvider>
  <TalkButton />
</AgentConversationProvider>

function TalkButton() {
  const { status, isSpeaking, error, start, stop } = useAgentConversation({
    getToken: () => fetchConversationToken(),
    dynamicVariables: { contact_name: 'Alessandro' },
  });
  // render according to status
}
```
