# Restaurant Menu Dashboard Implementation Plan

We will implement a premium, interactive Menu Builder in the Next.js admin dashboard. This interface will allow restaurant owners to manage their menu categories and menu items, including details like descriptions, pricing, availability, popularity badges, allergens, and item images.

## User Review Required

> [!IMPORTANT]
> **Supabase Storage Bucket**: We will configure file uploads to go to a Supabase storage bucket named `menus`. We will handle bucket creation dynamically if the bucket does not exist or has RLS policies.
> **Tenant Scoping**: All API routes (`/api/categories` and `/api/menu`) will be updated to fetch and create items restricted strictly to the logged-in user's active tenant (`user.ownedTenants[0].id`).

## Open Questions

> [!NOTE]
> 1. **Allergens representation**: We will allow owners to enter allergens as a comma-separated list or select from standard preset tags (e.g., Gluten-Free, Dairy-Free, Nuts, Shellfish).
> 2. **Image storage bucket accessibility**: Should the `menus` bucket be set to public read so that the consumer Expo app can fetch item images directly via public URLs? (We will default to public read for QR menu compatibility).

## Proposed Changes

We will introduce a new page, new UI components, and update API endpoints to support full CRUD operations for menu categories and menu items.

---

### API Layer

#### [MODIFY] [categories route.ts](file:///var/www/order-up/admin/app/api/categories/route.ts)
- Secure the `GET` endpoint by calling `verifyAuthRequest` and filtering by the authenticated user's active `tenantId`.
- Secure the `POST` endpoint to automatically assign the user's `tenantId` (ignoring tenantId sent in the body to prevent cross-tenant spoofing).

#### [NEW] [categories [id] route.ts](file:///var/www/order-up/admin/app/api/categories/%5Bid%5D/route.ts)
- `PATCH`: Update category details (name, sortOrder, isActive).
- `DELETE`: Delete category (cascades or clears category ID for associated items).

#### [MODIFY] [menu route.ts](file:///var/www/order-up/admin/app/api/menu/route.ts)
- Secure `GET` to fetch all menu items (including unavailable ones for management) filtered by the user's `tenantId`.
- Secure `POST` to assign `tenantId` from the verified session.

#### [MODIFY] [menu [id] route.ts](file:///var/www/order-up/admin/app/api/menu/%5Bid%5D/route.ts)
- Ensure changes are scoped strictly to the authenticated user's tenant.

---

### UI Components & Page

#### [NEW] [MenuBuilder.tsx](file:///var/www/order-up/admin/components/menu/MenuBuilder.tsx)
- The core dashboard component containing:
  - Search bar + Category filter chips.
  - Interactive grid view of menu items grouped by category.
  - Add Category/Add Item action buttons.
  - Star toggle for "Popular" and switch toggle for "Available".

#### [NEW] [CategoryModal.tsx](file:///var/www/order-up/admin/components/menu/CategoryModal.tsx)
- Modal to create and edit menu categories.

#### [NEW] [MenuItemModal.tsx](file:///var/www/order-up/admin/components/menu/MenuItemModal.tsx)
- Modal to create and edit menu items with:
  - Drag-and-drop file upload zone for item pictures.
  - Direct upload to Supabase storage with preview.
  - Fields for Name, Description, Price, Category, Allergens, and Tags.

#### [NEW] [page.tsx](file:///var/www/order-up/admin/app/menu/page.tsx)
- Server/Client page to render the dashboard layout with `MenuBuilder`.

---

### Configurations

#### [MODIFY] [nav-config.ts](file:///var/www/order-up/admin/utils/nav-config.ts)
- Add "Menu" navigation link under the "Dashboard" module.

---

## Verification Plan

### Automated Verification
- We will run TypeScript compilation (`npx tsc --noEmit`) and client build verification.

### Manual & Interactive Verification
- We will log in as `restaurant@matarrhq.com` with `secret12restaurant` using the browser subagent.
- Verify Category creation/editing.
- Verify MenuItem creation with image uploading.
- Verify toggle state changes for availability and popularity.
