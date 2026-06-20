const DEFAULT_SUPERADMIN_BASE_PATH = '/super-admin';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`;
}

export function createSuperAdminHref(basePath: string | undefined, path: string): string {
  return `${trimTrailingSlash(basePath ?? DEFAULT_SUPERADMIN_BASE_PATH)}${ensureLeadingSlash(path)}`;
}
