-- Initial Multi-Tenant Schema Migration
-- This migration sets up the foundation for the restaurant table booking SaaS

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PLATFORM LEVEL (Your SaaS Management)
-- ============================================

CREATE TABLE IF NOT EXISTS platform_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current tenant ID from session (set by application)
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS TEXT AS $$
    SELECT NULLIF(current_setting('app.current_tenant_id', TRUE), '');
$$ LANGUAGE sql;

-- ============================================
-- TENANT (Restaurant Account)
-- ============================================

CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'growth', 'pro');

CREATE TABLE IF NOT EXISTS "Tenant" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    cuisine TEXT,
    timezone TEXT DEFAULT 'UTC',
    
    -- Subscription / Billing
    tier subscription_tier DEFAULT 'free',
    "tierExpiresAt" TIMESTAMP WITH TIME ZONE,
    "maxTables" INTEGER DEFAULT 10,
    "maxStaff" INTEGER DEFAULT 3,
    "commissionPercent" DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Feature flags
    "qrMenuEnabled" BOOLEAN DEFAULT FALSE,
    "paymentsEnabled" BOOLEAN DEFAULT FALSE,
    "analyticsEnabled" BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TENANT SETTINGS
-- ============================================

CREATE TABLE IF NOT EXISTS "TenantSettings" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID UNIQUE NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    
    -- Booking rules
    "bookingWindowDays" INTEGER DEFAULT 30,
    "defaultSlotMinutes" INTEGER DEFAULT 60,
    "minPartySize" INTEGER DEFAULT 1,
    "maxPartySize" INTEGER DEFAULT 12,
    
    -- Operating hours stored as JSON
    "operatingHours" JSONB NOT NULL DEFAULT '{}',
    
    -- Notifications
    "confirmationTemplate" TEXT,
    "reminderHours" INTEGER[] DEFAULT ARRAY[24, 2],
    
    -- Branding
    "primaryColor" TEXT DEFAULT '#3B82F6',
    "logoUrl" TEXT
);

-- ============================================
-- TABLES (Restaurant Floor Plan)
-- ============================================

CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'cleaning');

CREATE TABLE IF NOT EXISTS "Table" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    section TEXT,
    "positionX" INTEGER,
    "positionY" INTEGER,
    status table_status DEFAULT 'available',
    
    UNIQUE("tenantId", number)
);

-- ============================================
-- STAFF
-- ============================================

CREATE TYPE staff_role AS ENUM ('owner', 'manager', 'host', 'server');

CREATE TABLE IF NOT EXISTS "Staff" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    "authId" TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role staff_role NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE("tenantId", "authId"),
    UNIQUE("tenantId", email)
);

-- ============================================
-- RESERVATIONS
-- ============================================

CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show');

CREATE TABLE IF NOT EXISTS "Reservation" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    
    -- Guest info
    "customerId" UUID REFERENCES "Customer"(id),
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "partySize" INTEGER NOT NULL,
    
    -- Booking details
    "tableId" UUID REFERENCES "Table"(id),
    date DATE NOT NULL,
    time TEXT NOT NULL,
    "durationMinutes" INTEGER DEFAULT 120,
    
    -- Status
    status reservation_status DEFAULT 'pending',
    source TEXT DEFAULT 'web',
    
    -- Special requests
    occasion TEXT,
    "seatingPref" TEXT,
    "dietaryNotes" TEXT,
    "specialRequests" TEXT,
    
    -- Payment
    "depositAmount" DECIMAL(10, 2),
    "depositPaid" BOOLEAN DEFAULT FALSE,
    
    -- Notifications
    "confirmationSent" TIMESTAMP WITH TIME ZONE,
    "reminderSent" TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservation_tenant_date ON "Reservation"("tenantId", date);
CREATE INDEX IF NOT EXISTS idx_reservation_tenant_status ON "Reservation"("tenantId", status);

-- ============================================
-- WAITLIST
-- ============================================

CREATE TABLE IF NOT EXISTS "WaitlistEntry" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    "customerId" UUID REFERENCES "Customer"(id),
    "guestName" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "preferredDate" DATE NOT NULL,
    "preferredTime" TEXT,
    
    status TEXT DEFAULT 'waiting',
    "notifiedAt" TIMESTAMP WITH TIME ZONE,
    "expiresAt" TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MENU
-- ============================================

CREATE TABLE IF NOT EXISTS "MenuCategory" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    "sortOrder" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "MenuItem" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    "categoryId" UUID REFERENCES "MenuCategory"(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    "imageUrl" TEXT,
    "isAvailable" BOOLEAN DEFAULT TRUE,
    "isPopular" BOOLEAN DEFAULT FALSE,
    allergens TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CUSTOMERS (Loyalty)
-- ============================================

CREATE TABLE IF NOT EXISTS "Customer" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    "authId" TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    name TEXT,
    points INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 0,
    "lastVisit" TIMESTAMP WITH TIME ZONE,
    preferences JSONB,
    
    UNIQUE("tenantId", phone),
    UNIQUE("tenantId", email)
);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE IF NOT EXISTS "Review" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenantId" UUID NOT NULL REFERENCES "Tenant"(id) ON DELETE CASCADE,
    "customerId" UUID NOT NULL REFERENCES "Customer"(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "isPublic" BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenant_updated_at
    BEFORE UPDATE ON "Tenant"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservation_updated_at
    BEFORE UPDATE ON "Reservation"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
