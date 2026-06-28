"use client";

import { type ReactElement, useState } from "react";

import { cn } from "@carefully-built/ui";

import { InviteMemberDialog } from "./invite-member-dialog";
import { OrganizationMembersPanel } from "./organization-members-panel";
import { SeatUsagePanel } from "./seat-usage-panel";
import type { OrgMember, OrgRole, OrgRoleOption, SeatPlan } from "./types";

export interface OrganizationSettingsProps {
  /** Org display name, shown as the surface heading. */
  readonly organizationName: string;
  readonly members: readonly OrgMember[];
  readonly plan: SeatPlan;
  readonly onInvite: (email: string, role: OrgRole) => void | Promise<void>;
  readonly onChangeRole?: (memberId: string, role: OrgRole) => void | Promise<void>;
  readonly onRemoveMember?: (memberId: string) => void | Promise<void>;
  readonly onUpgrade?: () => void;
  readonly onManageBilling?: () => void;
  readonly roleOptions?: readonly OrgRoleOption[];
  readonly currentUserId?: string;
  readonly canManage?: boolean;
  readonly className?: string;
}

/**
 * Drop-in B2B organization-management surface: a plan/seat-usage panel + the
 * members roster + the invite dialog, wired together. This is the one-import
 * component a prototype drops onto `/demo/workspace` (mock data) or a product
 * onto `/settings/organization` (real data). It self-manages the invite-dialog
 * open state; everything else is data + actions via props.
 *
 * The paid-seat (license) contract is enforced end-to-end: SeatUsagePanel shows
 * licenses used vs the plan cap; the Invite button disables and the dialog
 * blocks (with an Upgrade CTA) once the cap is reached — adding a member needs a
 * paid seat.
 */
export function OrganizationSettings({
  organizationName,
  members,
  plan,
  onInvite,
  onChangeRole,
  onRemoveMember,
  onUpgrade,
  onManageBilling,
  roleOptions,
  currentUserId,
  canManage = true,
  className,
}: OrganizationSettingsProps): ReactElement {
  const [inviteOpen, setInviteOpen] = useState(false);
  const existingEmails = members.map((m) => m.email);

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-xl font-semibold">{organizationName}</h2>
        <p className="text-sm text-muted-foreground">Manage members, roles, and licenses.</p>
      </div>

      <SeatUsagePanel
        plan={plan}
        onUpgrade={onUpgrade}
        onManageBilling={onManageBilling}
      />

      <OrganizationMembersPanel
        members={members}
        plan={plan}
        onInvite={canManage ? () => setInviteOpen(true) : undefined}
        onChangeRole={onChangeRole}
        onRemoveMember={onRemoveMember}
        roleOptions={roleOptions}
        currentUserId={currentUserId}
        canManage={canManage}
      />

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={onInvite}
        plan={plan}
        onUpgrade={onUpgrade}
        roleOptions={roleOptions}
        existingEmails={existingEmails}
      />
    </div>
  );
}
