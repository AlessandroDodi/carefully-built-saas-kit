'use client';

import { Button, cn, defineKitTexts, useKitTexts } from '@carefully-built/ui';
import { Mic, PhoneOff } from 'lucide-react';

const texts = defineKitTexts({
  en: { connecting: 'Calling…', speaking: 'The agent is speaking', listening: 'Listening to you…', ended: 'Call ended', hangUp: 'Hang up' },
  it: { connecting: 'Chiamata in corso…', speaking: 'L’agente sta parlando', listening: 'Ti sta ascoltando…', ended: 'Chiamata terminata', hangUp: 'Riaggancia' },
});

export interface CallScreenProps {
  /** Who is being called. */
  readonly name: string;
  readonly subtitle?: string;
  readonly status: 'connecting' | 'connected' | 'ended';
  readonly isSpeaking: boolean;
  readonly seconds: number;
  /** Text under the status, e.g. "Elaboro la chiamata…" once ended. */
  readonly note?: string;
  readonly onHangUp?: () => void;
  readonly className?: string;
}

function formatSeconds(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * The screen of a phone call: an orb that breathes while ringing, pulses in
 * waves while the agent speaks and shows a listening indicator while the
 * other side talks; name, timer and a hang-up button.
 */
export function CallScreen({ name, subtitle, status, isSpeaking, seconds, note, onHangUp, className }: CallScreenProps): React.ReactElement {
  const t = useKitTexts(texts);
  const live = status === 'connected';
  const label = status === 'connecting' ? t.connecting : status === 'ended' ? t.ended : isSpeaking ? t.speaking : t.listening;

  return (
    <div className={cn('flex flex-col items-center gap-6 py-6 text-center', className)}>
      <div className="relative flex size-44 items-center justify-center">
        {live && isSpeaking
          ? [0, 1, 2].map((ring) => (
              <span
                key={ring}
                className="bg-primary/15 absolute inset-0 rounded-full"
                style={{ animation: `kit-call-wave 1.8s ease-out ${String(ring * 600)}ms infinite` }}
              />
            ))
          : null}
        {status === 'connecting' ? <span className="bg-primary/10 absolute inset-0 animate-ping rounded-full [animation-duration:2.4s]" /> : null}
        <span
          className={cn(
            'bg-primary text-primary-foreground relative flex size-28 items-center justify-center rounded-full text-4xl font-semibold shadow-xl transition-transform duration-300',
            live && isSpeaking && 'scale-110',
            status === 'ended' && 'bg-muted text-muted-foreground scale-90 shadow-none',
          )}
        >
          {name.trim().slice(0, 1).toUpperCase() || '?'}
        </span>
        {live && !isSpeaking ? (
          <span className="bg-background text-foreground absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full border shadow">
            <Mic className="size-4" />
            <span className="bg-emerald-500 absolute top-0 right-0 size-2.5 animate-pulse rounded-full" />
          </span>
        ) : null}
      </div>
      <div className="space-y-1">
        <p className="text-xl font-semibold">{name}</p>
        {subtitle ? <p className="text-muted-foreground text-sm">{subtitle}</p> : null}
      </div>
      <div className="space-y-1">
        <p className={cn('text-sm font-medium transition-colors', live && isSpeaking ? 'text-primary' : 'text-muted-foreground')}>{label}</p>
        <p className="text-muted-foreground text-2xl tabular-nums">{formatSeconds(seconds)}</p>
        {note ? <p className="text-muted-foreground text-xs">{note}</p> : null}
      </div>
      {onHangUp && status !== 'ended' ? (
        <Button type="button" variant="destructive" size="lg" className="rounded-full px-6" onClick={onHangUp}>
          <PhoneOff className="size-4" />
          {t.hangUp}
        </Button>
      ) : null}
    </div>
  );
}
