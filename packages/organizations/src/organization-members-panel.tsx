"use client";

import type { ReactElement } from "react";
import { MoreHorizontal, Trash2, UserPlus } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Chip,
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carefully-built/ui";

import {
  DEFAULT_ROLE_OPTIONS,
  isSeatCapReached,
  memberInitials,
  type OrgMember,
  type OrgRole,
  type OrgRoleOption,
  type SeatPlan,
} from "./types";

export interface OrganizationMembersPanelProps {
  readonly members: readonly OrgMember[];
  /** The org plan — drives the seat-cap gating on the Invite button. */
  readonly plan: SeatPlan;
  /** Open the invite dialog. When omitted, the Invite button is hidden. */
  readonly onInvite?: () => void;
  /** Change a member's role. When omitted, roles render read-only. */
  readonly onChangeRole?: (memberId: string, role: OrgRole) => void | Promise<void>;
  /** Remove a member. When omitted, the remove action is hidden. */
  readonly onRemoveMember?: (memberId: string) => void | Promise<void>;
  readonly roleOptions?: readonly OrgRoleOption[];
  /** The signed-in user's id — their own row is not removable + tagged "You". */
  readonly currentUserId?: string;
  /**
   * Whether the viewer can manage members (admin/owner). When false, roles are
   * read-only and the invite/remove actions are hidden regardless of handlers.
   */
  readonly canManage?: boolean;
  readonly title?: string;
  readonly className?: string;
}

function roleLabel(role: OrgRole, options: readonly OrgRoleOption[]): string {
  return options.find((o) => o.value === role)?.label ?? String(role);
}

function statusChipClass(status: OrgMember["status"]): string {
  switch (status) {
    case "invited":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    case "suspended":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  }
}

/**
 * Organization members panel: a roster table with role assignment, seat/status
 * badges, a remove action, and an Invite button that is disabled when the org
 * is at its paid-license cap. Responsive — a card-stacked layout below `md`.
 * Presentational: all data + actions arrive via props.
 */
export function OrganizationMembersPanel({
  members,
  plan,
  onInvite,
  onChangeRole,
  onRemoveMember,
  roleOptions = DEFAULT_ROLE_OPTIONS,
  currentUserId,
  canManage = true,
  title = "Members",
  className,
}: OrganizationMembersPanelProps): ReactElement {
  const capReached = isSeatCapReached(plan);
  const showInvite = canManage && Boolean(onInvite);

  const renderRole = (m: OrgMember): ReactElement => {
    if (canManage && onChangeRole) {
      return (
        <Select value={String(m.role)} onValueChange={(v) => onChangeRole(m.id, v as OrgRole)}>
          <SelectTrigger className="h-9 w-[140px]" aria-label={`Role for ${m.name}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return <span className="text-sm">{roleLabel(m.role, roleOptions)}</span>;
  };

  const identity = (m: OrgMember): ReactElement => (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt={m.name} /> : null}
        <AvatarFallback className="text-xs">{memberInitials(m.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {m.name}
          {m.id === currentUserId ? (
            <span className="ml-1.5 text-xs text-muted-foreground">(You)</span>
          ) : null}
        </p>
        <p className="truncate text-xs text-muted-foreground">{m.email}</p>
      </div>
    </div>
  );

  const removeButton = (m: OrgMember): ReactElement | null => {
    if (!canManage || !onRemoveMember || m.id === currentUserId) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemoveMember(m.id)}
        aria-label={`Remove ${m.name}`}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </Button>
    );
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex flex-row items-center justify-between gap-2">
        <h3 className="text-base font-semibold">
          {title}
          <span className="ml-2 text-sm font-normal text-muted-foreground">{members.length}</span>
        </h3>
        {showInvite ? (
          <Button
            onClick={onInvite}
            disabled={capReached}
            title={capReached ? "No licenses left — upgrade to invite" : undefined}
            className="min-h-[44px]"
          >
            <UserPlus className="mr-2 h-4 w-4" aria-hidden />
            Invite member
          </Button>
        ) : null}
      </div>

      {/* Desktop / tablet: table */}
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[1%] text-right">
                <span className="sr-only">Actions</span>
                <MoreHorizontal className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{identity(m)}</TableCell>
                <TableCell>{renderRole(m)}</TableCell>
                <TableCell>
                  <Chip className={statusChipClass(m.status)}>{m.status ?? "active"}</Chip>
                </TableCell>
                <TableCell className="text-right">{removeButton(m)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: stacked cards */}
      <ul className="space-y-3 md:hidden">
        {members.map((m) => (
          <li key={m.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              {identity(m)}
              {removeButton(m)}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              {renderRole(m)}
              <Chip className={statusChipClass(m.status)}>{m.status ?? "active"}</Chip>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
