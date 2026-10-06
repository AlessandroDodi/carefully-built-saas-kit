"use client";

import type { ReactElement } from "react";
import { CreditCard, Users } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, cn } from "@carefully-built/ui";

import { isSeatMetered, seatsRemaining, type SeatPlan } from "./types";

export interface SeatUsagePanelProps {
  /** The org's plan + seat/license accounting. */
  readonly plan: SeatPlan;
  /** "Upgrade" CTA — shown when seats are metered. Hidden when omitted. */
  readonly onUpgrade?: () => void;
  /** "Manage billing" CTA — opens the billing portal. Hidden when omitted. */
  readonly onManageBilling?: () => void;
  readonly title?: string;
  readonly className?: string;
  /** Force-show the upgrade CTA even when seats remain (e.g. always upsell). */
  readonly alwaysShowUpgrade?: boolean;
}

/**
 * Plan + seat/license usage card. Shows the current plan, price, and a
 * "X of N licenses used" bar with an upgrade CTA when the org is at/near its
 * paid-seat cap. Presentational — all data + actions via props.
 *
 * "Each member pays with their license" is encoded here: seatsUsed counts the
 * members occupying a paid seat; when seatsUsed reaches seatsTotal the org must
 * upgrade (buy more licenses) to add members — the InviteMemberDialog reads the
 * same SeatPlan and blocks invites at the cap.
 */
export function SeatUsagePanel({
  plan,
  onUpgrade,
  onManageBilling,
  title = "Plan & licenses",
  className,
  alwaysShowUpgrade = false,
}: SeatUsagePanelProps): ReactElement {
  const metered = isSeatMetered(plan);
  const remaining = seatsRemaining(plan);
  const total = plan.seatsTotal ?? 0;
  const pct = metered ? Math.min(100, Math.round((plan.seatsUsed / total) * 100)) : 0;
  const atCap = metered && remaining <= 0;
  const nearCap = metered && !atCap && remaining <= Math.max(1, Math.ceil(total * 0.15));

  const barTone = atCap
    ? "bg-destructive"
    : nearCap
      ? "bg-amber-500"
      : "bg-primary";

  const showUpgrade = Boolean(onUpgrade) && (alwaysShowUpgrade || metered);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-sm font-medium">
          {plan.name}
          {plan.priceLabel ? (
            <span className="text-muted-foreground">· {plan.priceLabel}</span>
          ) : null}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" aria-hidden />
              Licenses used
            </span>
            <span className="font-medium tabular-nums">
              {metered ? `${plan.seatsUsed} of ${total}` : `${plan.seatsUsed} · unlimited`}
            </span>
          </div>
          {metered ? (
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={plan.seatsUsed}
              aria-label="Licenses used"
            >
              <div
                className={cn("h-full rounded-full transition-all", barTone)}
                style={{ width: `${pct}%` }}
              />
            </div>
          ) : null}
          {atCap ? (
            <p className="text-sm text-destructive">
              All licenses are in use. Upgrade to add more members.
            </p>
          ) : nearCap ? (
            <p className="text-sm text-amber-600 dark:text-amber-500">
              {remaining} license{remaining === 1 ? "" : "s"} left.
            </p>
          ) : null}
        </div>

        {(showUpgrade || onManageBilling) && (
          <div className="flex flex-wrap gap-2">
            {showUpgrade ? (
              <Button onClick={onUpgrade} className="min-h-[44px]">
                Upgrade plan
              </Button>
            ) : null}
            {onManageBilling ? (
              <Button variant="outline" onClick={onManageBilling} className="min-h-[44px]">
                <CreditCard className="mr-2 h-4 w-4" aria-hidden />
                Manage billing
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
