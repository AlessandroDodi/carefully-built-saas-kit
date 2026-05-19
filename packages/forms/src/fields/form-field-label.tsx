'use client';

import type { LucideIcon } from 'lucide-react';

import { Label, cn } from '@carefully-built/ui';

interface FormFieldLabelProps {
  readonly htmlFor?: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly hasError?: boolean;
  readonly required?: boolean;
}

export function FormFieldLabel({
  htmlFor,
  label,
  icon: Icon,
  hasError = false,
  required = false,
}: FormFieldLabelProps): React.ReactElement {
  return (
    <Label htmlFor={htmlFor} className={cn(hasError ? 'text-destructive' : '')}>
      {Icon ? <Icon className="size-3.5 shrink-0 text-foreground/70" strokeWidth={1.8} /> : null}
      <span>
        {label}
        {required ? <span className="ml-0.5 text-[10px] align-top text-destructive">*</span> : null}
      </span>
    </Label>
  );
}
