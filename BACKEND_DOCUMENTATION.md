# AMC Systems - Backend Documentation

## 🎯 Complete Backend Implementation

Production-ready backend system built with Next.js App Router, TypeScript, and Supabase.

---

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Architecture](#architecture)
5. [Authentication](#authentication)
6. [File Upload](#file-upload)

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

1. Go to your Supabase project
2. Open SQL Editor
3. Run the SQL schema from `database/schema.sql`
4. This will create all tables, indexes, and triggers

### 4. Create First Admin User

After running the schema, create your first admin user:

```sql
-- Hash password using bcrypt (password: admin123)
-- Use an online bcrypt generator or Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('admin123', 12);

INSERT INTO admin_users (full_name, email, password, role) VALUES
('Super Admin', 'admin@amcsystems.ae', '$2b$12$YourBcryptHashHere', 'super_admin');
```

---

## 🗄️ Database Schema

### Tables

1. **admin_users** - Admin authentication
2. **category** - Product categories
3. **product** - Products
4. **product_image** - Product images
5. **product_key_feature** - Product key features
6. **product_specification** - Product specifications
7. **blog** - Blog posts
8. **blog_tag** - Blog tags
9. **enquiry** - Product enquiries
10. **contact_us** - Contact form submissions

All tables include:
- `id` (UUID primary key)
- `created_at`, `updated_at` (timestamps)
- `is_active`, `is_deleted` (soft delete)
- `created_by`, `updated_by` (audit fields)

---

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/login`
Admin login endpoint.

**Request:**
```json
{
  "email": "admin@amcsystems.ae",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@amcsystems.ae",
      "full_name": "Admin User",
      "role": "admin"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST `/api/auth/refresh`
Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh_token"
}
```

---

### Public APIs

#### Categories

- `GET /api/public/categories` - Get all active categories
- `GET /api/public/categories/:id` - Get category by ID

#### Products

- `GET /api/public/products` - Get all products (optional: `?category_id=uuid`)
- `GET /api/public/products/:id` - Get product with full details (images, features, specs)

#### Blogs

- `GET /api/public/blogs` - Get all active blogs
- `GET /api/public/blogs/:id` - Get blog with tags

#### Enquiry

- `POST /api/public/enquiry` - Create enquiry

**Request:**
```json
{
  "category_id": "uuid (optional)",
  "product_id": "uuid (optional)",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "company_name": "Company Name (optional)",
  "message": "Enquiry message"
}
```

#### Contact

- `POST /api/public/contact` - Submit contact form

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "subject": "Subject",
  "message": "Message"
}
```

---

### Admin APIs (JWT Protected)

All admin APIs require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

#### Categories (Admin)

- `POST /api/admin/categories` - Create category (multipart/form-data)
  - `name` (required)
  - `title` (optional)
  - `image` (File, optional)

- `PUT /api/admin/categories/:id` - Update category (multipart/form-data)
- `DELETE /api/admin/categories/:id` - Soft delete category

#### Products (Admin)

- `POST /api/admin/products` - Create product
  ```json
  {
    "category_id": "uuid",
    "name": "Product Name",
    "title": "Product Title (optional)",
    "description": "Description (optional)",
    "is_warranty": false,
    "warranty_period": "1 year (optional)"
  }
  ```

- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Soft delete product

- `POST /api/admin/products/:id/images` - Upload product images (multipart/form-data)
  - `images` (File[], multiple files)

- `DELETE /api/admin/products/images/:id` - Delete product image

- `POST /api/admin/products/:id/key-features` - Create key feature
  ```json
  {
    "name": "Feature Name"
  }
  ```

- `PUT /api/admin/products/key-features/:id` - Update key feature
- `DELETE /api/admin/products/key-features/:id` - Delete key feature

- `POST /api/admin/products/:id/specifications` - Create specification
  ```json
  {
    "specification_key": "Key",
    "specification_value": "Value"
  }
  ```

- `PUT /api/admin/products/specifications/:id` - Update specification
- `DELETE /api/admin/products/specifications/:id` - Delete specification

#### Blogs (Admin)

- `POST /api/admin/blogs` - Create blog (multipart/form-data)
  - `title` (required)
  - `description` (required, HTML content)
  - `image` (File, optional)

- `PUT /api/admin/blogs/:id` - Update blog (multipart/form-data)
- `DELETE /api/admin/blogs/:id` - Soft delete blog

- `POST /api/admin/blogs/:id/tags` - Create blog tag
  ```json
  {
    "name": "Tag Name"
  }
  ```

- `PUT /api/admin/blogs/tags/:id` - Update blog tag
- `DELETE /api/admin/blogs/tags/:id` - Delete blog tag

#### Enquiries (Admin)

- `GET /api/admin/enquiries` - Get all enquiries
- `GET /api/admin/enquiries/:id` - Get enquiry by ID

#### Contacts (Admin)

- `GET /api/admin/contacts` - Get all contact forms
- `GET /api/admin/contacts/:id` - Get contact by ID

---

## 🏗️ Architecture

### MVC Pattern

```
/backend
  /models      - Database queries (Supabase)
  /services    - Business logic
  /controllers - Request handling

/app/api
  /auth        - Authentication endpoints
  /admin       - Protected admin endpoints
  /public      - Public endpoints
```

### File Structure

```
amc/
├── database/
│   └── schema.sql              # Database schema
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── jwt.ts                   # JWT utilities
│   └── bcrypt.ts                # Password hashing
├── utils/
│   ├── response.ts              # API response helpers
│   └── upload.ts                # File upload utilities
├── validators/                  # Zod schemas
├── middlewares/
│   └── auth.ts                  # JWT middleware
├── types/
│   └── index.ts                 # TypeScript types
└── backend/
    ├── models/                  # Database models
    ├── services/               # Business logic
    └── controllers/            # Request handlers
```

---

## 🔐 Authentication

### JWT Tokens

- **Access Token**: Short-lived (15 minutes default)
- **Refresh Token**: Long-lived (7 days default)

### Middleware

All admin routes are protected using `authenticateRequest` middleware:

```typescript
const authResult = await authenticateRequest(request);
if (authResult instanceof Response) {
  return authResult; // Unauthorized
}
const { user } = authResult; // Authenticated user
```

---

## 📁 File Upload

### Upload System

- Files are saved to `/public/uploads/`
- Subfolders: `categories/`, `products/`, `blogs/`
- Unique filenames: `timestamp-random.extension`
- Returns public URL for frontend use

### Supported Formats

- Images: JPG, PNG, GIF, WebP
- Max size: Configure in upload utility

---

## ✅ Features Implemented

- ✅ Complete database schema with all tables
- ✅ JWT authentication system
- ✅ Admin CRUD for categories
- ✅ Admin CRUD for products (with images, features, specs)
- ✅ Admin CRUD for blogs (with tags)
- ✅ Public APIs for all resources
- ✅ File upload system
- ✅ Soft delete (is_deleted flag)
- ✅ Zod validation on all inputs
- ✅ TypeScript strict typing
- ✅ Clean MVC architecture
- ✅ Standard API response format
- ✅ Error handling

---

## 🧪 Testing

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amcsystems.ae","password":"admin123"}'
```

### Test Public API

```bash
curl http://localhost:3000/api/public/categories
```

### Test Admin API (with token)

```bash
curl -X GET http://localhost:3000/api/admin/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Notes

1. **Soft Delete**: All deletes are soft deletes (is_deleted = true)
2. **Rich Text**: Blog descriptions support HTML content from rich text editors
3. **File Uploads**: Use multipart/form-data for file uploads
4. **Validation**: All inputs are validated using Zod schemas
5. **Error Handling**: Consistent error response format
6. **Production Ready**: All code follows production best practices

---

## 🚀 Next Steps

1. Set up Supabase project
2. Run database schema
3. Create first admin user
4. Configure environment variables
5. Test all endpoints
6. Deploy to production

---

**Backend Implementation Complete!** ✅

