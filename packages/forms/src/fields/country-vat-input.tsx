'use client';

import { Landmark } from 'lucide-react';
import { useMemo } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { getCountries } from 'react-phone-number-input';

import { FormFieldLabel } from './form-field-label';

import { Input } from '@carefully-built/ui';
import { SearchableSelect } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface CountryVatInputProps {
  readonly countryCode: string;
  readonly vatNumber: string;
  readonly onCountryCodeChange: (value: string) => void;
  readonly onVatNumberChange: (value: string) => void;
  readonly label?: string;
  readonly className?: string;
  readonly countryLocale?: string;
  readonly countryPlaceholder?: string;
  readonly countrySearchPlaceholder?: string;
  readonly vatNumberId?: string;
  readonly placeholder?: string;
}

interface VatCountryOption {
  readonly value: string;
  readonly label: string;
  readonly searchText: string;
}

function getVatCountryOptions(locale = 'en-US'): VatCountryOption[] {
  const displayNames = typeof Intl.DisplayNames !== 'undefined'
    ? new Intl.DisplayNames([locale], { type: 'region' })
    : null;

  return getCountries()
    .map((countryIso) => {
      const label = displayNames?.of(countryIso) ?? countryIso;

      return {
        value: countryIso,
        label,
        searchText: `${label} ${countryIso}`,
      };
    })
    .sort((left, right) => left.label.localeCompare(right.label, locale));
}

export function CountryVatInput({
  countryCode,
  vatNumber,
  onCountryCodeChange,
  onVatNumberChange,
  label = 'VAT number',
  className,
  countryLocale = 'en-US',
  countryPlaceholder = 'Country',
  countrySearchPlaceholder = 'Search country...',
  vatNumberId,
  placeholder = '04013210355',
}: CountryVatInputProps): React.ReactElement {
  const countryOptions = useMemo(() => getVatCountryOptions(countryLocale), [countryLocale]);

  return (
    <div className={cn('space-y-2', className)}>
      <FormFieldLabel label={label} icon={Landmark} />
      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-2">
        <SearchableSelect
          value={countryCode || 'IT'}
          onValueChange={onCountryCodeChange}
          placeholder={countryPlaceholder}
          className="w-full"
          searchPlaceholder={countrySearchPlaceholder}
          options={countryOptions}
          renderValue={(selectedCountry) => (
            <span className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={selectedCountry.value}
                svg
                aria-label={selectedCountry.label}
                style={{ width: '1rem', height: '1rem', borderRadius: '999px' }}
              />
              <span>{selectedCountry.value}</span>
            </span>
          )}
          renderOption={(option) => (
            <span className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={option.value}
                svg
                aria-label={option.label}
                style={{ width: '1rem', height: '1rem', borderRadius: '999px' }}
              />
              <span className="truncate">{option.label}</span>
              <span className="text-muted-foreground">{option.value}</span>
            </span>
          )}
        />
        <Input
          id={vatNumberId}
          value={vatNumber}
          placeholder={placeholder}
          inputMode="text"
          onChange={(event) => {
            onVatNumberChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
}
