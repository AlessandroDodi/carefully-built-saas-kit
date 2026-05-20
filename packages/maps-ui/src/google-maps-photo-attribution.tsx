'use client';

export interface GoogleMapsPhotoAttributionRecord {
  readonly displayName: string;
  readonly uri?: string;
}

interface GoogleMapsPhotoAttributionProps {
  readonly attributions: readonly GoogleMapsPhotoAttributionRecord[];
  readonly className?: string;
  readonly interactive?: boolean;
  readonly compact?: boolean;
  readonly variant?: 'full' | 'badge';
}

export function GoogleMapsPhotoAttribution({
  attributions,
  className,
  interactive = false,
  compact = false,
  variant = 'full',
}: GoogleMapsPhotoAttributionProps): React.ReactElement {
  const validAttributions = attributions.filter(
    (attribution) => attribution.displayName.trim().length > 0
  );

  if (variant === 'badge') {
    return (
      <div
        className={[
          'text-[10px] font-medium uppercase tracking-[0.12em] text-white/50',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        Google
      </div>
    );
  }

  return (
    <div
      className={[
          'text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1',
          compact ? 'text-[10px] leading-4' : 'text-xs leading-4',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
    >
      <span translate="no" className="font-medium">
        Google Maps
      </span>
      {validAttributions.length > 0 ? <span aria-hidden="true">·</span> : null}
      {validAttributions.length > 0 ? <span>Foto di</span> : null}
      {validAttributions.map((attribution, index) => {
        const name = attribution.displayName.trim();
        const key = `${name}-${attribution.uri ?? index}`;

        if (interactive && attribution?.uri) {
          return (
            <a
              key={key}
              href={attribution.uri}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {name}
            </a>
          );
        }

        return (
          <span key={key}>
            {name}
          </span>
        );
      })}
    </div>
  );
}
