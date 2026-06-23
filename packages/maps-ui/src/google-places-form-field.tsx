'use client';

import type { LucideIcon } from 'lucide-react';
import { MapPinned } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { FieldValues, Path } from 'react-hook-form';

import { FormFieldLabel } from '@carefully-built/forms';
import { Input } from '@carefully-built/ui';

import { loadGoogleMapsPlacesApi } from './google-maps';
import { normalizePlaceSelection } from './google-places-address-input';

export interface GoogleAddressComponent {
  readonly long_name: string;
  readonly short_name: string;
  readonly types: readonly string[];
}

export interface GooglePlaceSelection {
  readonly addressComponents?: readonly GoogleAddressComponent[];
  readonly formattedAddress?: string;
  readonly placeId?: string;
}

export interface GooglePlacesFormFieldProps<TValues extends FieldValues> {
  readonly addressName: Path<TValues>;
  readonly placeIdName: Path<TValues>;
  readonly latitudeName: Path<TValues>;
  readonly longitudeName: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly componentCountry?: string;
  readonly apiKey?: string;
  readonly onPlaceSelected?: (place: GooglePlaceSelection) => void;
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

export function GooglePlacesFormField<TValues extends FieldValues>({
  addressName,
  placeIdName,
  latitudeName,
  longitudeName,
  label = 'Address',
  labelIcon = MapPinned,
  placeholder = 'Address',
  componentCountry,
  apiKey = getDefaultGoogleMapsApiKey(),
  onPlaceSelected,
}: GooglePlacesFormFieldProps<TValues>): React.ReactElement {
  const { control, getFieldState, setValue } = useFormContext<TValues>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!apiKey || !inputRef.current) {
      return undefined;
    }

    let cancelled = false;
    let listener: { remove?: () => void } | null = null;
    let autocomplete: {
      addListener: (eventName: 'place_changed', handler: () => void) => { remove?: () => void };
      getPlace: () => {
        address_components?: readonly GoogleAddressComponent[];
        formatted_address?: string;
        place_id?: string;
        geometry?: {
          location?: {
            lat: () => number;
            lng: () => number;
          };
        };
      };
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
          ...(componentCountry ? { componentRestrictions: { country: componentCountry } } : {}),
          fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
          types: ['address'],
        });

        listener = autocomplete.addListener('place_changed', () => {
          const selectedPlace = autocomplete?.getPlace();
          const normalizedSelection = normalizePlaceSelection({
            address: selectedPlace?.formatted_address ?? inputRef.current?.value ?? '',
            placeId: selectedPlace?.place_id ?? '',
            latitude: selectedPlace?.geometry?.location?.lat?.(),
            longitude: selectedPlace?.geometry?.location?.lng?.(),
          });

          setValue(addressName, normalizedSelection.address as TValues[typeof addressName], {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue(placeIdName, normalizedSelection.googlePlaceId as TValues[typeof placeIdName], {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue(latitudeName, normalizedSelection.latitude as TValues[typeof latitudeName], {
            shouldDirty: true,
          });
          setValue(longitudeName, normalizedSelection.longitude as TValues[typeof longitudeName], {
            shouldDirty: true,
          });
          onPlaceSelected?.({
            addressComponents: selectedPlace?.address_components,
            formattedAddress: selectedPlace?.formatted_address,
            placeId: selectedPlace?.place_id,
          });
        });
      })
      .catch(() => {
        // Keep the field usable even if Places cannot initialize.
      });

    return () => {
      cancelled = true;
      listener?.remove?.();
      if (autocomplete && window.google?.maps?.event?.clearInstanceListeners) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [
    addressName,
    apiKey,
    componentCountry,
    latitudeName,
    longitudeName,
    onPlaceSelected,
    placeIdName,
    setValue,
  ]);

  return (
    <Controller
      name={addressName}
      control={control}
      render={({ field, fieldState: { error: addressError } }) => {
        const placeIdError = getFieldState(placeIdName).error;
        const error = addressError ?? placeIdError;

        return (
          <div className="space-y-2">
            <FormFieldLabel
              htmlFor={addressName}
              label={label}
              icon={labelIcon}
              hasError={Boolean(error)}
            />
            <div className="relative">
              <MapPinned className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/70" />
              <Input
                {...field}
                id={addressName}
                placeholder={placeholder}
                className={cx('pl-9', error ? 'border-destructive' : false)}
                ref={(instance) => {
                  field.ref(instance);
                  inputRef.current = instance;
                }}
                value={typeof field.value === 'string' ? field.value : ''}
                autoComplete="off"
                onChange={(event) => {
                  field.onChange(event.target.value);
                  setValue(placeIdName, '' as TValues[typeof placeIdName], {
                    shouldDirty: true,
                    shouldValidate: false,
                  });
                  setValue(latitudeName, undefined as TValues[typeof latitudeName], {
                    shouldDirty: true,
                  });
                  setValue(longitudeName, undefined as TValues[typeof longitudeName], {
                    shouldDirty: true,
                  });
                }}
                onBlur={field.onBlur}
              />
            </div>
            {error?.message ? <p className="text-sm text-destructive">{error.message}</p> : null}
          </div>
        );
      }}
    />
  );
}
