/**
 * Shape, labels and test ids of the organization members panel.
 *
 * Kept free of React so the parts an app is most likely to get wrong — the
 * copy it passes in, the roster it flattens — can be unit tested without a
 * renderer, the same way `table-toolbar` resolves its labels.
 *
 * The panel deliberately does NOT own the role vocabulary. Every SaaS app has
 * its own application roles (`admin | reviewer | editor | agent`, `owner |
 * member`, ...) and they are never the identity provider's native roles, so the
 * app renders a role/status cell through a callback and the kit renders the
 * structure around it.
 */

/** One row of the roster, as the consuming app has already resolved it. */
export interface OrganizationMember {
  /** Stable row key — a membership id, a user id, anything unique per row. */
  readonly id: string;
  readonly name?: string | null;
  readonly email: string;
  /**
   * The APPLICATION role key. `null` means the identity provider knows this
   * member but the app has no role record for them yet: the panel keeps the
   * row and flags it rather than dropping it, because a roster that silently
   * disagrees with the identity provider is worse than one that says so.
   */
  readonly role: string | null;
  /** Lifecycle key of the membership (`active`, `invited`, ...). */
  readonly status: string;
  /** True on the signed-in user's own row. */
  readonly isCurrentUser?: boolean;
}

export interface OrganizationMembersPanelLabels {
  readonly memberColumn: string;
  readonly roleColumn: string;
  readonly statusColumn: string;
  /** Badge on the signed-in user's own row. */
  readonly currentUser: string;
  /** Fallback when a membership carries no email address. */
  readonly noEmail: string;
  /** The "N members" line above the table. */
  readonly memberCount: (count: number) => string;
}

export const DEFAULT_ORGANIZATION_MEMBERS_PANEL_LABELS: OrganizationMembersPanelLabels = {
  memberColumn: "Member",
  roleColumn: "Role",
  statusColumn: "Status",
  currentUser: "You",
  noEmail: "Email unavailable",
  memberCount: (count) => (count === 1 ? "1 member" : `${String(count)} members`),
};

/**
 * English defaults merged with the app's localized copy. Apps translate with
 * whatever i18n library they use and pass strings in; the kit never imports an
 * i18n runtime.
 */
export function resolveOrganizationMembersPanelLabels(
  overrides?: Partial<OrganizationMembersPanelLabels>,
): OrganizationMembersPanelLabels {
  return { ...DEFAULT_ORGANIZATION_MEMBERS_PANEL_LABELS, ...overrides };
}

/**
 * Test ids the panel stamps on its parts. They have stable defaults so an app
 * gets an E2E-addressable roster for free, and are overridable for apps whose
 * suites already use another naming scheme.
 */
export interface OrganizationMembersPanelTestIds {
  readonly panel: string;
  readonly loading: string;
  readonly count: string;
  readonly row: string;
  readonly card: string;
  readonly email: string;
  readonly role: string;
  readonly status: string;
  readonly unreconciledCount: string;
  readonly unreconciledNote: string;
}

export const DEFAULT_ORGANIZATION_MEMBERS_PANEL_TEST_IDS: OrganizationMembersPanelTestIds = {
  panel: "members-panel",
  loading: "members-panel-loading",
  count: "members-count",
  row: "member-row",
  card: "member-card",
  email: "member-email",
  role: "member-role",
  status: "member-status",
  unreconciledCount: "members-unreconciled-count",
  unreconciledNote: "members-unreconciled",
};

export function resolveOrganizationMembersPanelTestIds(
  overrides?: Partial<OrganizationMembersPanelTestIds>,
): OrganizationMembersPanelTestIds {
  return { ...DEFAULT_ORGANIZATION_MEMBERS_PANEL_TEST_IDS, ...overrides };
}

/** What the Member column sorts on: the displayed identity, case-insensitive. */
export function memberSortValue(member: OrganizationMember): string {
  return (member.name ?? member.email).toLowerCase();
}

/** The name to print, falling back to the email when the provider has none. */
export function memberDisplayName(
  member: OrganizationMember,
  labels: OrganizationMembersPanelLabels,
): string {
  const name = member.name ?? "";
  if (name.trim().length > 0) return name;
  return member.email.length > 0 ? member.email : labels.noEmail;
}

/**
 * Members the identity provider knows and the app has no role record for.
 * Used as the default of the panel's flag counter so an app cannot render the
 * roster and forget to surface the drift.
 */
export function countUnreconciledMembers(members: readonly OrganizationMember[]): number {
  return members.filter((member) => member.role === null).length;
}
