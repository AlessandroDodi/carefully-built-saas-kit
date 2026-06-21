#!/usr/bin/env node
import { addComponent } from "./add";
import { listRegistryComponents } from "./registry";

interface ParsedArgs {
  readonly command?: string;
  readonly componentName?: string;
  readonly overwrite: boolean;
  readonly help: boolean;
}

export async function runCli(argv = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);

  if (args.help || !args.command) {
    printHelp();
    return;
  }

  if (args.command === "list") {
    for (const componentName of listRegistryComponents()) {
      console.log(componentName);
    }
    return;
  }

  if (args.command === "add") {
    if (!args.componentName) {
      throw new Error("Missing component name. Example: carefully-built add button");
    }

    const result = await addComponent({
      componentName: args.componentName,
      cwd: process.cwd(),
      overwrite: args.overwrite,
    });

    printAddResult(result);
    return;
  }

  throw new Error(`Unknown command "${args.command}"`);
}

function parseArgs(argv: readonly string[]): ParsedArgs {
  return {
    command: argv[0],
    componentName: argv[1]?.startsWith("-") ? undefined : argv[1],
    overwrite: argv.includes("--overwrite"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function printHelp(): void {
  console.log(`carefully-built

Usage:
  carefully-built list
  carefully-built add <component> [--overwrite]

Components:
  ${listRegistryComponents().join(", ")}
`);
}

function printAddResult(result: Awaited<ReturnType<typeof addComponent>>): void {
  for (const file of result.created) {
    console.log(`created ${file}`);
  }
  for (const file of result.overwritten) {
    console.log(`overwrote ${file}`);
  }
  for (const file of result.skipped) {
    console.log(`skipped ${file}`);
  }

  if (result.dependencies.length > 0) {
    console.log(`dependencies: ${result.dependencies.join(", ")}`);
  }
  if (result.peerDependencies.length > 0) {
    console.log(`peer dependencies: ${result.peerDependencies.join(", ")}`);
  }
}

runCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
