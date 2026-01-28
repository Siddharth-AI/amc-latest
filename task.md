You are a senior backend architect working inside my Next.js App Router project.

This is a production backend task, not a demo.

CRITICAL RULES:
- Supabase database is currently EMPTY.
- You must FIRST generate SQL schema to create all tables.
- Then build the backend strictly using those tables.
- Do NOT use any dummy JSON, mock data, or frontend lib data.
- Every API must interact with real Supabase tables only.
- Write real, working TypeScript code (no pseudocode).

Stack:
- Next.js App Router (API routes inside /app/api)
- TypeScript everywhere
- Supabase as database (RLS disabled)
- Supabase client directly (no ORM)
- Clean MVC architecture

----------------------------------------------------
STEP 1: DATABASE DESIGN (MUST DO FIRST)
----------------------------------------------------

You must generate Supabase-compatible SQL for:

1. Admin table
2. All required project tables
3. Proper constraints
4. Foreign keys
5. Indexes
6. Defaults
7. UUID primary keys

Admin table must be created as:

admin_users:
- id (uuid, primary key, default uuid_generate_v4())
- full_name (text, not null)
- email (text, unique, not null)
- password (text, hashed with bcrypt)
- role (text, default 'admin') // admin | super_admin
- is_active (boolean, default true)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())

All tables must follow:
- id uuid primary key
- created_at default now()
- is_active default true
- is_deleted default false
- proper foreign keys
- indexes on foreign keys
- professional SQL (no weak schema)

Tables to generate in SQL:

category:
id, name, title, img_original_name, base_url, img_name, img_type,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

product:
id, category_id, name, title, description, is_warranty, warranty_period,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

product_image:
id, product_id, original_name, base_url, name, type,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

product_key_feature:
id, product_id, name,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

product_specification:
id, product_id, specification_key, specification_value,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

blog:
id, title, description, img_original_name, base_url, img_name, img_type,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

blog_tag:
id, blog_id, name,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

enquiry:
id, category_id, product_id, full_name, email, phone, company_name, message,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

contact_us:
id, full_name, email, phone, subject, message,
created_at, created_by, updated_at, updated_by, is_active, is_deleted

----------------------------------------------------
STEP 2: BACKEND ARCHITECTURE
----------------------------------------------------

After SQL schema is prepared, build backend with this structure:

/lib
  supabase.ts        // Supabase client
  jwt.ts             // JWT sign/verify
  bcrypt.ts          // hash/compare

/utils
  response.ts        // standard API response
  upload.ts          // file saving logic

/validators          // Zod schemas
/middlewares         // JWT auth middleware
/types               // TypeScript types

/backend
  /models            // Supabase queries only
  /services          // Business logic
  /controllers       // Request handling

/app/api
  /auth              // login, refresh
  /admin             // protected admin APIs
  /public            // public APIs

MVC separation is mandatory:
- Controllers handle req/res only
- Services handle logic
- Models handle DB (Supabase) only

----------------------------------------------------
STEP 3: AUTH SYSTEM
----------------------------------------------------

Implement:
- Admin login using email + password (bcrypt)
- JWT access token
- Refresh token system
- JWT middleware for protected routes
- Role-ready structure (admin, super_admin)

Must include:
- POST /api/auth/login
- POST /api/auth/refresh
- Middleware to protect /api/admin/*

----------------------------------------------------
STEP 4: ADMIN APIs (JWT Protected)
----------------------------------------------------

Admin must be able to:

- Create/update/delete category (with image upload)
- Create/update/delete product
- Upload multiple product images
- Manage key features
- Manage specifications
- Create/update/delete blog (with image upload)
- Manage blog tags

Soft delete must use:
- is_deleted = true (never hard delete)

----------------------------------------------------
STEP 5: PUBLIC APIs
----------------------------------------------------

Public APIs must include:

- Get all active categories
- Get products by category
- Get full product detail:
  - images
  - key features
  - specifications
- Get all active blogs
- Get blog detail with tags
- Create enquiry
- Create contact form

----------------------------------------------------
STEP 6: FILE UPLOAD SYSTEM
----------------------------------------------------

Upload rules:
- Accept multipart/form-data
- Save files into: /public/uploads
- Generate unique filenames
- Store in DB:
  - original name
  - file type
  - stored filename
  - base_url
- Return public URL usable by frontend

----------------------------------------------------
STEP 7: BLOG EDITOR SUPPORT
----------------------------------------------------

- Blog description must support rich text
- Store blog.description as HTML string
- APIs must support editors like TipTap or React-Quill
- Frontend will render HTML safely

----------------------------------------------------
STEP 8: CODE QUALITY
----------------------------------------------------

Must enforce:
- TypeScript strict typing everywhere
- Zod validation on every input
- Central response format:
  { success: boolean, message: string, data: any }
- Proper error handling
- Pagination-ready services
- Clean reusable code
- Production-grade patterns only

----------------------------------------------------
FINAL RULES:
----------------------------------------------------

- No dummy data
- No mock JSON
- No fake services
- Everything must use Supabase
- Do not break existing frontend pages
- Generate real working backend code
- Write clean, scalable architecture
- Treat this like a real company backend

----------------------------------------------------
EXECUTION ORDER:
----------------------------------------------------

1. Generate SQL schema (all tables + constraints + indexes)
2. Setup Supabase client
3. Build auth system
4. Build category module
5. Build product module
6. Build blog module
7. Build enquiry + contact
8. Final cleanup and structure check
