export type SuperAdminPlan = 'enterprise' | 'professional' | 'starter' | 'free';
export type SuperAdminStatus = 'attivo' | 'prova' | 'sospeso';

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  organizations?: SuperAdminUserOrganization[];
  role: string;
  organizationId?: string;
  createdAt: string;
}

export interface SuperAdminUserOrganization {
  id: string;
  name: string;
  logoUrl: string | null;
  role: string;
}

export interface SuperAdminApplication {
  id: string;
  name: string;
  companyName: string;
  logoUrl: string | null;
  plan: SuperAdminPlan | null;
  status: SuperAdminStatus | null;
  userCount: number;
  adminCount: number;
  createdAt: string;
  roles: SuperAdminRole[];
  featureFlags: SuperAdminFeatureFlag[];
  users: SuperAdminUser[];
}

export interface SuperAdminData {
  applications: SuperAdminApplication[];
  users: SuperAdminUser[];
  error?: string;
}

export interface SuperAdminFeatureFlag {
  id: string;
  name: string;
  slug: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminRole {
  name: string;
  slug: string;
}

export function formatShortDate(value: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
