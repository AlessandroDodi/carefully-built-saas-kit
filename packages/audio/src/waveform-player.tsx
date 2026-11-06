'use client';

import { Button, cn, defineKitTexts, useKitTexts } from '@carefully-built/ui';
import { Loader2, Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const texts = defineKitTexts({
  en: { play: 'Play', pause: 'Pause', failed: 'The recording could not be loaded.' },
  it: { play: 'Riproduci', pause: 'Pausa', failed: 'Impossibile caricare la registrazione.' },
});

export interface WaveformSegment {
  /** Seconds. */
  readonly start: number;
  readonly end: number;
  /** Key into `colors`. */
  readonly speaker: string;
}

export interface WaveformPlayerProps {
  readonly src: string;
  /** Who speaks when; bars outside every segment use `defaultColor`. */
  readonly segments?: readonly WaveformSegment[];
  readonly colors?: Readonly<Record<string, string>>;
  readonly defaultColor?: string;
  /** Legend labels per speaker key. */
  readonly labels?: Readonly<Record<string, string>>;
  readonly bars?: number;
  readonly height?: number;
  readonly className?: string;
}

/** Peak amplitude of each of `count` equal slices of the first channel. */
async function computePeaks(src: string, count: number): Promise<{ peaks: number[]; duration: number }> {
  const response = await fetch(src);
  const buffer = await new AudioContext().decodeAudioData(await response.arrayBuffer());
  const data = buffer.getChannelData(0);
  const step = Math.max(1, Math.floor(data.length / count));
  const peaks = Array.from({ length: count }, (_, index) => {
    let peak = 0;
    const from = index * step;
    for (let i = from; i < from + step && i < data.length; i += 1) {
      const value = Math.abs(data[i] ?? 0);
      if (value > peak) peak = value;
    }
    return peak;
  });
  const max = Math.max(0.01, ...peaks);
  return { peaks: peaks.map((peak) => peak / max), duration: buffer.duration };
}

function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}

/**
 * A recording as bars you can click to seek, each coloured by who is
 * speaking at that moment (from the transcript timing), with the played part
 * at full strength and the rest dimmed.
 */
export function WaveformPlayer({
  src,
  segments = [],
  colors = {},
  defaultColor = 'var(--muted-foreground)',
  labels,
  bars = 96,
  height = 56,
  className,
}: WaveformPlayerProps): React.ReactElement {
  const t = useKitTexts(texts);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPeaks(null);
    setFailed(false);
    computePeaks(src, bars)
      .then((result) => {
        if (cancelled) return;
        setPeaks(result.peaks);
        setDuration(result.duration);
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [src, bars]);

  const speakerAt = useMemo(() => {
    return (time: number): string | undefined => segments.find((segment) => time >= segment.start && time < segment.end)?.speaker;
  }, [segments]);

  async function toggle(): Promise<void> {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    await audio.play();
  }

  function seek(fraction: number): void {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = fraction * duration;
    setCurrent(audio.currentTime);
  }

  const progress = duration ? current / duration : 0;
  const legend = Object.keys(colors).filter((key) => labels?.[key]);

  if (failed) {
    return <p className="text-muted-foreground text-sm">{t.failed}</p>;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={(event) => { setCurrent(event.currentTarget.currentTime); }}
        onPlay={() => { setPlaying(true); }}
        onPause={() => { setPlaying(false); }}
        onEnded={() => { setPlaying(false); }}
      />
      <div className="flex items-center gap-3">
        <Button type="button" size="icon-sm" variant={playing ? 'default' : 'outline'} aria-label={playing ? t.pause : t.play} disabled={!peaks} onClick={() => void toggle()}>
          {!peaks ? <Loader2 className="size-4 animate-spin" /> : playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          className="flex flex-1 cursor-pointer items-center gap-px"
          style={{ height }}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            seek((event.clientX - rect.left) / rect.width);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') seek(Math.min(1, progress + 0.05));
            if (event.key === 'ArrowLeft') seek(Math.max(0, progress - 0.05));
          }}
        >
          {(peaks ?? Array.from({ length: bars }, () => 0.15)).map((peak, index) => {
            const fraction = (index + 0.5) / bars;
            const speaker = speakerAt(fraction * duration);
            const color = (speaker && colors[speaker]) || defaultColor;
            const played = fraction <= progress;
            return (
              <span
                key={index}
                className="flex-1 rounded-full transition-[opacity,height] duration-200"
                style={{
                  height: `${String(Math.max(8, peak * 100))}%`,
                  backgroundColor: color,
                  opacity: peaks ? (played ? 1 : 0.35) : 0.2,
                  animation: peaks ? undefined : 'pulse 1.5s ease-in-out infinite',
                }}
              />
            );
          })}
        </div>
        <span className="text-muted-foreground w-[5.5rem] shrink-0 text-right text-xs tabular-nums">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>
      {legend.length > 0 ? (
        <div className="text-muted-foreground flex gap-4 pl-11 text-xs">
          {legend.map((key) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: colors[key] }} />
              {labels?.[key]}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
