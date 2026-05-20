# @carefully-built/maps-ui

Reusable Google Maps UI, map themes, and attribution helpers for Carefully Built apps.

## Install

```bash
bun add @carefully-built/maps-ui
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/maps-ui`

## Component Usage

```tsx
import { GoogleMapsPhotoAttribution } from '@carefully-built/maps-ui';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `GoogleMapsPhotoAttribution`: import from `@carefully-built/maps-ui`.
- `GooglePlacesFormField`: import from `@carefully-built/maps-ui`.

## Helper Usage

```ts
import { getGoogleMapsApi } from '@carefully-built/maps-ui';
```

Helpers in this package:

- `getGoogleMapsApi`
- `GOOGLE_MAP_THEME_STYLES`
- `hasGoogleMapsCoreApi`
- `hasGoogleMapsPlacesApi`
- `loadGoogleMapsApi`
- `loadGoogleMapsPlacesApi`
- `normalizePlaceSelection`

## Types And Schemas

- `GoogleAddressComponent`
- `GoogleMapsApi`
- `GoogleMapsAutocomplete`
- `GoogleMapsAutocompleteListener`
- `GoogleMapsCircleInstance`
- `GoogleMapsCircleOptions`
- `GoogleMapsGeocoderInstance`
- `GoogleMapsGeocoderResult`
- `GoogleMapsInfoWindowInstance`
- `GoogleMapsInfoWindowOptions`
- `GoogleMapsLatLngBounds`
- `GoogleMapsLatLngLiteral`
- `GoogleMapsMapInstance`
- `GoogleMapsMapsEventListener`
- `GoogleMapsMapStyle`
- `GoogleMapsMarkerIcon`
- `GoogleMapsMarkerInstance`
- `GoogleMapsMarkerOptions`
- `GoogleMapsPhotoAttributionRecord`
- `GoogleMapsPlaceResult`
- `GooglePlacesAddressInput`
- `GooglePlacesAddressInputProps`
- `GooglePlaceSelection`
- `GooglePlacesFormFieldProps`
- `NormalizedPlaceValue`
- `SelectedPlaceValue`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `GoogleMapsPhotoAttribution` | Component | `packages/maps-ui/src/google-maps-photo-attribution.tsx` |
| `GooglePlacesFormField` | Component | `packages/maps-ui/src/google-places-form-field.tsx` |
| `getGoogleMapsApi` | Helper | `packages/maps-ui/src/google-maps.ts` |
| `GOOGLE_MAP_THEME_STYLES` | Helper | `packages/maps-ui/src/google-map-theme-styles.ts` |
| `hasGoogleMapsCoreApi` | Helper | `packages/maps-ui/src/google-maps.ts` |
| `hasGoogleMapsPlacesApi` | Helper | `packages/maps-ui/src/google-maps.ts` |
| `loadGoogleMapsApi` | Helper | `packages/maps-ui/src/google-maps.ts` |
| `loadGoogleMapsPlacesApi` | Helper | `packages/maps-ui/src/google-maps.ts` |
| `normalizePlaceSelection` | Helper | `packages/maps-ui/src/google-places-address-input.tsx` |
| `GoogleAddressComponent` | Type | `packages/maps-ui/src/google-places-form-field.tsx` |
| `GoogleMapsApi` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsAutocomplete` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsAutocompleteListener` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsCircleInstance` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsCircleOptions` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsGeocoderInstance` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsGeocoderResult` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsInfoWindowInstance` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsInfoWindowOptions` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsLatLngBounds` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsLatLngLiteral` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsMapInstance` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsMapsEventListener` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsMapStyle` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsMarkerIcon` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsMarkerInstance` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsMarkerOptions` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GoogleMapsPhotoAttributionRecord` | Type | `packages/maps-ui/src/google-maps-photo-attribution.tsx` |
| `GoogleMapsPlaceResult` | Type | `packages/maps-ui/src/google-maps.ts` |
| `GooglePlacesAddressInput` | Type | `packages/maps-ui/src/google-places-address-input.tsx` |
| `GooglePlacesAddressInputProps` | Type | `packages/maps-ui/src/google-places-address-input.tsx` |
| `GooglePlaceSelection` | Type | `packages/maps-ui/src/google-places-form-field.tsx` |
| `GooglePlacesFormFieldProps` | Type | `packages/maps-ui/src/google-places-form-field.tsx` |
| `NormalizedPlaceValue` | Type | `packages/maps-ui/src/google-places-address-input.tsx` |
| `SelectedPlaceValue` | Type | `packages/maps-ui/src/google-places-address-input.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
