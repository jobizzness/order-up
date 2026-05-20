// User DTOs - Platform Admins & Restaurant Owners
// Platform-level users who manage the SaaS or own restaurants

import type { UserRole, SubscriptionTier } from '@prisma/client';

// ============================================
// PLATFORM USER DTOs
// ============================================

/**
 * Platform user (admin or restaurant owner)
 */
export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create platform user (owner signup)
 */
export interface CreateUserDto {
  email: string;
  name: string;
  role?: UserRole;
}

/**
 * Update user profile
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  image?: string;
}

// ============================================
// USER WITH TENANTS
// ============================================

/**
 * User's tenant (restaurant they own)
 */
export interface UserTenantDto {
  id: string;
  slug: string;
  name: string;
  tier: SubscriptionTier;
  isApproved: boolean;
  createdAt: Date;
}

/**
 * User with their owned restaurants
 */
export interface UserWithTenantsDto extends UserDto {
  ownedTenants: UserTenantDto[];
}

// ============================================
// PLATFORM ADMIN DTOs
// ============================================

/**
 * Platform admin (SaaS staff)
 */
export interface PlatformAdminDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

/**
 * Create platform admin
 */
export interface CreatePlatformAdminDto {
  authId: string;
  email: string;
  name: string;
}

// ============================================
// USER AUTH DTOs
// ============================================

/**
 * User login request
 */
export interface UserLoginDto {
  email: string;
  password: string;
}

/**
 * User login response
 */
export interface UserLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserWithTenantsDto;
}

// ============================================
// OWNER ONBOARDING DTOs
// ============================================

/**
 * Owner signup with first restaurant
 */
export interface OwnerSignupDto {
  email: string;
  password: string;
  name: string;
  restaurantName: string;
  restaurantSlug: string;
}

/**
 * Owner signup response
 */
export interface OwnerSignupResponseDto {
  user: UserDto;
  tenant: {
    id: string;
    slug: string;
    name: string;
  };
  message: string; // "Check email to verify account"
}

// ============================================
// VALIDATION HELPERS
// ============================================

export const userRoleLabels: Record<UserRole, string> = {
  platform_admin: 'Platform Admin',
  restaurant_owner: 'Restaurant Owner',
};

export function isValidUserRole(role: string): role is UserRole {
  return ['platform_admin', 'restaurant_owner'].includes(role);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
