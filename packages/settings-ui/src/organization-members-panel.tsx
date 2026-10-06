"use client";

import { Chip, SmartTable } from "@carefully-built/ui";

import {
  memberDisplayName,
  memberSortValue,
  countUnreconciledMembers,
  resolveOrganizationMembersPanelLabels,
  resolveOrganizationMembersPanelTestIds,
} from "./organization-members-panel.model";
import { SettingsSectionCard } from "./settings-section-card";

import type {
  OrganizationMember,
  OrganizationMembersPanelLabels,
  OrganizationMembersPanelTestIds,
} from "./organization-members-panel.model";
import type { Column } from "@carefully-built/ui";
import type { ReactNode } from "react";

/**
 * The organization "Members & roles" settings panel.
 *
 * Every B2B SaaS built on this kit ends up with the same surface: the roster of
 * an organization, where IDENTITY (name, email, membership lifecycle) comes
 * from the identity provider — WorkOS, Clerk, an SSO directory — and the
 * APPLICATION ROLE comes from the product's own database. Rebuilding the table,
 * the phone cards, the loading skeleton, the "N members" line and the
 * flagged-drift affordance per app is exactly the duplication this kit exists
 * to remove.
 *
 * WHAT THE KIT OWNS: the card chrome, the three columns, the mobile card
 * renderer, the skeleton, the count line, the empty/error slots, and the
 * data attributes + test ids that make the roster addressable from an E2E
 * suite.
 *
 * WHAT THE APP OWNS: the data (already joined) and the vocabulary. The role and
 * status cells are `renderRole` / `renderStatus` callbacks because application
 * roles are per-product and are NEVER the identity provider's native roles —
 * gating or labelling on the provider's `admin`/`member` string is a known,
 * repeatedly costly bug. Copy arrives as plain strings so the app can use any
 * i18n runtime and the kit imports none.
 *
 * DRIFT IS SURFACED, NOT SWALLOWED. A member whose `role` is `null` is one the
 * provider knows and the product has no role record for. The panel keeps the
 * row, counts it in the header badge and renders the app's explanatory note
 * under the table. Dropping such rows would silently under-report who has
 * access to the workspace.
 *
 * ```tsx
 * <OrganizationMembersPanel
 *   title="Members & roles"
 *   members={rows}
 *   state={result.status === "error" ? "error" : "ready"}
 *   errorContent={<ErrorState onRetry={refresh} />}
 *   renderRole={(m) => <RoleChip member={m} />}
 *   renderStatus={(m) => <StatusChip member={m} />}
 *   labels={{ memberColumn: t("Member"), memberCount: (n) => t("{n} members", { n }) }}
 * />
 * ```
 */
export interface OrganizationMembersPanelProps<
  TMember extends OrganizationMember = OrganizationMember,
> {
  /** The joined roster. Ignored while `state` is `loading` or `error`. */
  readonly members: readonly TMember[];
  /**
   * `ready` renders the roster, `loading` the skeleton card, `error` the app's
   * error slot. An error NEVER falls back to an empty table: "we could not read
   * the roster" and "this workspace has no members" are different sentences.
   */
  readonly state?: "ready" | "loading" | "error";
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly labels?: Partial<OrganizationMembersPanelLabels>;
  readonly testIds?: Partial<OrganizationMembersPanelTestIds>;
  /** The application role cell — the product's vocabulary, not the provider's. */
  readonly renderRole: (member: TMember) => ReactNode;
  /** The membership lifecycle cell. */
  readonly renderStatus: (member: TMember) => ReactNode;
  /** Row-level actions (change role, remove, ...). Adds a trailing column. */
  readonly renderMemberActions?: (member: TMember) => ReactNode;
  /** Badge on the signed-in user's own row; defaults to a compact chip. */
  readonly renderCurrentUserBadge?: () => ReactNode;
  /** Card header slot (an invite button, ...). Replaces the drift badge. */
  readonly headerAction?: ReactNode;
  /** Defaults to the number of members with no application role. */
  readonly unreconciledCount?: number;
  /** Header badge shown when `unreconciledCount > 0`. */
  readonly renderUnreconciledBadge?: (count: number) => ReactNode;
  /** Sentence under the table explaining the flagged rows. */
  readonly unreconciledNote?: ReactNode;
  /** Shown instead of the table when the roster is genuinely empty. */
  readonly emptyContent?: ReactNode;
  /** Shown instead of the table when `state` is `error`. */
  readonly errorContent?: ReactNode;
  readonly onMemberSelect?: (member: TMember) => void;
  readonly skeletonRows?: number;
}

const CHIP_SIZE_COMPACT = "compact" as const;

/**
 * The identity cell. It carries the row's machine-readable facts as `data-*`
 * attributes so an E2E suite can assert on WHAT a row says instead of where it
 * sits — an index-based assertion breaks the moment somebody joins the org.
 */
