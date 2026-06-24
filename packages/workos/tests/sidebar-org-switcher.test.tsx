import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  getCurrentOrganization,
  OrganizationLogo,
} from "../src/sidebar-org-switcher";

const organizations = [
  { id: "org_primary", name: "Primary" },
  { id: "org_other", name: "Other" },
];

describe("OrganizationLogo", () => {
  test("renders the organization image when a logo URL is available", () => {
    const markup = renderToStaticMarkup(
      <OrganizationLogo
        org={{
          id: "org_123",
          logoUrl: "https://example.com/logo.png",
          name: "Carefully Built",
        }}
        size="sm"
      />,
    );

    expect(markup).toContain('src="https://example.com/logo.png"');
    expect(markup).toContain('alt="Carefully Built logo"');
    expect(markup).not.toContain(">CB<");
  });
});

describe("getCurrentOrganization", () => {
  test("keeps the matching organization when the active id is available", () => {
    expect(getCurrentOrganization(organizations, "org_other")).toEqual(
      organizations[1],
    );
  });

  test("does not silently select the first organization when the active id is stale", () => {
    expect(getCurrentOrganization(organizations, "org_missing")).toBeNull();
  });

  test("does not silently select the first organization when a multi-org user has no active id", () => {
    expect(getCurrentOrganization(organizations, null)).toBeNull();
  });

  test("selects the only organization when there is no active id", () => {
    expect(getCurrentOrganization([organizations[0]!], null)).toEqual(
      organizations[0],
    );
  });
});
