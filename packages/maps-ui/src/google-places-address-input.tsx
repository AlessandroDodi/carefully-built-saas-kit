'use client';

import { MapPinned } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { FormFieldLabel } from '@carefully-built/forms';
import { Input } from '@carefully-built/ui';

import { loadGoogleMapsPlacesApi } from './google-maps';

export interface NormalizedPlaceValue {
  readonly address: string;
  readonly googlePlaceId: string;
  readonly latitude?: number;
  readonly longitude?: number;
}

export interface GooglePlacesAddressInputProps {
  readonly id: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly onPlaceSelect: (place: NormalizedPlaceValue) => void;
  readonly label?: string;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly className?: string;
  readonly inputClassName?: string;
  readonly error?: string;
  readonly componentCountry?: string;
  readonly apiKey?: string;
}

interface GooglePlaceResult {
  readonly formatted_address?: string;
  readonly place_id?: string;
  readonly geometry?: {
    readonly location?: {
      readonly lat: () => number;
      readonly lng: () => number;
    };
  };
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function getDefaultGoogleMapsApiKey(): string {
  return (
    (globalThis as { readonly process?: { readonly env?: Record<string, string | undefined> } })
      .process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  );
}

export interface SelectedPlaceValue {
  readonly address: string;
  readonly placeId: string;
  readonly latitude?: number;
  readonly longitude?: number;
}

export function normalizePlaceSelection(place: SelectedPlaceValue): NormalizedPlaceValue {
  return {
    address: place.address,
    googlePlaceId: place.placeId,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

export function GooglePlacesAddressInput({
  id,
  value,
  onValueChange,
  onPlaceSelect,
  label = 'Indirizzo',
  required = false,
  placeholder = 'Cerca su Google Maps',
  className,
  inputClassName,
  error,
  componentCountry = 'it',
  apiKey = getDefaultGoogleMapsApiKey(),
}: GooglePlacesAddressInputProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!apiKey || !inputRef.current) {
      return undefined;
    }

    let cancelled = false;
    let listener: { remove?: () => void } | null = null;
    let autocomplete: {
      addListener: (eventName: 'place_changed', handler: () => void) => { remove?: () => void };
      getPlace: () => GooglePlaceResult;
    } | null = null;

    void loadGoogleMapsPlacesApi(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current) {
          return;
        }

        const Autocomplete = window.google?.maps?.places?.Autocomplete;
        if (!Autocomplete) {
          return;
        }

        autocomplete = new Autocomplete(inputRef.current, {
          componentRestrictions: { country: componentCountry },
          fields: ['formatted_address', 'geometry', 'place_id'],
          types: ['address'],
        });

        listener = autocomplete.addListener('place_changed', () => {
          const selectedPlace = autocomplete?.getPlace();
          const normalizedSelection = normalizePlaceSelection({
            address: selectedPlace?.formatted_address ?? inputRef.current?.value ?? '',
            placeId: selectedPlace?.place_id ?? '',
            latitude: selectedPlace?.geometry?.location?.lat(),
            longitude: selectedPlace?.geometry?.location?.lng(),
          });

          onValueChange(normalizedSelection.address);
          onPlaceSelect(normalizedSelection);
        });
      })
      .catch(() => {
        // Keep the input usable when Google Places is unavailable.
      });

    return () => {
      cancelled = true;
      listener?.remove?.();
      if (autocomplete && window.google?.maps?.event?.clearInstanceListeners) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [apiKey, componentCountry, onPlaceSelect, onValueChange]);

  return (
    <div className={cx('space-y-2', className)}>
      <FormFieldLabel
        htmlFor={id}
        label={label}
        icon={MapPinned}
        hasError={Boolean(error)}
        required={required}
      />
      <div className="relative">
        <MapPinned className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/70" />
        <Input
          id={id}
          ref={inputRef}
          value={value}
          placeholder={placeholder}
          className={cx('pl-9', error ? 'border-destructive' : false, inputClassName)}
          autoComplete="off"
          onChange={(event) => {
            onValueChange(event.target.value);
            onPlaceSelect({
              address: event.target.value,
              googlePlaceId: '',
              latitude: undefined,
              longitude: undefined,
            });
          }}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
