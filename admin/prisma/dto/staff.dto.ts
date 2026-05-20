// Staff DTOs - Restaurant Employees
// Tenant-scoped staff members (not platform users)

import type { StaffRole, SubscriptionTier } from '@prisma/client';

// ============================================
// BASE STAFF DTOs
// ============================================

/**
 * Base staff user returned by API
 */
export interface StaffDto {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Create new staff member (owner/manager only)
 */
export interface CreateStaffDto {
  email: string;
  name: string;
  role: StaffRole;
  // Auth handled separately - invite sent to email
}

/**
 * Update staff member
 */
export interface UpdateStaffDto {
  name?: string;
  role?: StaffRole;
  isActive?: boolean;
}

/**
 * Staff with tenant info (for platform admin)
 */
export interface StaffWithTenantDto extends StaffDto {
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

// ============================================
// STAFF AUTH DTOs
// ============================================

/**
 * Staff login request
 */
export interface StaffLoginDto {
  email: string;
  password: string;
  tenantSlug: string; // Which restaurant they're logging into
}

/**
 * Staff login response with JWT
 */
export interface StaffLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: StaffDto;
  tenant: {
    id: string;
    name: string;
    slug: string;
    tier: SubscriptionTier;
    features: {
      qrMenu: boolean;
      payments: boolean;
      analytics: boolean;
    };
  };
}

// ============================================
// VALIDATION HELPERS
// ============================================

export const staffRoleLabels: Record<StaffRole, string> = {
  owner: 'Owner',
  manager: 'Manager',
  host: 'Host',
  server: 'Server',
};

export function isValidStaffRole(role: string): role is StaffRole {
  return ['owner', 'manager', 'host', 'server'].includes(role);
}
