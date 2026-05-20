import { cn } from '@carefully-built/ui';
import { type SuperAdminPlan, type SuperAdminStatus } from './types';
import { getOrganizationInitials } from './logo';

type MetricIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const planClassName: Record<SuperAdminPlan, string> = {
  enterprise: 'border-[#e9d4ff] bg-[#faf5ff] text-[#8200db]',
  professional: 'border-[#bedbff] bg-[#eff6ff] text-[#1447e6]',
  starter: 'border-[#b9f8cf] bg-[#f0fdf4] text-[#008236]',
  free: 'border-[#e5e7eb] bg-[#f9fafb] text-[#364153]',
};

const statusClassName: Record<SuperAdminStatus, string> = {
  attivo: 'border-[#b9f8cf] bg-[#f0fdf4] text-[#008236]',
  prova: 'border-[#fff085] bg-[#fefce8] text-[#a65f00]',
  sospeso: 'border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]',
};

export function DataWarning({ message }: { readonly message?: string }): React.ReactElement | null {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
      {message}
    </div>
  );
}

export function Badge({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-lg border px-2 text-xs leading-4 font-medium',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PlanBadge({ plan }: { readonly plan: SuperAdminPlan | null }): React.ReactElement {
  if (!plan) {
    return <Badge className="border-[#e5e7eb] bg-[#f9fafb] text-[#364153]">Non impostato</Badge>;
  }

  return <Badge className={planClassName[plan]}>{plan}</Badge>;
}

export function StatusBadge({
  status,
}: {
  readonly status: SuperAdminStatus | null;
}): React.ReactElement {
  if (!status) {
    return <Badge className="border-[#e5e7eb] bg-[#f9fafb] text-[#364153]">Non impostato</Badge>;
  }

  return <Badge className={statusClassName[status]}>{status}</Badge>;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  readonly icon?: MetricIcon;
  readonly label: string;
  readonly value: string | number;
  readonly description?: string;
}): React.ReactElement {
  return (
    <div className="rounded-xl border border-[#e6eef4] bg-white p-3">
      <div className="flex min-w-0 items-center gap-[3px] text-[13px] text-black/55">
        {Icon ? <Icon className="size-3.5 shrink-0" strokeWidth={1.75} /> : null}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 text-2xl leading-5 font-medium tracking-normal text-[#242529]">
        {value}
      </div>
      {description ? <div className="mt-2 text-xs text-[#6a7282]">{description}</div> : null}
    </div>
  );
}

export function OrganizationLogoMark({
  logoUrl,
  name,
  size = 'md',
}: {
  readonly logoUrl: string | null;
  readonly name: string;
  readonly size?: 'md' | 'lg';
}): React.ReactElement {
  const sizeClassName = size === 'lg' ? 'size-12 rounded-xl' : 'size-9 rounded-lg';

  if (logoUrl) {
    return (
      <div
        className={cn(
          'relative shrink-0 overflow-hidden border border-[#e5e7eb] bg-white',
          sizeClassName,
        )}
      >
        <img src={logoUrl} alt={`Logo ${name}`} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center border border-[#e5e7eb] bg-[#f9fafb] text-xs font-semibold text-[#364153]',
        sizeClassName,
      )}
      aria-label={`Logo ${name}`}
    >
      {getOrganizationInitials(name)}
    </div>
  );
}
