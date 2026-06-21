import { constants } from "node:fs";
import { access, copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";

import { getRegistryComponent } from "./registry";

export interface AddComponentOptions {
  readonly componentName: string;
  readonly cwd: string;
  readonly overwrite: boolean;
}

export interface AddComponentResult {
  readonly componentName: string;
  readonly created: string[];
  readonly overwritten: string[];
  readonly skipped: string[];
  readonly dependencies: readonly string[];
  readonly peerDependencies: readonly string[];
}

export async function addComponent({
  componentName,
  cwd,
  overwrite,
}: AddComponentOptions): Promise<AddComponentResult> {
  const component = getRegistryComponent(componentName);

  if (!component) {
    throw new Error(`Unknown component "${componentName}"`);
  }

  const created: string[] = [];
  const overwritten: string[] = [];
  const skipped: string[] = [];
  const projectConfig = await readProjectConfig(cwd);

  for (const file of component.files) {
    const target = resolveTargetPath(file.target, projectConfig);
    const targetPath = join(cwd, target);
    const exists = await fileExists(targetPath);

    if (exists && !overwrite) {
      skipped.push(target);
      continue;
    }

    await mkdir(dirname(targetPath), { recursive: true });
    await copyFile(file.source, targetPath);

    if (exists) {
      overwritten.push(target);
    } else {
      created.push(target);
    }
  }

  return {
    componentName: component.name,
    created,
    overwritten,
    skipped,
    dependencies: component.dependencies,
    peerDependencies: component.peerDependencies,
  };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

interface ProjectConfig {
  readonly uiAlias?: string;
  readonly utilsAlias?: string;
  readonly aliasPrefix?: string;
  readonly aliasTarget?: string;
}

async function readProjectConfig(cwd: string): Promise<ProjectConfig> {
  const [componentsJson, tsconfigJson] = await Promise.all([
    readJsonFile(join(cwd, "components.json")),
    readJsonFile(join(cwd, "tsconfig.json")),
  ]);

  return {
    uiAlias: readString(componentsJson, ["aliases", "ui"]),
    utilsAlias: readString(componentsJson, ["aliases", "utils"]),
    ...readPrimaryTsconfigAlias(tsconfigJson),
  };
}

function resolveTargetPath(target: string, config: ProjectConfig): string {
  if (target === "lib/utils.ts" && config.utilsAlias) {
    return resolveAliasPath(`${config.utilsAlias}.ts`, config);
  }

  if (target.startsWith("components/ui/") && config.uiAlias) {
    const fileName = target.slice("components/ui/".length);
    return resolveAliasPath(`${config.uiAlias}/${fileName}`, config);
  }

  return target;
}

function resolveAliasPath(path: string, config: ProjectConfig): string {
  if (
    config.aliasPrefix &&
    config.aliasTarget &&
    path.startsWith(config.aliasPrefix)
  ) {
    return cleanPath(path.replace(config.aliasPrefix, config.aliasTarget));
  }

  if (path.startsWith("@/")) {
    return cleanPath(path.slice(2));
  }

  return cleanPath(path);
}

function readPrimaryTsconfigAlias(value: unknown): Pick<
  ProjectConfig,
  "aliasPrefix" | "aliasTarget"
> {
  const paths = readRecord(readRecord(value, "compilerOptions"), "paths");
  const aliasTargets = readArray(paths, "@/*");
  const aliasTarget = aliasTargets.find((entry) => typeof entry === "string");

  if (typeof aliasTarget !== "string") {
    return {};
  }

  return {
    aliasPrefix: "@/",
    aliasTarget: aliasTarget.replace(/\/\*$/, "/"),
  };
}

async function readJsonFile(path: string): Promise<unknown> {
  try {
    return JSON.parse(stripJsonComments(await readFile(path, "utf8")));
  } catch {
    return undefined;
  }
}

function stripJsonComments(source: string): string {
  return source.replace(/^\s*\/\/.*$/gm, "");
}

function readString(value: unknown, path: readonly string[]): string | undefined {
  let current = value;

  for (const key of path) {
    current = readRecord(current, key);
  }

  return typeof current === "string" ? current : undefined;
}

function readRecord(value: unknown, key: string): unknown {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  return (value as Record<string, unknown>)[key];
}

function readArray(value: unknown, key: string): unknown[] {
  const array = readRecord(value, key);
  return Array.isArray(array) ? array : [];
}

function cleanPath(path: string): string {
  return normalize(path).replace(/^\.\//, "");
}
