'use client';

import { Phone } from 'lucide-react';
import { useMemo } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';

import { FormFieldLabel } from './form-field-label';

import { Input } from '@carefully-built/ui';
import { SearchableSelect } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface CountryPhoneInputProps {
  readonly countryCode: string;
  readonly localNumber: string;
  readonly onCountryCodeChange: (value: string) => void;
  readonly onLocalNumberChange: (value: string) => void;
  readonly label?: string;
  readonly required?: boolean;
  readonly className?: string;
  readonly localNumberId?: string;
  readonly placeholder?: string;
  readonly error?: string;
}

interface PhoneCountryOption {
  readonly value: string;
  readonly label: string;
  readonly callingCode: string;
  readonly searchText: string;
}

export function getPhoneCountryOptions(locale = 'en-US'): PhoneCountryOption[] {
  const displayNames = typeof Intl.DisplayNames !== 'undefined'
    ? new Intl.DisplayNames([locale], { type: 'region' })
    : null;

  return getCountries()
    .map((countryIso) => {
      const label = displayNames?.of(countryIso) ?? countryIso;
      const callingCode = `+${getCountryCallingCode(countryIso)}`;

      return {
        value: countryIso,
        label,
        callingCode,
        searchText: `${label} ${callingCode}`,
      };
    })
    .sort((left, right) => left.label.localeCompare(right.label, locale));
}

function CountryOptionContent({
  countryCode,
  label,
  callingCode,
}: {
  readonly countryCode: string;
  readonly label: string;
  readonly callingCode: string;
}): React.ReactElement {
  return (
    <span className="flex items-center gap-2">
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        aria-label={label}
        style={{ width: '1rem', height: '1rem', borderRadius: '999px' }}
      />
      <span className="truncate">{label}</span>
      <span className="text-muted-foreground">{callingCode}</span>
    </span>
  );
}

export function CountryPhoneInput({
  countryCode,
  localNumber,
  onCountryCodeChange,
  onLocalNumberChange,
  label = 'Phone',
  required = false,
  className,
  localNumberId,
  placeholder = '392 0178571',
  error,
}: CountryPhoneInputProps): React.ReactElement {
  const countryOptions = useMemo(() => getPhoneCountryOptions('en-US'), []);

  return (
    <div className={cn('space-y-2', className)}>
      <FormFieldLabel label={label} icon={Phone} hasError={Boolean(error)} required={required} />
      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-2">
        <SearchableSelect
          value={countryCode || 'IT'}
          onValueChange={onCountryCodeChange}
          placeholder="Country"
          className="w-full"
          searchPlaceholder="Search country or prefix..."
          options={countryOptions}
          renderValue={(selectedCountry) => (
            <span className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={selectedCountry.value}
                svg
                aria-label={selectedCountry.label}
                style={{ width: '1rem', height: '1rem', borderRadius: '999px' }}
              />
              <span>{selectedCountry.callingCode}</span>
            </span>
          )}
          renderOption={(option) => (
            <CountryOptionContent
              countryCode={option.value}
              label={option.label}
              callingCode={option.callingCode}
            />
          )}
        />
        <div className="space-y-2">
          <Input
            id={localNumberId}
            value={localNumber}
            placeholder={placeholder}
            inputMode="tel"
            className={error ? 'border-destructive' : ''}
            onChange={(event) => {
              onLocalNumberChange(event.target.value);
            }}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
