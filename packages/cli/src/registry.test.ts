import { describe, expect, test } from "bun:test";

import { getRegistryComponent, listRegistryComponents } from "./registry";

describe("registry", () => {
  test("lists available components in registry order", () => {
    expect(listRegistryComponents()).toEqual(
      expect.arrayContaining([
        "avatar",
        "button",
        "calendar",
        "card",
        "dialog",
        "dropdown-menu",
        "empty-state",
        "responsive-sheet",
        "searchable-select",
        "smart-table",
        "table-toolbar",
        "tooltip",
        "user-picker",
      ]),
    );
    expect(listRegistryComponents()).toHaveLength(42);
  });

  test("loads a component manifest with files and dependencies", () => {
    const component = getRegistryComponent("button");

    expect(component).toMatchObject({
      name: "button",
      importPath: "@carefully-built/ui",
      exports: expect.arrayContaining(["Button", "buttonVariants"]),
      dependencies: expect.arrayContaining([
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
      ]),
      peerDependencies: expect.arrayContaining(["react", "radix-ui"]),
    });
    expect(component?.files).toEqual(
      expect.arrayContaining([
        {
          source: expect.stringContaining("button.tsx"),
          target: "components/ui/button.tsx",
        },
        {
          source: expect.stringContaining("cn.ts"),
          target: "lib/utils.ts",
        },
      ]),
    );
  });

  test("returns undefined for unknown components", () => {
    expect(getRegistryComponent("missing")).toBeUndefined();
  });

  test("loads composed components with their relative dependency closure", () => {
    const component = getRegistryComponent("smart-table");

    expect(component?.files.map((file) => file.target)).toEqual(
      expect.arrayContaining([
        "components/ui/smart-table/SmartTable.tsx",
        "components/ui/smart-table/DesktopView.tsx",
        "components/ui/smart-table/MobileView.tsx",
        "components/ui/smart-table/types.ts",
        "components/ui/button.tsx",
        "lib/utils.ts",
      ]),
    );
  });
});
