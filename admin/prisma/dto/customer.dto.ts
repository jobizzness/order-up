// Customer DTOs - Dining Guests
// Restaurant customers with loyalty tracking

import type { ReservationStatus } from '@prisma/client';

// ============================================
// CUSTOMER PREFERENCES
// ============================================

/**
 * Customer preferences for seating and dining
 */
export interface CustomerPreferences {
  seating?: string; // 'booth', 'window', 'quiet', etc.
  dietary?: string[]; // ['vegetarian', 'gluten-free', etc.]
  occasion?: string; // 'birthday', 'anniversary', 'business'
}

// ============================================
// BASE CUSTOMER DTOs
// ============================================

/**
 * Base customer returned by API
 */
export interface CustomerDto {
  id: string;
  tenantId: string;
  phone?: string;
  email?: string;
  name?: string;
  points: number;
  visits: number;
  lastVisit?: Date;
  preferences: CustomerPreferences;
  createdAt: Date;
}

/**
 * Create customer (from reservation or registration)
 */
export interface CreateCustomerDto {
  phone?: string;
  email?: string;
  name?: string;
  preferences?: CustomerPreferences;
}

/**
 * Update customer profile
 */
export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  email?: string;
  preferences?: CustomerPreferences;
}

// ============================================
// CUSTOMER WITH RESERVATIONS
// ============================================

/**
 * Simplified reservation info for customer profile
 */
export interface CustomerReservationDto {
  id: string;
  date: Date;
  time: string;
  partySize: number;
  status: ReservationStatus;
  restaurantName: string;
}

/**
 * Customer with reservation history
 */
export interface CustomerWithReservationsDto extends CustomerDto {
  reservations: CustomerReservationDto[];
}

// ============================================
// CUSTOMER AUTH DTOs
// ============================================

/**
 * Customer login (phone-based for loyalty)
 */
export interface CustomerLoginDto {
  phone: string;
  otp?: string; // For SMS verification
}

/**
 * Customer login/register response
 */
export interface CustomerLoginResponseDto {
  accessToken: string;
  user: CustomerDto;
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function isValidPhone(phone: string): boolean {
  // Basic international phone validation
  return /^\+[1-9]\d{1,14}$/.test(phone);
}
