# @carefully-built/organizations

B2B organization-management UI for the Carefully-Built SaaS kit: a members
roster with role assignment, an invite flow, and **seat/license-based billing**.
Every component is **presentational** (data + actions via props, no fetching, no
backend coupling), so it renders identically against mock demo fixtures and
against real WorkOS/Convex data wired at promote time.

```bash
bun add @carefully-built/organizations
```

## The paid-seat (license) contract

Each member occupies one paid **seat** (license), bounded by the org's plan.
`SeatPlan.seatsUsed` vs `SeatPlan.seatsTotal` drives the whole surface: the seat
bar, the disabled Invite button at the cap, and the dialog's upgrade prompt.
A null/`<=0` `seatsTotal` means unlimited seats.

## Components

| Export | Purpose |
|--------|---------|
| `OrganizationSettings` | Drop-in surface — seat panel + members roster + invite dialog, wired. One import for `/settings/organization` (real) or `/demo/workspace` (mock). |
| `OrganizationMembersPanel` | Members table (avatar, role `Select`, status, remove) + Invite button gated by seat cap. Responsive card-stack on mobile. |
| `InviteMemberDialog` | Email + role invite; replaced by an Upgrade prompt when the seat cap is reached. |
| `SeatUsagePanel` | Plan + "X of N licenses used" bar with upgrade / manage-billing CTAs. |

Helpers: `seatsRemaining`, `isSeatCapReached`, `isSeatMetered`, `memberInitials`,
`DEFAULT_ROLE_OPTIONS`. Types: `OrgMember`, `OrgRole`, `OrgRoleOption`, `SeatPlan`.

## Example (demo / mock)

```tsx
import { OrganizationSettings, type OrgMember, type SeatPlan } from "@carefully-built/organizations";

const members: OrgMember[] = [
  { id: "u1", name: "Maya Reyes", email: "maya@studio.co", role: "owner", status: "active" },
  { id: "u2", name: "Tom Okafor", email: "tom@studio.co", role: "admin", status: "active" },
  { id: "u3", name: "Lena Park", email: "lena@studio.co", role: "member", status: "invited" },
];
const plan: SeatPlan = { name: "Studio", priceLabel: "€89/mo", seatsUsed: 3, seatsTotal: 5 };

<OrganizationSettings
  organizationName="Bright Pixels"
  members={members}
  plan={plan}
  onInvite={(email, role) => console.log("invite", email, role)}
  onChangeRole={(id, role) => console.log("role", id, role)}
  onRemoveMember={(id) => console.log("remove", id)}
  onUpgrade={() => console.log("upgrade")}
  currentUserId="u1"
/>
```

At promote time, swap the mock `members`/`plan` + the `on*` callbacks for real
WorkOS org data and Convex mutations — the UI is unchanged.
