'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { FieldValues, Path } from 'react-hook-form';

import { Button, Input, Label, cn } from '@carefully-built/ui';

import { FieldMessage } from './field-message';

interface CustomPasswordFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly autoComplete?: string;
  readonly className?: string;
}

export function CustomPasswordField<TValues extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  autoFocus = false,
  autoComplete = 'current-password',
  className,
}: CustomPasswordFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label ? (
            <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
              {label}
            </Label>
          ) : null}
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              className={cn('pr-10', error ? 'border-destructive' : '')}
              value={field.value ?? ''}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground size-4" />
              ) : (
                <Eye className="text-muted-foreground size-4" />
              )}
              <span className="sr-only">{showPassword ? 'Nascondi password' : 'Mostra password'}</span>
            </Button>
          </div>
          <FieldMessage message={error?.message} />
        </div>
      )}
    />
  );
}
