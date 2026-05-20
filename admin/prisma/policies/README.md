# Row Level Security Policies

SQL files in this folder define Supabase RLS policies.
Run them manually in the Supabase SQL editor or via `psql`.

## Convention

One file per table: `<table>.sql`

Each file should:
1. Enable RLS on the table
2. Drop existing policies before recreating (idempotent)
3. Define SELECT / INSERT / UPDATE / DELETE policies as needed

## Tables

| File | Table | Status |
|------|-------|--------|
| `users.sql` | `User` | ✓ |
| `tenants.sql` | `Tenant` | ✓ |
| `tenant_settings.sql` | `TenantSettings` | ✓ |
