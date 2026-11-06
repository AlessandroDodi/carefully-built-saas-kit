'use client';

import { getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input';
import { Controller, useFormContext } from 'react-hook-form';
import { useState } from 'react';

import type { FieldValues, Path } from 'react-hook-form';

import { CountryPhoneInput } from './country-phone-input';

// The library's country type, without depending on libphonenumber-js directly.
type CountryCode = Parameters<typeof getCountryCallingCode>[0];

interface CustomPhoneFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  /** ISO country preselected while the field is empty. */
  readonly defaultCountry?: CountryCode;
  readonly disabled?: boolean;
  readonly className?: string;
}

/**
 * While the number is still too short to parse (`+393`), only the selected
 * country's prefix is stripped, so the digits being typed are never eaten.
 */
function splitValue(value: string, fallback: CountryCode): { country: CountryCode; local: string } {
  const parsed = value ? parsePhoneNumber(value) : undefined;
  if (parsed?.country) {
    return { country: parsed.country, local: parsed.nationalNumber };
  }
  const prefix = `+${getCountryCallingCode(fallback)}`;
  const local = value.startsWith(prefix) ? value.slice(prefix.length) : value;
  return { country: fallback, local: local.replace(/\D/g, '') };
}

function joinValue(country: CountryCode, local: string): string {
  const digits = local.replace(/\D/g, '');
  return digits ? `+${getCountryCallingCode(country)}${digits}` : '';
}

/**
 * Country prefix + local number, stored as one E.164 string (`+39333…`).
 * The country is remembered while the number is empty, so switching it before
 * typing works as expected.
 */
export function CustomPhoneField<TValues extends FieldValues>({
  name,
  label,
  placeholder,
  required = false,
  defaultCountry = 'IT',
  className,
}: CustomPhoneFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();
  const [country, setCountry] = useState<CountryCode>(defaultCountry);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = typeof field.value === 'string' ? field.value : '';
        const current = splitValue(value, country);
        return (
          <div className={className}>
            <CountryPhoneInput
              label={label}
              required={required}
              placeholder={placeholder}
              countryCode={current.country}
              localNumber={current.local}
              localNumberId={name}
              error={error?.message}
              onCountryCodeChange={(next) => {
                setCountry(next as CountryCode);
                field.onChange(joinValue(next as CountryCode, current.local));
              }}
              onLocalNumberChange={(next) => field.onChange(joinValue(current.country, next))}
            />
          </div>
        );
      }}
    />
  );
}
