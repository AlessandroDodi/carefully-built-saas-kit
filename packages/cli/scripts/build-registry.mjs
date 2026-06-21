import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const uiRoot = join(repoRoot, "packages/ui/src");
const registryRoot = join(repoRoot, "packages/cli/registry/ui");

const externalDependencies = [
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
];

const externalPeerDependencies = [
  "react",
  "react-dom",
  "radix-ui",
  "lucide-react",
  "react-day-picker",
  "vaul",
];

await rm(registryRoot, { recursive: true, force: true });
await mkdir(registryRoot, { recursive: true });

const indexSource = await readFile(join(uiRoot, "index.ts"), "utf8");
const exportPaths = [...indexSource.matchAll(/export \* from ['"](.+)['"];/g)]
  .map((match) => match[1])
  .filter((source) => source !== "./utils/cn");

for (const exportPath of exportPaths) {
  const entry = await resolveSourceFile(join(uiRoot, exportPath));
  const slug = toSlug(exportPath);
  const files = [...(await collectFiles(entry))].sort();
  const componentRoot = join(registryRoot, slug);

  await mkdir(componentRoot, { recursive: true });

  const manifestFiles = [];

  for (const sourcePath of files) {
    const registryRelativePath = toRegistryFilePath(sourcePath);
    const target = toTargetPath(sourcePath);
    const outputPath = join(componentRoot, registryRelativePath);
    const source = rewriteImports(await readFile(sourcePath, "utf8"), sourcePath);

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, source);
    manifestFiles.push({
      source: registryRelativePath,
      target,
    });
  }

  await writeFile(
    join(componentRoot, "manifest.json"),
    `${JSON.stringify(
      {
        name: slug,
        description: `Editable source registry entry for ${slug}.`,
        importPath: "@carefully-built/ui",
        exports: collectExportNames([entry]),
        dependencies: externalDependencies,
        peerDependencies: externalPeerDependencies,
        files: manifestFiles,
      },
      null,
      2,
    )}\n`,
  );
}

function collectExportNames(files) {
  const names = new Set();

  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");

    for (const match of source.matchAll(
      /export\s+(?:async\s+)?(?:function|const|class|interface|type)\s+([A-Za-z_$][\w$]*)/g,
    )) {
      names.add(match[1]);
    }

    for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
      for (const part of match[1].split(",")) {
        const name = part
          .trim()
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)
          .at(-1)
          ?.trim();

        if (name && /^[A-Za-z_$][\w$]*$/.test(name)) {
          names.add(name);
        }
      }
    }
  }

  return [...names].sort();
}

function toSlug(exportPath) {
  const parts = exportPath.replace(/^\.\//, "").split("/");
  return parts.at(-1) === "index" ? parts.at(-2) : parts.at(-1);
}

async function collectFiles(entry) {
  const files = new Set();
  await visit(entry, files);
  await visit(join(uiRoot, "utils/cn.ts"), files);
  return files;
}

async function visit(filePath, files) {
  if (files.has(filePath)) {
    return;
  }

  files.add(filePath);

  const source = await readFile(filePath, "utf8");
  const imports = [
    ...source.matchAll(/(?:import|export)\s+(?:[^'"]+\s+from\s+)?['"](\.{1,2}\/[^'"]+)['"]/g),
  ];

  for (const match of imports) {
    const dependency = await resolveSourceFile(join(dirname(filePath), match[1]));
    await visit(dependency, files);
  }
}

async function resolveSourceFile(pathWithoutExtension) {
  const candidates = [".ts", ".tsx"].includes(extname(pathWithoutExtension))
    ? [pathWithoutExtension]
    : [
        `${pathWithoutExtension}.tsx`,
        `${pathWithoutExtension}.ts`,
        join(pathWithoutExtension, "index.ts"),
        join(pathWithoutExtension, "index.tsx"),
      ];

  for (const candidate of candidates) {
    try {
      await readFile(candidate, "utf8");
      return candidate;
    } catch {
      // Continue.
    }
  }

  throw new Error(`Cannot resolve source file: ${pathWithoutExtension}`);
}

function rewriteImports(source, sourcePath) {
  return source.replace(
    /((?:import|export)\s+(?:[^'"]+\s+from\s+)?['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (_match, prefix, specifier, suffix) => {
      const dependencyPath = resolveSourcePathSync(join(dirname(sourcePath), specifier));
      return `${prefix}${toImportSpecifier(dependencyPath)}${suffix}`;
    },
  );
}

function resolveSourcePathSync(pathWithoutExtension) {
  const candidates = [".ts", ".tsx"].includes(extname(pathWithoutExtension))
    ? [pathWithoutExtension]
    : [
        `${pathWithoutExtension}.tsx`,
        `${pathWithoutExtension}.ts`,
        join(pathWithoutExtension, "index.ts"),
        join(pathWithoutExtension, "index.tsx"),
      ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

function toImportSpecifier(sourcePath) {
  if (sourcePath === join(uiRoot, "utils/cn.ts")) {
    return "@/lib/utils";
  }

  return `@/${stripExtension(toTargetPath(sourcePath))}`;
}

function toRegistryFilePath(sourcePath) {
  return relative(uiRoot, sourcePath).split("/").join(posix.sep);
}

function toTargetPath(sourcePath) {
  if (sourcePath === join(uiRoot, "utils/cn.ts")) {
    return "lib/utils.ts";
  }

  const registryPath = toRegistryFilePath(sourcePath);

  if (registryPath.startsWith("primitives/")) {
    return `components/ui/${registryPath.slice("primitives/".length)}`;
  }

  if (registryPath.startsWith("overlays/")) {
    return `components/ui/${registryPath.slice("overlays/".length)}`;
  }

  if (registryPath.startsWith("utils/")) {
    return `components/ui/${registryPath.slice("utils/".length)}`;
  }

  return `components/ui/${registryPath}`;
}

function stripExtension(path) {
  return path.replace(/\.(ts|tsx)$/, "");
}
