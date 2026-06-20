"use client";

import { useMemo, useState } from "react";

import { Button, cn } from "@carefully-built/ui";

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
  readonly className?: string;
  readonly classes?: OrganizationSelectorClassNames;
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
  readonly pageClassName?: string;
  readonly pageClasses?: OrganizationSelectionPageClassNames;
}

export interface OrganizationSelectorClassNames {
  readonly root?: string;
  readonly searchWrapper?: string;
  readonly searchInput?: string;
  readonly list?: string;
  readonly item?: string;
  readonly itemContent?: string;
  readonly itemText?: string;
  readonly itemName?: string;
  readonly itemDescription?: string;
  readonly itemIcon?: string;
  readonly logo?: string;
  readonly logoImage?: string;
  readonly logoFallback?: string;
  readonly emptyState?: string;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
}

export interface OrganizationSelectionPageClassNames {
  readonly root?: string;
  readonly container?: string;
  readonly panel?: string;
  readonly header?: string;
  readonly title?: string;
  readonly description?: string;
  readonly actions?: string;
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
  className,
  imageClassName,
  fallbackClassName,
}: {
  readonly name: string;
  readonly logoUrl?: string | null;
  readonly className?: string;
  readonly imageClassName?: string;
  readonly fallbackClassName?: string;
}): React.ReactElement {
  if (logoUrl) {
    return (
      <div
        className={cn(
          "relative size-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60",
          className,
        )}
      >
        <img
          alt={name}
          className={cn("size-full object-cover", imageClassName)}
          src={logoUrl}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary",
        className,
        fallbackClassName,
      )}
    >
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
  searchPlaceholder = "Search organization...",
  emptyTitle = "No organization found",
  emptyDescription = "Try searching with a different name.",
  itemDescription = "Continue with this organization",
  searchThreshold = 6,
  className,
  classes,
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
    <div className={cn("space-y-3", className, classes?.root)}>
      {showSearch ? (
        <div className={cn("relative", classes?.searchWrapper)}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              classes?.searchInput,
            )}
          />
        </div>
      ) : null}

      {filteredOrganizations.length > 0 ? (
        <div className={cn("space-y-2.5", classes?.list)}>
          {filteredOrganizations.map((organization) => (
            <a
              className={cn(
                "border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-muted/40 block rounded-lg border shadow-sm transition-colors",
                classes?.item,
              )}
              href={getSelectionHref(selectionEndpoint, organization.id)}
              key={organization.id}
            >
              <div className={cn("flex items-center gap-4 px-4 py-3", classes?.itemContent)}>
                <OrganizationLogo
                  logoUrl={organization.logoUrl}
                  name={organization.name}
                  className={classes?.logo}
                  imageClassName={classes?.logoImage}
                  fallbackClassName={classes?.logoFallback}
                />
                <div className={cn("min-w-0 flex-1", classes?.itemText)}>
                  <p className={cn("truncate text-sm font-semibold text-foreground", classes?.itemName)}>
                    {organization.name}
                  </p>
                  <p className={cn("text-xs text-muted-foreground", classes?.itemDescription)}>
                    {itemDescription}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex shrink-0 items-center self-stretch text-muted-foreground",
                    classes?.itemIcon,
                  )}
                >
                  &gt;
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "border-border bg-muted/20 rounded-lg border border-dashed px-4 py-6 text-center",
            classes?.emptyState,
          )}
        >
          <p className={cn("text-sm font-medium text-foreground", classes?.emptyTitle)}>
            {emptyTitle}
          </p>
          <p className={cn("mt-1 text-xs text-muted-foreground", classes?.emptyDescription)}>
            {emptyDescription}
          </p>
        </div>
      )}
    </div>
  );
}

export function OrganizationSelectionPage({
  organizations,
  title = "Welcome",
  description = "You have access to multiple organizations. Select the one you want to continue with.",
  noOrganizationsTitle = "No organization available",
  noOrganizationsDescription = "Your account is authenticated, but you still need to choose or create an organization.",
  dashboardHref = "/dashboard",
  loginHref = "/login",
  dashboardLabel = "Go to dashboard",
  loginLabel = "Back to login",
  pageClassName,
  pageClasses,
  ...selectorProps
}: OrganizationSelectionPageProps): React.ReactElement {
  if (organizations.length === 0) {
    return (
      <main className={cn("min-h-screen bg-background px-6 py-12 sm:px-8", pageClassName, pageClasses?.root)}>
        <div className={cn("mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl items-center justify-center", pageClasses?.container)}>
          <div className={cn("border-border bg-card w-full space-y-6 rounded-3xl border p-8 shadow-sm", pageClasses?.panel)}>
            <div className={cn("space-y-2 text-center", pageClasses?.header)}>
              <h1 className={cn("text-2xl font-semibold tracking-tight", pageClasses?.title)}>
                {noOrganizationsTitle}
              </h1>
              <p className={cn("text-sm text-muted-foreground", pageClasses?.description)}>
                {noOrganizationsDescription}
              </p>
            </div>

            <div className={cn("space-y-2", pageClasses?.actions)}>
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
    <main className={cn("min-h-screen bg-background px-6 py-10 sm:px-8", pageClassName, pageClasses?.root)}>
      <div className={cn("mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center", pageClasses?.container)}>
        <div className={cn("border-border bg-card w-full space-y-5 rounded-3xl border p-7 shadow-sm", pageClasses?.panel)}>
          <div className={cn("space-y-2", pageClasses?.header)}>
            <h1 className={cn("text-3xl font-semibold tracking-tight", pageClasses?.title)}>
              {title}
            </h1>
            <p className={cn("text-sm text-muted-foreground", pageClasses?.description)}>
              {description}
            </p>
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
