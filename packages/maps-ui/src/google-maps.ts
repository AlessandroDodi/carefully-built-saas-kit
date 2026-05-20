'use client';

declare global {
  interface Window {
    google?: {
      maps?: GoogleMapsNamespace;
    };
  }
}

interface GoogleMapsNamespace {
  Map?: new (
    element: HTMLDivElement,
    options?: Record<string, unknown>
  ) => GoogleMapsMapInstance;
  Marker?: new (options: GoogleMapsMarkerOptions) => GoogleMapsMarkerInstance;
  Circle?: new (options: GoogleMapsCircleOptions) => GoogleMapsCircleInstance;
  Geocoder?: new () => GoogleMapsGeocoderInstance;
  InfoWindow?: new (options?: GoogleMapsInfoWindowOptions) => GoogleMapsInfoWindowInstance;
  LatLngBounds?: new () => GoogleMapsLatLngBounds;
  Size?: new (width: number, height: number) => GoogleMapsSize;
  Point?: new (x: number, y: number) => GoogleMapsPoint;
  places?: {
    Autocomplete?: new (
      input: HTMLInputElement,
      options?: Record<string, unknown>
    ) => GoogleMapsAutocomplete;
  };
  event?: {
    clearInstanceListeners?: (instance: object) => void;
  };
}

interface GoogleMapsSize {
  readonly width: number;
  readonly height: number;
}

interface GoogleMapsPoint {
  readonly x: number;
  readonly y: number;
}

export interface GoogleMapsLatLngLiteral {
  readonly lat: number;
  readonly lng: number;
}

export interface GoogleMapsLatLngBounds {
  extend: (position: GoogleMapsLatLngLiteral) => void;
}

export type GoogleMapsMapStyle = Readonly<Record<string, unknown>>;

export interface GoogleMapsMapInstance {
  fitBounds: (bounds: GoogleMapsLatLngBounds) => void;
  setCenter: (position: GoogleMapsLatLngLiteral) => void;
  setZoom: (zoom: number) => void;
  panTo: (position: GoogleMapsLatLngLiteral) => void;
  setOptions: (options: Record<string, unknown>) => void;
  addListener: (
    eventName: 'click' | 'idle' | 'drag' | 'zoom_changed' | 'bounds_changed',
    handler: () => void
  ) => GoogleMapsMapsEventListener;
}

export interface GoogleMapsMarkerIcon {
  readonly url: string;
  readonly scaledSize?: GoogleMapsSize;
  readonly anchor?: GoogleMapsPoint;
}

export interface GoogleMapsMarkerOptions {
  readonly map: GoogleMapsMapInstance;
  readonly position: GoogleMapsLatLngLiteral;
  readonly title?: string;
  readonly icon?: GoogleMapsMarkerIcon;
}

export interface GoogleMapsCircleOptions {
  readonly map: GoogleMapsMapInstance;
  readonly center: GoogleMapsLatLngLiteral;
  readonly radius: number;
  readonly strokeColor?: string;
  readonly strokeOpacity?: number;
  readonly strokeWeight?: number;
  readonly fillColor?: string;
  readonly fillOpacity?: number;
  readonly clickable?: boolean;
}

export interface GoogleMapsMapsEventListener {
  remove?: () => void;
}

export interface GoogleMapsCircleInstance {
  setMap: (map: GoogleMapsMapInstance | null) => void;
  setCenter: (center: GoogleMapsLatLngLiteral) => void;
  setRadius: (radius: number) => void;
}

