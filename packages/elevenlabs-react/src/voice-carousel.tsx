'use client';

import { Button, cn, defineKitTexts, useKitTexts } from '@carefully-built/ui';
import { Check, ChevronLeft, ChevronRight, Loader2, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const texts = defineKitTexts({
  en: { play: 'Listen to a sample', pause: 'Stop', selected: 'Selected', previous: 'Previous voices', next: 'Next voices', male: 'Male', female: 'Female', neutral: 'Neutral' },
  it: { play: 'Ascolta un esempio', pause: 'Ferma', selected: 'Selezionata', previous: 'Voci precedenti', next: 'Voci successive', male: 'Maschile', female: 'Femminile', neutral: 'Neutra' },
});

export interface VoiceCardData {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly gender?: 'male' | 'female' | 'neutral' | null;
  /** Short facts shown as tags, e.g. "Adulta", "Italiano". */
  readonly tags?: readonly string[];
}

export interface VoiceCarouselProps {
  readonly voices: readonly VoiceCardData[];
  readonly value: string;
  readonly onChange: (voiceId: string) => void;
  /** Resolves the audio URL of a sample for a voice; called when the user presses play. */
  readonly getSampleUrl: (voiceId: string) => Promise<string>;
  readonly disabled?: boolean;
  readonly className?: string;
}

const GENDER_GRADIENT: Record<NonNullable<VoiceCardData['gender']>, string> = {
  female: 'from-fuchsia-500 via-pink-500 to-orange-400',
  male: 'from-sky-500 via-blue-600 to-indigo-600',
  neutral: 'from-emerald-500 via-teal-500 to-cyan-500',
};

/** Readable gender chip: pink for female, blue for male. */
const GENDER_CHIP: Record<NonNullable<VoiceCardData['gender']>, string> = {
  female: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  male: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  neutral: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
};

/** Twelve bars that dance while a sample plays; hidden otherwise. */
function Equalizer({ active }: { readonly active: boolean }): React.ReactElement {
  return (
    <span className={cn('flex h-5 items-end gap-[3px] transition-opacity duration-300', active ? 'opacity-100' : 'opacity-0')} aria-hidden>
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          className={cn('w-[3px] rounded-full bg-current transition-[height] duration-300', active ? 'animate-[kit-eq_900ms_ease-in-out_infinite]' : 'h-1')}
          style={active ? { animationDelay: `${String((index * 97) % 500)}ms`, height: `${String(30 + ((index * 37) % 70))}%` } : undefined}
        />
      ))}
    </span>
  );
}

/**
 * Pick a voice the way you would in a voice library: cards in a snapping
 * horizontal rail, the chosen one lifted, each with its own play button that
 * speaks a sample. One sample plays at a time.
 */
export function VoiceCarousel({ voices, value, onChange, getSampleUrl, disabled = false, className }: VoiceCarouselProps): React.ReactElement {
  const t = useKitTexts(texts);
  const railRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  // Center the chosen card by scrolling the rail only: scrollIntoView would also scroll the sheet around it.
  useEffect(() => {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(`[data-voice-id="${CSS.escape(value)}"]`);
    if (!rail || !card) return;
    const offset = card.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    rail.scrollTo({ left: rail.scrollLeft + offset - (rail.clientWidth - card.offsetWidth) / 2 });
  }, [value]);

  function stop(): void {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(null);
  }

  async function toggle(voiceId: string): Promise<void> {
    if (playing === voiceId) {
      stop();
      return;
    }
    stop();
    setLoading(voiceId);
    try {
      const url = await getSampleUrl(voiceId);
      const audio = new Audio(url);
      audio.onended = () => { setPlaying(null); };
      audioRef.current = audio;
      await audio.play();
      setPlaying(voiceId);
    } catch {
      setPlaying(null);
    } finally {
      setLoading(null);
    }
  }

  function scrollBy(direction: -1 | 1): void {
    railRef.current?.scrollBy({ left: direction * 240, behavior: 'smooth' });
  }

  return (
    <div className={cn('relative w-full max-w-full min-w-0', className)}>
      <div
        ref={railRef}
        className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-1 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {voices.map((voice, index) => {
          const isSelected = voice.id === value;
          const isPlaying = playing === voice.id;
          const gender = voice.gender ?? 'neutral';
          return (
            <div
              key={voice.id}
              data-voice-id={voice.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              onClick={() => { if (!disabled) onChange(voice.id); }}
              onKeyDown={(event) => {
                if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  onChange(voice.id);
                }
              }}
              className={cn(
                'bg-card group relative flex w-52 shrink-0 cursor-pointer snap-center flex-col gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ease-out',
                'animate-in fade-in-0 slide-in-from-right-4 fill-mode-both',
                isSelected ? 'border-foreground ring-foreground/10 -translate-y-1 shadow-lg ring-4' : 'border-border hover:-translate-y-0.5 hover:shadow-md',
                disabled && 'cursor-not-allowed opacity-60',
              )}
              style={{ animationDelay: `${String(index * 60)}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn('flex size-11 items-center justify-center rounded-full bg-gradient-to-br text-base font-semibold text-white shadow-inner transition-transform duration-300', GENDER_GRADIENT[gender], isPlaying && 'scale-110')}
                  aria-hidden
                >
                  {voice.name.slice(0, 1).toUpperCase()}
                </span>
                {isSelected ? (
                  <span className="bg-foreground text-background flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
                    <Check className="size-3" />
                    {t.selected}
                  </span>
                ) : null}
              </div>
              <div className="min-h-0 space-y-1">
                <p className="text-foreground truncate text-sm font-semibold">{voice.name}</p>
                <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">{voice.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 text-[11px] font-medium">
                {voice.gender ? <span className={cn('rounded-full px-2 py-0.5', GENDER_CHIP[voice.gender])}>{t[voice.gender]}</span> : null}
                {(voice.tags ?? []).map((tag) => (
                  <span key={tag} className="bg-muted text-muted-foreground rounded-full px-2 py-0.5">{tag}</span>
                ))}
              </div>
              <div className={cn('mt-auto flex items-center justify-between gap-2 pt-1', isPlaying ? 'text-foreground' : 'text-muted-foreground')}>
                <Equalizer active={isPlaying} />
                <Button
                  type="button"
                  size="icon-sm"
                  variant={isPlaying ? 'default' : 'outline'}
                  aria-label={isPlaying ? t.pause : t.play}
                  disabled={disabled || loading !== null}
                  onClick={(event) => {
                    event.stopPropagation();
                    void toggle(voice.id);
                  }}
                >
                  {loading === voice.id ? <Loader2 className="size-4 animate-spin" /> : isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {voices.length > 2 ? (
        <>
          <Button type="button" size="icon-sm" variant="outline" aria-label={t.previous} className="bg-background absolute top-1/2 left-1 -translate-y-1/2 rounded-full shadow" onClick={() => { scrollBy(-1); }}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button type="button" size="icon-sm" variant="outline" aria-label={t.next} className="bg-background absolute top-1/2 right-1 -translate-y-1/2 rounded-full shadow" onClick={() => { scrollBy(1); }}>
            <ChevronRight className="size-4" />
          </Button>
        </>
      ) : null}
    </div>
  );
}
