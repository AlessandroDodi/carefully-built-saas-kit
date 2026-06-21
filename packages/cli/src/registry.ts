import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface RegistryFile {
  readonly source: string;
  readonly target: string;
}

export interface RegistryComponent {
  readonly name: string;
  readonly description: string;
  readonly importPath?: string;
  readonly exports?: readonly string[];
  readonly dependencies: readonly string[];
  readonly peerDependencies: readonly string[];
  readonly files: readonly RegistryFile[];
}

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryRoot = join(packageRoot, "registry");

export function listRegistryComponents(): string[] {
  return readdirSync(join(registryRoot, "ui"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function getRegistryComponent(
  componentName: string,
): RegistryComponent | undefined {
  const manifestPath = join(registryRoot, "ui", componentName, "manifest.json");

  let manifest: Omit<RegistryComponent, "files"> & {
    files: readonly RegistryFile[];
  };

  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as typeof manifest;
  } catch {
    return undefined;
  }

  return {
    ...manifest,
    files: manifest.files.map((file) => ({
      ...file,
      source: join(registryRoot, "ui", componentName, file.source),
    })),
  };
}
