"use client";

import { useMemo, useState } from "react";

import { Button } from "@carefully-built/ui";

export interface OrganizationSelectorItem {
  readonly id: string;
  readonly name: string;
  readonly logoUrl?: string | null;
}

export interface OrganizationSelectorProps {
  readonly organizations: readonly OrganizationSelectorItem[];
  readonly selectionEndpoint?: string;
  readonly searchPlaceholder?: string;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly itemDescription?: string;
  readonly searchThreshold?: number;
}

export interface OrganizationSelectionPageProps
  extends OrganizationSelectorProps {
  readonly title?: string;
  readonly description?: string;
  readonly noOrganizationsTitle?: string;
  readonly noOrganizationsDescription?: string;
  readonly dashboardHref?: string;
  readonly loginHref?: string;
  readonly dashboardLabel?: string;
  readonly loginLabel?: string;
}

function getOrganizationInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function OrganizationLogo({
  name,
  logoUrl,
}: {
  readonly name: string;
  readonly logoUrl?: string | null;
}): React.ReactElement {
  if (logoUrl) {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60">
        <img alt={name} className="size-full object-cover" src={logoUrl} />
      </div>
    );
  }

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
      {getOrganizationInitials(name)}
    </div>
  );
}

function getSelectionHref(
  endpoint: string,
  organizationId: string,
): string {
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}organizationId=${encodeURIComponent(organizationId)}`;
}

export function OrganizationSelector({
  organizations,
  selectionEndpoint = "/api/auth/organization-selection",
  searchPlaceholder = "Cerca un'organizzazione...",
  emptyTitle = "Nessuna organizzazione trovata",
  emptyDescription = "Prova a cercare con un nome diverso.",
  itemDescription = "Continua con questa organizzazione",
  searchThreshold = 6,
}: OrganizationSelectorProps): React.ReactElement {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const showSearch = organizations.length >= searchThreshold;
  const filteredOrganizations = useMemo(() => {
    if (!normalizedSearch) {
      return organizations;
    }

    return organizations.filter((organization) =>
      organization.name.toLocaleLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch, organizations]);

  return (
    <div className="space-y-3">
      {showSearch ? (
        <div className="relative">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>
      ) : null}

      {filteredOrganizations.length > 0 ? (
        <div className="space-y-2.5">
          {filteredOrganizations.map((organization) => (
            <a
              className="border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-muted/40 block rounded-lg border shadow-sm transition-colors"
              href={getSelectionHref(selectionEndpoint, organization.id)}
              key={organization.id}
            >
              <div className="flex items-center gap-4 px-4 py-3">
                <OrganizationLogo
                  logoUrl={organization.logoUrl}
                  name={organization.name}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {organization.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {itemDescription}
                  </p>
                </div>
                <div className="flex shrink-0 items-center self-stretch text-muted-foreground">
                  &gt;
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="border-border bg-muted/20 rounded-lg border border-dashed px-4 py-6 text-center">
          <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
      )}
    </div>
  );
}

export function OrganizationSelectionPage({
  organizations,
  title = "Benvenuto",
  description = "Hai accesso a piu organizzazioni. Seleziona quella con cui vuoi continuare.",
  noOrganizationsTitle = "Nessuna organizzazione disponibile",
  noOrganizationsDescription = "Il tuo account e autenticato, ma devi ancora scegliere o creare un'organizzazione.",
  dashboardHref = "/dashboard",
  loginHref = "/login",
  dashboardLabel = "Vai alla dashboard",
  loginLabel = "Torna al login",
  ...selectorProps
}: OrganizationSelectionPageProps): React.ReactElement {
  if (organizations.length === 0) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl items-center justify-center">
          <div className="border-border bg-card w-full space-y-6 rounded-3xl border p-8 shadow-sm">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {noOrganizationsTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {noOrganizationsDescription}
              </p>
            </div>

            <div className="space-y-2">
              <a className="block" href={dashboardHref}>
                <Button className="w-full" variant="default">
                  {dashboardLabel}
                </Button>
              </a>
              <a className="block" href={loginHref}>
                <Button className="w-full" variant="outline">
                  {loginLabel}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="border-border bg-card w-full space-y-5 rounded-3xl border p-7 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <OrganizationSelector
            organizations={organizations}
            {...selectorProps}
          />
        </div>
      </div>
    </main>
  );
}
