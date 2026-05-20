'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface UserGrowthChartDatum {
  readonly label: string;
  readonly rangeLabel: string;
  readonly value: number;
}

interface TooltipPayload {
  readonly payload?: UserGrowthChartDatum;
  readonly value?: number;
}

interface TooltipProps {
  readonly active?: boolean;
  readonly payload?: readonly TooltipPayload[];
}

const USER_GROWTH_GRADIENT_ID = 'super-admin-user-growth-gradient';

function UserGrowthTooltip({ active, payload }: TooltipProps): React.ReactElement | null {
  const item = payload?.[0]?.payload;

  if (!active || !item) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm shadow-sm">
      <div className="font-medium text-[#101828]">{item.rangeLabel}</div>
      <div className="mt-1 text-[#4a5565]">
        {item.value === 1 ? '1 nuovo utente' : `${String(item.value)} nuovi utenti`}
      </div>
    </div>
  );
}

export function UserGrowthChart({
  data,
}: {
  readonly data: readonly UserGrowthChartDatum[];
}): React.ReactElement {
  const isEmpty = data.every((item) => item.value === 0);

  if (isEmpty) {
    return (
      <div className="mt-6 flex h-56 items-center justify-center rounded-lg border border-dashed border-[#d1d5dc] text-sm text-[#6a7282]">
        Nessuna registrazione WorkOS nelle ultime 8 settimane.
      </div>
    );
  }

  return (
    <div className="mt-6 h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={[...data]} margin={{ top: 8, right: 8, left: -12, bottom: 20 }}>
          <defs>
            <linearGradient id={USER_GROWTH_GRADIENT_ID} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            interval={0}
            tickLine={false}
            axisLine={false}
            height={44}
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <RechartsTooltip
            cursor={{ fill: 'rgba(236,72,153,0.1)' }}
            content={<UserGrowthTooltip />}
          />
          <Bar
            dataKey="value"
            name="Nuovi utenti"
            fill={`url(#${USER_GROWTH_GRADIENT_ID})`}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
