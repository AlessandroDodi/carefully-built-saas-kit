import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { OrganizationLogo } from "../src/sidebar-org-switcher";

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
