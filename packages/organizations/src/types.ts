/**
 * @carefully-built/organizations — shared types.
 *
 * Presentational B2B organization-management model: an org has members, each
 * member occupies a paid SEAT (a license) bounded by the org's plan. All UI in
 * this package is data-via-props (no data fetching, no backend coupling) so it
 * renders identically against mock demo fixtures and against real WorkOS/Convex
 * data wired at promote time.
 */

/** Role of a member within an organization. Open string union for custom roles. */
export type OrgRole = "owner" | "admin" | "member" | "billing" | (string & {});

/** Membership lifecycle. `invited` members typically still consume a seat. */
export type OrgMemberStatus = "active" | "invited" | "suspended";

export interface OrgMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: OrgRole;
  /** Optional avatar image; a generated initials chip is shown when absent. */
  readonly avatarUrl?: string;
  readonly status?: OrgMemberStatus;
  /**
   * Whether this member occupies a paid seat/license. Defaults to true. Set
   * false for members that are exempt from the seat cap (e.g. a free viewer).
   */
  readonly consumesSeat?: boolean;
}

/** A selectable role option for the role <Select> + invite dialog. */
export interface OrgRoleOption {
  readonly value: OrgRole;
  readonly label: string;
  /** Optional helper text shown under the option label in the invite dialog. */
  readonly description?: string;
}

/**
 * The org's plan + seat (license) accounting. `seatsTotal` is the number of paid
 * licenses; `seatsUsed` is how many are occupied. A null/undefined `seatsTotal`
 * (or <= 0) means UNLIMITED seats — the seat bar renders as "unlimited" and
 * invites are never seat-blocked.
 */
export interface SeatPlan {
  /** Display name, e.g. "Studio". */
  readonly name: string;
  /** Price label, e.g. "€89/mo". Optional. */
  readonly priceLabel?: string;
  readonly seatsUsed: number;
  /** Paid-license cap. null/undefined/<=0 ⇒ unlimited. */
  readonly seatsTotal?: number | null;
  /** Billing interval label, e.g. "month". Optional. */
  readonly interval?: string;
}

/** Default role options used when a caller does not supply its own. */
export const DEFAULT_ROLE_OPTIONS: readonly OrgRoleOption[] = [
  { value: "owner", label: "Owner", description: "Full access, including billing" },
  { value: "admin", label: "Admin", description: "Manage members and settings" },
  { value: "member", label: "Member", description: "Use the app, no admin access" },
  { value: "billing", label: "Billing", description: "Manage the subscription only" },
];

/** True when the plan has a finite paid-seat cap (i.e. seats are metered). */
export function isSeatMetered(plan: SeatPlan): boolean {
  return typeof plan.seatsTotal === "number" && plan.seatsTotal > 0;
}

/** Seats still available on the plan; Infinity when unlimited. */
export function seatsRemaining(plan: SeatPlan): number {
  if (!isSeatMetered(plan)) return Number.POSITIVE_INFINITY;
  return Math.max(0, (plan.seatsTotal as number) - plan.seatsUsed);
}

/** Whether the org is at/over its paid-license cap (no seats to assign). */
export function isSeatCapReached(plan: SeatPlan): boolean {
  return seatsRemaining(plan) <= 0;
}

/** Initials for an avatar fallback, e.g. "Maya Reyes" → "MR". */
export function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0] as string).slice(0, 2).toUpperCase();
  return ((parts[0] as string)[0]! + (parts[parts.length - 1] as string)[0]!).toUpperCase();
}