export interface GoogleMapsGeocoderResult {
  readonly geometry?: {
    readonly location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export interface GoogleMapsGeocoderInstance {
  geocode: (
    request: { readonly address: string },
    callback: (
      results: GoogleMapsGeocoderResult[] | null,
      status: string
    ) => void
  ) => void;
}

export interface GoogleMapsMarkerInstance {
  addListener: (
    eventName: 'click',
    handler: () => void
  ) => GoogleMapsMapsEventListener;
  setIcon: (icon: GoogleMapsMarkerIcon) => void;
  setMap: (map: GoogleMapsMapInstance | null) => void;
}

export interface GoogleMapsInfoWindowOptions {
  readonly content?: string | Element;
  readonly maxWidth?: number;
  readonly pixelOffset?: GoogleMapsSize;
}

export interface GoogleMapsInfoWindowInstance {
  addListener: (
    eventName: 'closeclick' | 'domready',
    handler: () => void
  ) => GoogleMapsMapsEventListener;
  setContent: (content: string | Element) => void;
  open: (options: {
    readonly anchor?: GoogleMapsMarkerInstance;
    readonly map?: GoogleMapsMapInstance;
    readonly shouldFocus?: boolean;
  }) => void;
  close: () => void;
}

export interface GoogleMapsApi {
  readonly Map: NonNullable<GoogleMapsNamespace['Map']>;
  readonly Marker: NonNullable<GoogleMapsNamespace['Marker']>;
  readonly Circle?: GoogleMapsNamespace['Circle'];
  readonly Geocoder?: GoogleMapsNamespace['Geocoder'];
  readonly InfoWindow: NonNullable<GoogleMapsNamespace['InfoWindow']>;
  readonly LatLngBounds: NonNullable<GoogleMapsNamespace['LatLngBounds']>;
  readonly Size: NonNullable<GoogleMapsNamespace['Size']>;
  readonly Point: NonNullable<GoogleMapsNamespace['Point']>;
  readonly places?: GoogleMapsNamespace['places'];
  readonly event?: GoogleMapsNamespace['event'];
}

export function getGoogleMapsApi(): GoogleMapsApi | null {
  const maps = window.google?.maps;

  if (
    !maps?.Map ||
    !maps.Marker ||
    !maps.InfoWindow ||
    !maps.LatLngBounds ||
    !maps.Size ||
    !maps.Point
  ) {
    return null;
  }

  return {
    Map: maps.Map,
    Marker: maps.Marker,
    Circle: maps.Circle,
    Geocoder: maps.Geocoder,
    InfoWindow: maps.InfoWindow,
    LatLngBounds: maps.LatLngBounds,
    Size: maps.Size,
    Point: maps.Point,
    places: maps.places,
    event: maps.event,
  };
}

export function hasGoogleMapsPlacesApi(): boolean {
  return Boolean(window.google?.maps?.places?.Autocomplete);
}

export function hasGoogleMapsCoreApi(): boolean {
  return Boolean(getGoogleMapsApi());
}

export interface GoogleMapsPlaceResult {
  readonly formatted_address?: string;
  readonly place_id?: string;
  readonly geometry?: {
    readonly location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export interface GoogleMapsAutocompleteListener {
  remove?: () => void;
}

export interface GoogleMapsAutocomplete {
  addListener: (
    eventName: 'place_changed',
    handler: () => void
  ) => GoogleMapsAutocompleteListener;
  getPlace: () => GoogleMapsPlaceResult;
}

let googleMapsScriptPromise: Promise<void> | null = null;
const GOOGLE_MAPS_READY_TIMEOUT_MS = 10000;

function buildGoogleMapsScriptUrl(apiKey: string): string {
  const params = new URLSearchParams({
    key: apiKey,
    libraries: 'places',
    loading: 'async',
  });

  return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
}

function waitForGoogleMapsAvailability(requirements: {
  readonly requireCore: boolean;
  readonly requirePlaces: boolean;
}): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const deadline = window.setTimeout(() => {
      reject(new Error('Google Maps API did not become available in time'));
    }, GOOGLE_MAPS_READY_TIMEOUT_MS);

    function checkAvailability(): void {
      const hasCoreApi = requirements.requireCore ? hasGoogleMapsCoreApi() : true;
      const hasPlacesApi = requirements.requirePlaces ? hasGoogleMapsPlacesApi() : true;

      if (hasCoreApi && hasPlacesApi) {
        window.clearTimeout(deadline);
        resolve();
        return;
      }

      window.requestAnimationFrame(checkAvailability);
    }

    checkAvailability();
  });
}

export function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key'));
  }

  if (hasGoogleMapsCoreApi()) {
    return Promise.resolve();
  }

  return ensureGoogleMapsScript(apiKey).then(() => (
    waitForGoogleMapsAvailability({ requireCore: true, requirePlaces: false })
  ));
}

function ensureGoogleMapsScript(apiKey: string): Promise<void> {
  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-places]'
    );

    if (existingScript) {
      if (existingScript.dataset.googleMapsLoaded === 'true') {
        resolve();
        return;
      }

      existingScript.addEventListener(
        'load',
        () => {
          existingScript.dataset.googleMapsLoaded = 'true';
          resolve();
        },
        { once: true }
      );
      existingScript.addEventListener(
        'error',
        () => {
          reject(new Error('Failed to load Google Maps Places API'));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = buildGoogleMapsScriptUrl(apiKey);
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsPlaces = 'true';
    script.onload = () => {
      script.dataset.googleMapsLoaded = 'true';
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps Places API'));
    };
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

export function loadGoogleMapsPlacesApi(apiKey: string): Promise<void> {
  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key'));
  }

  if (hasGoogleMapsPlacesApi()) {
    return Promise.resolve();
  }

  return ensureGoogleMapsScript(apiKey).then(() => (
    waitForGoogleMapsAvailability({ requireCore: false, requirePlaces: true })
  ));
}
