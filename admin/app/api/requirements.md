# Restaurant Table Booking API — Requirements

## Overview

Multi-tenant SaaS backend for restaurant table booking system. You host the backend; buyers deploy their own single-tenant app instances.

---

## Architecture

### Multi-Tenant SaaS Model

| Component | Hosted By | Description |
|-----------|-----------|-------------|
| Database | You | Single Supabase PostgreSQL, tenant-scoped data |
| Auth | You | Supabase Auth with tenant isolation |
| Storage | You | Tenant-prefixed file paths |
| API Layer | Buyer | Deployed with their `TENANT_ID` env var |
| Web App | Buyer | Single-tenant Next.js app |
| Mobile App | Buyer | Single-tenant Expo app |

### Data Isolation

- Every table has `tenantId` column
- RLS policies enforce `tenantId = current_setting('app.current_tenant_id')`
- App instances read `TENANT_ID` from environment (not user input)
- No cross-tenant data leakage possible

---

## Database Schema

### Core Models

```
Tenant (restaurant account)
├── slug (unique subdomain)
├── tier (free | starter | growth | pro)
├── maxTables, maxStaff (tier limits)
├── qrMenuEnabled, paymentsEnabled (feature flags)
├── settings (one-to-one)
├── tables, staff, reservations, waitlist
├── menuCategories, menuItems
├── customers (loyalty), reviews
```

### Key Relationships

- **Reservation** → Table (optional assignment)
- **Reservation** → Customer (optional loyalty link)
- **WaitlistEntry** → Customer
- **MenuItem** → MenuCategory
- **Review** → Customer
- **Staff** → Supabase auth.users (via authId)

### Enums

| Enum | Values |
|------|--------|
| SubscriptionTier | `free`, `starter`, `growth`, `pro` |
| ReservationStatus | `pending`, `confirmed`, `seated`, `completed`, `cancelled`, `no_show` |
| TableStatus | `available`, `occupied`, `reserved`, `cleaning` |
| StaffRole | `owner`, `manager`, `host`, `server` |

---

## Freemium Tiers

| Feature | Free | Starter | Growth | Pro |
|---------|------|---------|--------|-----|
| Tables | 10 | 25 | Unlimited | Unlimited |
| Staff | 3 | 10 | Unlimited | Unlimited |
| Monthly Bookings | 100 | 500 | Unlimited | Unlimited |
| QR Menu | ❌ | ✅ | ✅ | ✅ |
| Online Payments | ❌ | ❌ | ✅ | ✅ |
| Analytics | ❌ | ❌ | ✅ | ✅ |
| Custom Domain | ❌ | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ❌ | ✅ |
| Commission | 0% | 0% | 2% | Custom |

---

## API Endpoints

### Reservations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/reservations` | Staff | List tenant reservations |
| `POST` | `/api/reservations` | Public | Create booking |
| `GET` | `/api/reservations/[id]` | Staff | Get details |
| `PATCH` | `/api/reservations/[id]` | Staff | Update status, assign table |
| `DELETE` | `/api/reservations/[id]` | Staff | Cancel |

### Tables & Floor Plan

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tables` | Staff | List all tables |
| `POST` | `/api/tables` | Staff | Create (enforces tier limit) |
| `PATCH` | `/api/tables/[id]` | Staff | Update position, status |
| `GET` | `/api/tables/availability` | Public | Available slots |

### Waitlist

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/waitlist` | Staff | View entries |
| `POST` | `/api/waitlist` | Public | Join waitlist |
| `PATCH` | `/api/waitlist/[id]` | Staff | Notify/convert |

### Menu (QR)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/menu` | Public | QR menu (if enabled) |
| `POST` | `/api/menu` | Staff | Create category/item |
| `PATCH` | `/api/menu/[id]` | Staff | Update |

### Staff

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/staff` | Owner | List staff |
| `POST` | `/api/staff` | Owner | Invite (enforces tier limit) |
| `DELETE` | `/api/staff/[id]` | Owner | Remove |

### Settings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/settings` | Staff | Get tenant config |
| `PATCH` | `/api/settings` | Owner | Update branding, hours |

---

## Tier Enforcement

### API Layer Validation

```typescript
// Example: Table creation limit
currentCount = await prisma.table.count({ where: { tenantId } })
if (currentCount >= tenant.maxTables) {
  return 403, { error: 'Limit reached', upgradeUrl: '/upgrade' }
}
```

### Feature Flags

```typescript
// Example: QR menu access
if (!tenant.qrMenuEnabled) {
  return 403, { error: 'Upgrade to Starter for QR menu' }
}
```

---

## Environment Configuration

### Buyer App Configuration

```bash
# Backend (your hosted Supabase)
DATABASE_URL="postgresql://postgres:...@your-project.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:...@your-project.supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Tenant Identity (unique per deployment)
TENANT_ID="uuid-of-restaurant"
TENANT_SLUG="restaurant-name"

# Your SaaS Platform
PLATFORM_URL="https://your-saas.com"
```

---

## Security

### Row Level Security (RLS)

```sql
-- All tables enforce tenant isolation
CREATE POLICY "tenant_isolation" ON "Reservation"
  FOR ALL USING ("tenantId" = get_current_tenant_id());
```

### Authentication Flow

1. Staff logs in via Supabase Auth
2. API verifies `staff.authId = user.id` AND `staff.tenantId = TENANT_ID`
3. Reject if staff doesn't belong to this tenant
4. Same email can exist across different tenants

### File Storage

- Path: `tenants/{tenantId}/menus/{filename}`
- RLS: Staff can only write to their tenant path
- Public read for QR menu images

---

## Implementation Phases

| Phase | Deliverable |
|-------|-------------|
| 1 | Multi-tenant Prisma schema, tenant isolation |
| 2 | Tenant provisioning API (signup → create tenant) |
| 3 | Tier enforcement in all create endpoints |
| 4 | Reservation, table, waitlist CRUD |
| 5 | QR menu builder with feature flag |
| 6 | Payment integration (Growth+ tier) |
| 7 | Platform admin dashboard (manage tenants) |
| 8 | Real-time availability, notifications |

---

## Buyer Onboarding Flow

1. **Sign up** on your SaaS platform
2. **Select tier** (or start free)
3. **Tenant created** in database with UUID
4. **Deploy app** with `TENANT_ID={uuid}` env var
5. **Staff invites** sent (respects tier staff limit)
6. **Configure** tables, hours, menu
7. **Go live** — customers can book

---

## Upgrade Flow

1. Buyer hits limit (e.g., tries to add 11th table on Free)
2. API returns `403 { error, current, max, upgradeUrl }`
3. UI shows upgrade prompt with link to platform
4. Buyer upgrades on your SaaS site
5. You update `tenant.tier` in database
6. Features unlock instantly (no redeploy needed)
