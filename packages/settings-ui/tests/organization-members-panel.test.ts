import { describe, expect, test } from "bun:test";

import {
  countUnreconciledMembers,
  memberDisplayName,
  memberSortValue,
  resolveOrganizationMembersPanelLabels,
  resolveOrganizationMembersPanelTestIds,
} from "../src/organization-members-panel.model";

import type { OrganizationMember } from "../src/organization-members-panel.model";

function member(overrides: Partial<OrganizationMember> = {}): OrganizationMember {
  return { id: "m1", name: "Ada Lovelace", email: "ada@example.com", role: "admin", status: "active", ...overrides };
}

describe("organization members panel labels", () => {
  test("defaults the roster copy to English", () => {
    const labels = resolveOrganizationMembersPanelLabels();

    expect(labels.memberColumn).toBe("Member");
    expect(labels.memberCount(1)).toBe("1 member");
    expect(labels.memberCount(4)).toBe("4 members");
  });

  test("uses app-provided localized copy without losing the other defaults", () => {
    const labels = resolveOrganizationMembersPanelLabels({
      memberColumn: "Membro",
      memberCount: (count) => `${String(count)} membri`,
    });

    expect(labels.memberColumn).toBe("Membro");
    expect(labels.memberCount(3)).toBe("3 membri");
    expect(labels.statusColumn).toBe("Status");
  });

  test("test ids default to the documented names and stay overridable", () => {
    expect(resolveOrganizationMembersPanelTestIds().row).toBe("member-row");
    expect(resolveOrganizationMembersPanelTestIds({ row: "roster-row" }).row).toBe("roster-row");
    expect(resolveOrganizationMembersPanelTestIds({ row: "roster-row" }).panel).toBe("members-panel");
  });
});

describe("member display helpers", () => {
  test("prints the name when the provider has one", () => {
    expect(memberDisplayName(member(), resolveOrganizationMembersPanelLabels())).toBe("Ada Lovelace");
  });

  test("falls back to the email for a member with no usable name", () => {
    const labels = resolveOrganizationMembersPanelLabels();

    expect(memberDisplayName(member({ name: null }), labels)).toBe("ada@example.com");
    expect(memberDisplayName(member({ name: "   " }), labels)).toBe("ada@example.com");
  });

  test("falls back to the no-email label when the membership carries neither", () => {
    const labels = resolveOrganizationMembersPanelLabels();

    expect(memberDisplayName(member({ name: null, email: "" }), labels)).toBe(labels.noEmail);
  });

  test("sorts on the displayed identity, case-insensitively", () => {
    expect(memberSortValue(member({ name: "Zoe" }))).toBe("zoe");
    expect(memberSortValue(member({ name: null, email: "Ada@Example.com" }))).toBe("ada@example.com");
  });
});

describe("countUnreconciledMembers", () => {
  test("counts the members the identity provider knows and the app has no role for", () => {
    const members = [
      member({ id: "a" }),
      member({ id: "b", role: null }),
      member({ id: "c", role: null }),
      member({ id: "d", role: "editor" }),
    ];

    expect(countUnreconciledMembers(members)).toBe(2);
  });

  test("is zero for a fully reconciled roster and for an empty one", () => {
    expect(countUnreconciledMembers([member()])).toBe(0);
    expect(countUnreconciledMembers([])).toBe(0);
  });
});
