# @carefully-built/organizations

B2B organization management UI: members roster, role assignment, invite flow, and seat/license billing — presentational, data-via-props.

## Install

```bash
bun add @carefully-built/organizations
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/organizations`

## Component Usage

```tsx
import { InviteMemberDialog } from '@carefully-built/organizations';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `InviteMemberDialog`: import from `@carefully-built/organizations`.
- `OrganizationMembersPanel`: import from `@carefully-built/organizations`.
- `OrganizationSettings`: import from `@carefully-built/organizations`.
- `SeatUsagePanel`: import from `@carefully-built/organizations`.

## Helper Usage

```ts
import { DEFAULT_ROLE_OPTIONS } from '@carefully-built/organizations';
```

Helpers in this package:

- `DEFAULT_ROLE_OPTIONS`
- `DEFAULT_ROLE_OPTIONS`
- `InviteMemberDialog`
- `isSeatCapReached`
- `isSeatCapReached`
- `isSeatMetered`
- `isSeatMetered`
- `memberInitials`
- `memberInitials`
- `OrganizationMembersPanel`
- `OrganizationSettings`
- `seatsRemaining`
- `seatsRemaining`
- `SeatUsagePanel`

## Types And Schemas

- `InviteMemberDialogProps`
- `OrganizationMembersPanelProps`
- `OrganizationSettingsProps`
- `OrgMember`
- `OrgMemberStatus`
- `OrgRole`
- `OrgRoleOption`
- `SeatPlan`
- `SeatUsagePanelProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `InviteMemberDialog` | Component | `packages/organizations/src/invite-member-dialog.tsx` |
| `OrganizationMembersPanel` | Component | `packages/organizations/src/organization-members-panel.tsx` |
| `OrganizationSettings` | Component | `packages/organizations/src/organization-settings.tsx` |
| `SeatUsagePanel` | Component | `packages/organizations/src/seat-usage-panel.tsx` |
| `DEFAULT_ROLE_OPTIONS` | Helper | `packages/organizations/src/index.ts` |
| `DEFAULT_ROLE_OPTIONS` | Helper | `packages/organizations/src/types.ts` |
| `InviteMemberDialog` | Helper | `packages/organizations/src/index.ts` |
| `isSeatCapReached` | Helper | `packages/organizations/src/index.ts` |
| `isSeatCapReached` | Helper | `packages/organizations/src/types.ts` |
| `isSeatMetered` | Helper | `packages/organizations/src/index.ts` |
| `isSeatMetered` | Helper | `packages/organizations/src/types.ts` |
| `memberInitials` | Helper | `packages/organizations/src/index.ts` |
| `memberInitials` | Helper | `packages/organizations/src/types.ts` |
| `OrganizationMembersPanel` | Helper | `packages/organizations/src/index.ts` |
| `OrganizationSettings` | Helper | `packages/organizations/src/index.ts` |
| `seatsRemaining` | Helper | `packages/organizations/src/index.ts` |
| `seatsRemaining` | Helper | `packages/organizations/src/types.ts` |
| `SeatUsagePanel` | Helper | `packages/organizations/src/index.ts` |
| `InviteMemberDialogProps` | Type | `packages/organizations/src/invite-member-dialog.tsx` |
| `OrganizationMembersPanelProps` | Type | `packages/organizations/src/organization-members-panel.tsx` |
| `OrganizationSettingsProps` | Type | `packages/organizations/src/organization-settings.tsx` |
| `OrgMember` | Type | `packages/organizations/src/types.ts` |
| `OrgMemberStatus` | Type | `packages/organizations/src/types.ts` |
| `OrgRole` | Type | `packages/organizations/src/types.ts` |
| `OrgRoleOption` | Type | `packages/organizations/src/types.ts` |
| `SeatPlan` | Type | `packages/organizations/src/types.ts` |
| `SeatUsagePanelProps` | Type | `packages/organizations/src/seat-usage-panel.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
