# Database Seeder & Migrations

## Multi-Tenant SaaS Seeding Strategy

### Two-Level Seeding

| Level | Purpose | Command |
|-------|---------|---------|
| **Platform** | Seed your SaaS admin accounts | Manual (create in Supabase Auth) |
| **Tenant** | Seed demo restaurants for testing | `npm run db:seed` |
| **Sample Data** | Reservations, customers for demos | `npm run db:seed:with-data` |

### Demo Tenants

| Restaurant | Tier | Tables | Features |
|------------|------|--------|----------|
| Bella Vista Trattoria | Starter | 15 | QR menu, 90-min slots |
| Sakura Sushi Bar | Free | 8 | Basic only |

### Usage

```bash
# Seed demo tenants only
npm run db:seed:tenants

# Seed with sample reservations/customers
npm run db:seed:with-data

# Full seed (tenants + sample data)
npm run db:seed
```

### Programmatic Usage

```typescript
import { seedNewTenant } from './seed-utils';

// When a new restaurant signs up
await seedNewTenant({
  name: 'New Restaurant',
  slug: 'new-restaurant',
  tier: 'free',
  tables: [
    { number: 'T1', capacity: 4 },
    { number: 'T2', capacity: 2 },
  ]
});
```

---

## Supabase Setup

### 1. Local Development

```bash
# Install Supabase CLI (already in devDependencies)
npm install

# Start local Supabase
npm run supabase:start

# Check status
npm run supabase:status
```

### 2. Connect to Production

```bash
# Login to Supabase
npm run supabase:login

# Link your project
npm run supabase:link

# Push migrations
npm run supabase:db:push

# Reset database (⚠️ destructive)
npm run supabase:db:reset
```

### 3. Environment Setup

Create `.env` in root:

```bash
# Supabase Project
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (for Prisma)
DATABASE_URL="postgresql://postgres:password@your-project.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:password@your-project.supabase.co:5432/postgres"
```

---

## Migration Workflow

### Creating Migrations

1. **Edit schema** in `supabase/migrations/`
2. **Test locally**: `npm run supabase:start` then `supabase:db:reset`
3. **Push to production**: `npm run supabase:db:push`

### Best Practices

- Always use transactions in migrations
- Add indexes for common queries (tenantId + date)
- Test migrations on copy of production data first
- Never delete columns in same migration as adding (2-step process)

---

## RLS Policies

Row Level Security enforces tenant isolation. All tables have:

```sql
CREATE POLICY "tenant_isolation" ON "Table"
  FOR ALL USING ("tenantId" = get_current_tenant_id());
```

The app sets `app.current_tenant_id` from `TENANT_ID` env var before each query.
