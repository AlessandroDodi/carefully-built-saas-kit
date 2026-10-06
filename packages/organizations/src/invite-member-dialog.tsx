"use client";

import { type ReactElement, useState } from "react";
import { UserPlus } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@carefully-built/ui";

import {
  DEFAULT_ROLE_OPTIONS,
  isSeatCapReached,
  seatsRemaining,
  type OrgRole,
  type OrgRoleOption,
  type SeatPlan,
} from "./types";

export interface InviteMemberDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Invite handler — receives the entered email + chosen role. */
  readonly onInvite: (email: string, role: OrgRole) => void | Promise<void>;
  /**
   * The org's plan — drives seat-cap gating. When the cap is reached the dialog
   * shows an "out of licenses" state with an Upgrade CTA instead of the form.
   */
  readonly plan: SeatPlan;
  /** Upgrade CTA shown when the seat cap is reached. */
  readonly onUpgrade?: () => void;
  readonly roleOptions?: readonly OrgRoleOption[];
  readonly defaultRole?: OrgRole;
  /** Emails already in the org — used to block duplicate invites. */
  readonly existingEmails?: readonly string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Invite-a-member dialog. Enforces the paid-seat contract at the UI: when the
 * org has no licenses left (`isSeatCapReached(plan)`) the form is replaced by an
 * upgrade prompt — a new member needs a paid seat. Presentational + controlled.
 */
export function InviteMemberDialog({
  open,
  onOpenChange,
  onInvite,
  plan,
  onUpgrade,
  roleOptions = DEFAULT_ROLE_OPTIONS,
  defaultRole,
  existingEmails = [],
}: InviteMemberDialogProps): ReactElement {
  const firstRole = (roleOptions[0]?.value ?? "member") as OrgRole;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrgRole>(defaultRole ?? firstRole);
  const [submitting, setSubmitting] = useState(false);

  const capReached = isSeatCapReached(plan);
  const remaining = seatsRemaining(plan);
  const normalized = email.trim().toLowerCase();
  const isDuplicate = existingEmails.some((e) => e.trim().toLowerCase() === normalized);
  const emailValid = EMAIL_RE.test(normalized);
  const canSubmit = !capReached && emailValid && !isDuplicate && !submitting;

  const reset = (): void => {
    setEmail("");
    setRole(defaultRole ?? firstRole);
    setSubmitting(false);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onInvite(normalized, role);
      reset();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            {capReached
              ? "Your plan has no licenses left. Upgrade to add more members."
              : `${remaining === Number.POSITIVE_INFINITY ? "Unlimited" : remaining} license${remaining === 1 ? "" : "s"} available. The new member takes one paid seat.`}
          </DialogDescription>
        </DialogHeader>

        {capReached ? (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-[44px]">
              Close
            </Button>
            {onUpgrade ? (
              <Button onClick={onUpgrade} className="min-h-[44px]">
                Upgrade plan
              </Button>
            ) : null}
          </DialogFooter>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  inputMode="email"
                  autoComplete="off"
                  placeholder="teammate@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[44px]"
                />
                {isDuplicate ? (
                  <p className="text-sm text-destructive">That email is already a member.</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as OrgRole)}>
                  <SelectTrigger id="invite-role" className="min-h-[44px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="min-h-[44px]"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!canSubmit} className="min-h-[44px]">
                <UserPlus className="mr-2 h-4 w-4" aria-hidden />
                Send invite
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
