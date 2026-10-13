/**
 * This package has no Node dependency, so `@types/node` is not in scope. But
 * the default Maps key has to be read as
 * `process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` **verbatim**: bundlers
 * substitute that exact expression at build time, and any indirection through
 * `globalThis` is a runtime lookup they cannot see — in the browser there is no
 * `process` at all, so the key comes back empty and Maps never loads.
 *
 * Declares only the shape that one read needs. The read itself is wrapped in a
 * try/catch for runtimes where the binding is genuinely absent.
 */
declare const process: {
  readonly env: Record<string, string | undefined>;
};
