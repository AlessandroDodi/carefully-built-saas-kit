import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packagesDir = path.join(root, 'packages');
const docsDir = path.join(root, 'docs');
const packageDocsDir = path.join(docsDir, 'packages');

const exportedDeclarationPattern =
  /export\s+(?:async\s+)?(function|const|class|interface|type|enum)\s+([A-Za-z0-9_]+)/g;
const namedExportPattern = /export\s*\{([^}]+)\}/g;

function titleFromPackageName(packageName) {
  return packageName.replace('@carefully-built/', '');
}

function sourceUrl(filePath) {
  return path.relative(root, filePath);
}

function classifyExport(name, filePath, packageName, declarationKind = '') {
  const extension = path.extname(filePath);

  if (declarationKind === 'interface' || declarationKind === 'type') {
    return 'Type';
  }

  if (declarationKind === 'enum') {
    return 'Schema';
  }

  if (name.startsWith('use')) {
    return 'Hook';
  }

  if (packageName.includes('convex') || filePath.includes(`${path.sep}convex.`)) {
    return 'Convex helper';
  }

  if (/^[A-Z0-9_]+$/.test(name)) {
    return 'Helper';
  }

  if (/Validator|Schema/.test(name)) {
    return 'Schema';
  }

  if (/Props|Config|Options|Item|Record|Args|Input|State|Value/.test(name)) {
    return 'Type';
  }

  if (extension === '.tsx' && /^[A-Z]/.test(name)) {
    return 'Component';
  }

  return 'Helper';
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath));
      continue;
    }

    if (/\.(tsx?|mts)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseNamedExports(source) {
  const names = [];
  for (const match of source.matchAll(namedExportPattern)) {
    const exports = match[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    for (const item of exports) {
      const [original, alias] = item.split(/\s+as\s+/);
      const name = (alias ?? original).trim();
      if (name && !name.startsWith('type ')) {
        names.push(name.replace(/^type\s+/, ''));
      }
    }
  }

  return names;
}

async function readPackage(packageDir) {
  const packageJsonPath = path.join(packageDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const srcDir = path.join(packageDir, 'src');
  const sourceFiles = await listFiles(srcDir);
  const exports = new Map();

  for (const filePath of sourceFiles) {
    const source = await readFile(filePath, 'utf8');

    for (const match of source.matchAll(exportedDeclarationPattern)) {
      const declarationKind = match[1];
      const name = match[2];
      exports.set(`${name}:${filePath}`, {
        name,
        kind: classifyExport(name, filePath, packageJson.name, declarationKind),
        file: filePath,
      });
    }

    for (const name of parseNamedExports(source)) {
      exports.set(`${name}:${filePath}`, {
        name,
        kind: classifyExport(name, filePath, packageJson.name),
        file: filePath,
      });
    }
  }

  return {
    dir: packageDir,
    folder: path.basename(packageDir),
    packageJson,
    exports: [...exports.values()].sort((left, right) => {
      if (left.kind !== right.kind) {
        return left.kind.localeCompare(right.kind);
      }

      return left.name.localeCompare(right.name);
    }),
  };
}

function packageImportPaths(packageJson) {
  const exports = packageJson.exports;
  if (!exports || typeof exports !== 'object') {
    return [packageJson.name];
  }

  return Object.keys(exports)
    .filter((key) => key !== './package.json')
    .map((key) => (key === '.' ? packageJson.name : `${packageJson.name}/${key.slice(2)}`));
}

function renderExportTable(exports) {
  if (exports.length === 0) {
    return 'No public exports were detected in `src`.\n';
  }

  const rows = [
    '| Export | Kind | Source |',
    '|---|---|---|',
    ...exports.map((item) =>
      `| \`${item.name}\` | ${item.kind} | \`${sourceUrl(item.file)}\` |`,
    ),
  ];

  return `${rows.join('\n')}\n`;
}

function renderUsageSections(pkg) {
  const imports = packageImportPaths(pkg.packageJson);
  const components = pkg.exports.filter((item) => item.kind === 'Component');
  const hooks = pkg.exports.filter((item) => item.kind === 'Hook');
  const helpers = pkg.exports.filter((item) => item.kind === 'Helper' || item.kind === 'Convex helper');
  const types = pkg.exports.filter((item) => item.kind === 'Type' || item.kind === 'Schema');
  const mainImport = imports[0] ?? pkg.packageJson.name;
  const sections = [];

  sections.push(`## Import Paths\n\n${imports.map((item) => `- \`${item}\``).join('\n')}\n`);

  if (components.length > 0) {
    const example = components[0];
    sections.push(`## Component Usage\n
\`\`\`tsx
import { ${example.name} } from '${mainImport}';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
\`\`\`

Components in this package:

${components.map((item) => `- \`${item.name}\`: import from \`${mainImport}\`.`).join('\n')}
`);
  }

  if (hooks.length > 0) {
    const example = hooks[0];
    sections.push(`## Hook Usage\n
\`\`\`tsx
import { ${example.name} } from '${mainImport}';

export function Example() {
  const state = ${example.name}({} as never);
  return null;
}
\`\`\`

Hooks in this package:

${hooks.map((item) => `- \`${item.name}\`: keep app-specific data fetching and mutations in the consuming app.`).join('\n')}
`);
  }

  if (helpers.length > 0) {
    const example = helpers[0];
    sections.push(`## Helper Usage\n