function MemberIdentity<TMember extends OrganizationMember>({
  member,
  labels,
  testIds,
  testId,
  renderCurrentUserBadge,
}: {
  readonly member: TMember;
  readonly labels: OrganizationMembersPanelLabels;
  readonly testIds: OrganizationMembersPanelTestIds;
  readonly testId: string;
  readonly renderCurrentUserBadge?: () => ReactNode;
}): React.ReactElement {
  return (
    <div
      className="min-w-0"
      data-member-email={member.email}
      data-member-role={member.role ?? "none"}
      data-member-status={member.status}
      data-testid={testId}
    >
      <p className="flex items-center gap-2 truncate text-sm font-medium">
        {memberDisplayName(member, labels)}
        {member.isCurrentUser === true
          ? (renderCurrentUserBadge?.() ?? (
              <Chip size={CHIP_SIZE_COMPACT}>{labels.currentUser}</Chip>
            ))
          : null}
      </p>
      <p className="text-muted-foreground truncate text-xs" data-testid={testIds.email}>
        {member.email.length > 0 ? member.email : labels.noEmail}
      </p>
    </div>
  );
}

function buildColumns<TMember extends OrganizationMember>(
  props: OrganizationMembersPanelProps<TMember>,
  labels: OrganizationMembersPanelLabels,
  testIds: OrganizationMembersPanelTestIds,
): Column<TMember>[] {
  const { renderRole, renderStatus, renderCurrentUserBadge } = props;

  return [
    {
      header: labels.memberColumn,
      accessor: "name",
      sortAccessor: (member) => memberSortValue(member),
      render: (_value, member) => (
        <MemberIdentity
          labels={labels}
          member={member}
          renderCurrentUserBadge={renderCurrentUserBadge}
          testId={testIds.row}
          testIds={testIds}
        />
      ),
    },
    {
      header: labels.roleColumn,
      accessor: "role",
      sortable: false,
      render: (_value, member) => <span data-testid={testIds.role}>{renderRole(member)}</span>,
    },
    {
      header: labels.statusColumn,
      accessor: "status",
      sortable: false,
      render: (_value, member) => <span data-testid={testIds.status}>{renderStatus(member)}</span>,
    },
  ];
}

function MobileMemberCard<TMember extends OrganizationMember>({
  member,
  props,
  labels,
  testIds,
}: {
  readonly member: TMember;
  readonly props: OrganizationMembersPanelProps<TMember>;
  readonly labels: OrganizationMembersPanelLabels;
  readonly testIds: OrganizationMembersPanelTestIds;
}): React.ReactElement {
  return (
    <div className="space-y-3">
      <MemberIdentity
        labels={labels}
        member={member}
        renderCurrentUserBadge={props.renderCurrentUserBadge}
        testId={testIds.card}
        testIds={testIds}
      />
      <div className="flex flex-wrap items-center gap-2">
        {props.renderRole(member)}
        {props.renderStatus(member)}
      </div>
      {props.renderMemberActions ? <div>{props.renderMemberActions(member)}</div> : null}
    </div>
  );
}

/** The roster itself: the count line, the table, and the drift explanation. */
function MembersRoster<TMember extends OrganizationMember>({
  props,
  labels,
  testIds,
  unreconciled,
}: {
  readonly props: OrganizationMembersPanelProps<TMember>;
  readonly labels: OrganizationMembersPanelLabels;
  readonly testIds: OrganizationMembersPanelTestIds;
  readonly unreconciled: number;
}): React.ReactElement {
  const members = [...props.members];

  return (
    <>
      <p className="text-muted-foreground mb-4 text-sm" data-testid={testIds.count}>
        {labels.memberCount(members.length)}
      </p>
      <SmartTable<TMember>
        columns={buildColumns(props, labels, testIds)}
        data={members}
        getRowKey={(member) => member.id}
        isLoading={false}
        noDataContent={props.emptyContent}
        onRowClick={props.onMemberSelect}
        renderActions={props.renderMemberActions}
        renderMobileCard={(member) => (
          <MobileMemberCard labels={labels} member={member} props={props} testIds={testIds} />
        )}
      />
      {unreconciled > 0 && props.unreconciledNote ? (
        <p className="text-muted-foreground mt-4 text-sm" data-testid={testIds.unreconciledNote}>
          {props.unreconciledNote}
        </p>
      ) : null}
    </>
  );
}

export function OrganizationMembersPanel<TMember extends OrganizationMember>(
  props: OrganizationMembersPanelProps<TMember>,
): React.ReactElement {
  const { state = "ready", title, subtitle, skeletonRows = 4 } = props;
  const labels = resolveOrganizationMembersPanelLabels(props.labels);
  const testIds = resolveOrganizationMembersPanelTestIds(props.testIds);
  const unreconciled = props.unreconciledCount ?? countUnreconciledMembers(props.members);

  if (state === "loading") {
    return (
      <div aria-busy="true" data-testid={testIds.loading}>
        <SettingsSectionCard subtitle={subtitle} title={title}>
          <SmartTable<TMember>
            columns={buildColumns(props, labels, testIds)}
            data={[]}
            isLoading
            skeletonRows={skeletonRows}
          />
        </SettingsSectionCard>
      </div>
    );
  }

  const headerAction =
    props.headerAction ??
    (unreconciled > 0 ? props.renderUnreconciledBadge?.(unreconciled) : undefined);

  return (
    <div data-testid={testIds.panel}>
      <SettingsSectionCard action={headerAction} subtitle={subtitle} title={title}>
        {state === "error" ? (
          props.errorContent
        ) : (
          <MembersRoster
            labels={labels}
            props={props}
            testIds={testIds}
            unreconciled={unreconciled}
          />
        )}
      </SettingsSectionCard>
    </div>
  );
}
