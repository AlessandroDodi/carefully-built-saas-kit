# Carefully Built SaaS Kit

Reusable public-ready packages for building B2B SaaS apps with React, Next.js, Convex, WorkOS, and strongly typed CRUD patterns.

The goal of this repo is to collect the boring-but-important SaaS building blocks once, keep them polished, and reuse them across projects instead of rebuilding tables, filters, organization flows, CRUD screens, and dashboard shells every time.

## Packages

- `@carefully-built/ui`: React UI primitives, overlays, search controls, and data-display components.

Planned future packages:

- `@carefully-built/forms`: schema-driven fields and form rendering for CRUD screens.
- `@carefully-built/workos`: reusable WorkOS organization, profile, and settings flows.
- `@carefully-built/crud`: Convex-friendly multi-tenant CRUD patterns.
- `@carefully-built/dashboard`: responsive app shell, sidebar, bottom nav, command search, and admin layouts.

## Development

```bash
bun install
bun run check
```

Packages are designed to be published publicly, but can also be consumed locally with `link:` dependencies while they are under active development.

## Maintenance

When moving reusable code into this repo, update the relevant package README in the same change. The README should list new components, expected peer dependencies, and any assumptions the consuming app must provide.
