import { describe, expect, test } from 'bun:test';

import { createSuperAdminHref } from '../src/navigation';

describe('createSuperAdminHref', () => {
  test('uses the default superadmin base path', () => {
    expect(createSuperAdminHref(undefined, '/applications/org_123')).toBe(
      '/super-admin/applications/org_123',
    );
  });

  test('uses a dashboard-mounted base path without double slashes', () => {
    expect(createSuperAdminHref('/dashboard/super-admin/', '/applications/org_123')).toBe(
      '/dashboard/super-admin/applications/org_123',
    );
  });
});
