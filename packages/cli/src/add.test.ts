import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

import { addComponent } from "./add";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "carefully-built-cli-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("addComponent", () => {
  test("copies registry files into a target project", async () => {
    const result = await addComponent({
      componentName: "button",
      cwd: tempDir,
      overwrite: false,
    });

    expect(result.created).toEqual([
      "components/ui/button.tsx",
      "lib/utils.ts",
    ]);
    expect(result.skipped).toEqual([]);

    await expect(
      readFile(join(tempDir, "components/ui/button.tsx"), "utf8"),
    ).resolves.toContain("function Button");
    await expect(readFile(join(tempDir, "lib/utils.ts"), "utf8")).resolves
      .toContain("export function cn");
  });

  test("skips existing files unless overwrite is enabled", async () => {
    const targetFile = join(tempDir, "components/ui/button.tsx");
    await Bun.write(targetFile, "custom button");

    const result = await addComponent({
      componentName: "button",
      cwd: tempDir,
      overwrite: false,
    });

    expect(result.skipped).toContain("components/ui/button.tsx");
    await expect(readFile(targetFile, "utf8")).resolves.toBe("custom button");
  });

  test("uses shadcn aliases and tsconfig paths when present", async () => {
    await writeFile(
      join(tempDir, "components.json"),
      JSON.stringify({
        aliases: {
          ui: "@/components/ui",
          utils: "@/lib/utils",
        },
      }),
    );
    await writeFile(
      join(tempDir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          paths: {
            "@/*": ["./src/*"],
          },
        },
      }),
    );

    const result = await addComponent({
      componentName: "button",
      cwd: tempDir,
      overwrite: false,
    });

    expect(result.created).toEqual([
      "src/components/ui/button.tsx",
      "src/lib/utils.ts",
    ]);
    await expect(
      readFile(join(tempDir, "src/components/ui/button.tsx"), "utf8"),
    ).resolves.toContain('from "@/lib/utils"');
  });

  test("skips existing files at resolved shadcn paths", async () => {
    await writeFile(
      join(tempDir, "components.json"),
      JSON.stringify({
        aliases: {
          ui: "@/components/ui",
          utils: "@/lib/utils",
        },
      }),
    );
    await writeFile(
      join(tempDir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          paths: {
            "@/*": ["./src/*"],
          },
        },
      }),
    );
    const existingButton = join(tempDir, "src/components/ui/button.tsx");
    await mkdir(dirname(existingButton), { recursive: true });
    await writeFile(existingButton, "existing");

    const result = await addComponent({
      componentName: "button",
      cwd: tempDir,
      overwrite: false,
    });

    expect(result.skipped).toContain("src/components/ui/button.tsx");
    await expect(readFile(existingButton, "utf8")).resolves.toBe("existing");
  });

  test("overwrites existing files when requested", async () => {
    const targetFile = join(tempDir, "components/ui/button.tsx");
    await mkdir(dirname(targetFile), { recursive: true });
    await writeFile(targetFile, "custom button");

    const result = await addComponent({
      componentName: "button",
      cwd: tempDir,
      overwrite: true,
    });

    expect(result.overwritten).toContain("components/ui/button.tsx");
    await expect(readFile(targetFile, "utf8")).resolves.toContain(
      "function Button",
    );
  });

  test("throws for unknown components", async () => {
    await expect(
      addComponent({
        componentName: "missing",
        cwd: tempDir,
        overwrite: false,
      }),
    ).rejects.toThrow('Unknown component "missing"');
  });
});
