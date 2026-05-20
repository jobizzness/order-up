-- Multi-Tenant SaaS Seed Data
-- Run: psql $DATABASE_URL -f supabase/seed.sql

-- ============================================
-- PLATFORM ADMIN (for your SaaS management)
-- ============================================
-- Note: Create this user manually in Supabase Auth first, then insert here
-- INSERT INTO platform_admins (auth_id, email, name) VALUES ('auth-uuid-here', 'admin@yourplatform.com', 'Platform Admin');

-- ============================================
-- DEMO TENANT 1: "Bella Vista" (Italian Restaurant)
-- ============================================
DO $$
DECLARE
    demo_tenant_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Insert tenant
    INSERT INTO "Tenant" (id, slug, name, description, address, phone, email, cuisine, timezone, tier, max_tables, max_staff)
    VALUES (
        demo_tenant_id,
        'bella-vista',
        'Bella Vista Trattoria',
        'Authentic Italian dining with handmade pasta and wood-fired pizzas',
        '123 Main St, Downtown',
        '+1-555-0123',
        'hello@bellavista.example',
        'Italian',
        'America/New_York',
        'starter',
        25,
        10
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert tenant settings
    INSERT INTO "TenantSettings" (id, "tenantId", "bookingWindowDays", "defaultSlotMinutes", "minPartySize", "maxPartySize", "operatingHours", "reminderHours", "primaryColor")
    VALUES (
        gen_random_uuid(),
        demo_tenant_id,
        30,
        90,
        1,
        12,
        '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "10:00", "close": "23:00"}, "sunday": {"open": "10:00", "close": "21:00"}}'::jsonb,
        ARRAY[24, 2],
        '#E63946'
    )
    ON CONFLICT ("tenantId") DO NOTHING;

    -- Insert tables (15 tables for demo)
    INSERT INTO "Table" (id, "tenantId", number, capacity, section, "positionX", "positionY", status) VALUES
    (gen_random_uuid(), demo_tenant_id, 'A1', 2, 'Main Dining', 100, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'A2', 2, 'Main Dining', 200, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'A3', 4, 'Main Dining', 300, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'A4', 4, 'Main Dining', 400, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'A5', 6, 'Main Dining', 500, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'B1', 2, 'Window', 100, 200, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'B2', 2, 'Window', 200, 200, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'B3', 4, 'Window', 300, 200, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'P1', 4, 'Patio', 100, 300, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'P2', 4, 'Patio', 200, 300, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'P3', 6, 'Patio', 300, 300, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'C1', 8, 'Private', 100, 400, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'C2', 10, 'Private', 200, 400, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'Bar1', 2, 'Bar', 100, 500, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'Bar2', 2, 'Bar', 200, 500, 'available')
    ON CONFLICT DO NOTHING;

    -- Insert menu categories
    INSERT INTO "MenuCategory" (id, "tenantId", name, "sortOrder") VALUES
    (gen_random_uuid(), demo_tenant_id, 'Antipasti', 1),
    (gen_random_uuid(), demo_tenant_id, 'Primi Piatti', 2),
    (gen_random_uuid(), demo_tenant_id, 'Secondi', 3),
    (gen_random_uuid(), demo_tenant_id, 'Pizza', 4),
    (gen_random_uuid(), demo_tenant_id, 'Dolci', 5),
    (gen_random_uuid(), demo_tenant_id, 'Bevande', 6)
    ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- DEMO TENANT 2: "Sakura Sushi" (Japanese Restaurant) - FREE TIER
-- ============================================
DO $$
DECLARE
    demo_tenant_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
    INSERT INTO "Tenant" (id, slug, name, description, address, phone, email, cuisine, timezone, tier, max_tables, max_staff, "qrMenuEnabled")
    VALUES (
        demo_tenant_id,
        'sakura-sushi',
        'Sakura Sushi Bar',
        'Fresh sushi and sashimi daily',
        '456 Oak Ave, Westside',
        '+1-555-0456',
        'info@sakura.example',
        'Japanese',
        'America/Los_Angeles',
        'free',
        10,
        3,
        false
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO "TenantSettings" (id, "tenantId", "bookingWindowDays", "defaultSlotMinutes", "minPartySize", "maxPartySize", "operatingHours", "reminderHours", "primaryColor")
    VALUES (
        gen_random_uuid(),
        demo_tenant_id,
        14,
        60,
        1,
        8,
        '{"monday": {"open": "17:00", "close": "22:00"}, "tuesday": {"open": "17:00", "close": "22:00"}, "wednesday": {"open": "17:00", "close": "22:00"}, "thursday": {"open": "17:00", "close": "22:00"}, "friday": {"open": "17:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'::jsonb,
        ARRAY[24],
        '#2A9D8F'
    )
    ON CONFLICT ("tenantId") DO NOTHING;

    -- Insert 8 tables (under free tier limit)
    INSERT INTO "Table" (id, "tenantId", number, capacity, section, "positionX", "positionY", status) VALUES
    (gen_random_uuid(), demo_tenant_id, 'S1', 2, 'Sushi Bar', 100, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'S2', 2, 'Sushi Bar', 150, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'S3', 2, 'Sushi Bar', 200, 100, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'T1', 4, 'Table', 100, 200, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'T2', 4, 'Table', 200, 200, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'T3', 4, 'Table', 300, 200, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'P1', 2, 'Private', 100, 300, 'available'),
    (gen_random_uuid(), demo_tenant_id, 'P2', 6, 'Private', 200, 300, 'available')
    ON CONFLICT DO NOTHING;

END $$;