\`\`\`ts
import { ${example.name} } from '${mainImport}';
\`\`\`

Helpers in this package:

${helpers.map((item) => `- \`${item.name}\``).join('\n')}
`);
  }

  if (types.length > 0) {
    sections.push(`## Types And Schemas\n
${types.map((item) => `- \`${item.name}\``).join('\n')}
`);
  }

  return sections.join('\n');
}

function renderPackageDoc(pkg) {
  const title = titleFromPackageName(pkg.packageJson.name);

  return `# ${pkg.packageJson.name}\n
${pkg.packageJson.description ?? 'Reusable Carefully Built SaaS package.'}\n
## Install\n
\`\`\`bash
bun add ${pkg.packageJson.name}
\`\`\`

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.\n
${renderUsageSections(pkg)}

## API Catalog\n
${renderExportTable(pkg.exports)}

## Consumer Responsibilities\n
- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities\n
- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
`;
}

function renderRootReadme(packages) {
  const packageRows = packages
    .map((pkg) => {
      const docPath = `./docs/packages/${pkg.folder}.md`;
      return `| [\`${pkg.packageJson.name}\`](${docPath}) | ${pkg.packageJson.version} | ${pkg.packageJson.description ?? ''} |`;
    })
    .join('\n');

  return `# Carefully Built SaaS Kit\n
Reusable packages for building B2B SaaS apps with React, Next.js, Convex, WorkOS, and strongly typed CRUD/resource patterns.\n
The goal of this repo is to collect the boring-but-important SaaS building blocks once, keep them polished, and reuse them across projects instead of rebuilding tables, filters, organization flows, CRUD screens, and dashboard shells every time.\n
## Packages\n
| Package | Version | Purpose |
|---|---:|---|
${packageRows}

## Documentation\n
- [Package docs](./docs/packages/README.md)
- [Component catalog](./docs/components/README.md)
- [Full API catalog](./docs/api.md)

Every exported component/helper should be discoverable from the generated docs. Package docs explain import paths, basic usage, exported API, consumer responsibilities, and package responsibilities.\n
## Development\n
\`\`\`bash
bun install
bun run docs
bun run typecheck
bun run build
\`\`\`

Packages are designed to be published publicly, but can also be consumed locally with file/tarball dependencies while they are under active development.\n
## Maintenance Rules\n
- Keep app/domain behavior in the consuming app.
- Move reusable SaaS platform behavior into these packages.
- Run \`bun run docs\` after adding or renaming exports.
- Update package READMEs manually when behavior, constraints, or required adapters change.
`;
}

function renderPackageIndex(packages) {
  return `# Package Docs\n
${packages
  .map((pkg) => `- [\`${pkg.packageJson.name}\`](./${pkg.folder}.md): ${pkg.packageJson.description ?? ''}`)
  .join('\n')}
`;
}

function renderComponentIndex(packages) {
  const componentLines = [];
  for (const pkg of packages) {
    for (const item of pkg.exports.filter((entry) => entry.kind === 'Component')) {
      componentLines.push(
        `| \`${item.name}\` | \`${pkg.packageJson.name}\` | [docs](../packages/${pkg.folder}.md) | \`${sourceUrl(item.file)}\` |`,
      );
    }
  }

  return `# Component Catalog\n
This catalog is generated from exported \`.tsx\` components across all package source files.\n
| Component | Package | Docs | Source |
|---|---|---|---|
${componentLines.sort().join('\n')}

## Documentation Standard\n
Each package page includes import paths, basic usage, package responsibilities, consumer responsibilities, and a full API table. For complex components, keep package-specific README notes alongside the generated docs.\n`;
}

function renderApiCatalog(packages) {
  const rows = [];
  for (const pkg of packages) {
    for (const item of pkg.exports) {
      rows.push(`| \`${item.name}\` | ${item.kind} | \`${pkg.packageJson.name}\` | \`${sourceUrl(item.file)}\` |`);
    }
  }

  return `# API Catalog\n
Generated list of public exports detected in \`packages/*/src\`.\n
| Export | Kind | Package | Source |
|---|---|---|---|
${rows.sort().join('\n')}
`;
}

await mkdir(packageDocsDir, { recursive: true });
await mkdir(path.join(docsDir, 'components'), { recursive: true });

const packageFolders = (await readdir(packagesDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(packagesDir, entry.name))
  .sort();

const packages = [];
for (const packageDir of packageFolders) {
  packages.push(await readPackage(packageDir));
}

for (const pkg of packages) {
  await writeFile(path.join(packageDocsDir, `${pkg.folder}.md`), renderPackageDoc(pkg));
}

await writeFile(path.join(packageDocsDir, 'README.md'), renderPackageIndex(packages));
await writeFile(path.join(docsDir, 'components', 'README.md'), renderComponentIndex(packages));
await writeFile(path.join(docsDir, 'api.md'), renderApiCatalog(packages));
await writeFile(path.join(root, 'README.md'), renderRootReadme(packages));
