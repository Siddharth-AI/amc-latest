-- ============================================================================
-- AMC SYSTEMS - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Production-ready SQL schema for Supabase
-- Execute this in Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- bcrypt hashed
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

-- ============================================================================
-- CATEGORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT,
    img_original_name TEXT,
    base_url TEXT,
    img_name TEXT,
    img_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_category_is_active ON category(is_active);
CREATE INDEX idx_category_is_deleted ON category(is_deleted);
CREATE INDEX idx_category_created_by ON category(created_by);
CREATE INDEX idx_category_updated_by ON category(updated_by);

-- ============================================================================
-- PRODUCT TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    is_warranty BOOLEAN NOT NULL DEFAULT false,
    warranty_period TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_product_category_id ON product(category_id);
CREATE INDEX idx_product_is_active ON product(is_active);
CREATE INDEX idx_product_is_deleted ON product(is_deleted);
CREATE INDEX idx_product_created_by ON product(created_by);
CREATE INDEX idx_product_updated_by ON product(updated_by);
CREATE INDEX idx_product_name ON product(name);

-- ============================================================================
-- PRODUCT IMAGE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_image (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    original_name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_product_image_product_id ON product_image(product_id);
CREATE INDEX idx_product_image_is_active ON product_image(is_active);
CREATE INDEX idx_product_image_is_deleted ON product_image(is_deleted);
CREATE INDEX idx_product_image_created_by ON product_image(created_by);

-- ============================================================================
-- PRODUCT KEY FEATURE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_key_feature (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_product_key_feature_product_id ON product_key_feature(product_id);
CREATE INDEX idx_product_key_feature_is_active ON product_key_feature(is_active);
CREATE INDEX idx_product_key_feature_is_deleted ON product_key_feature(is_deleted);

-- ============================================================================
-- PRODUCT SPECIFICATION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_specification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    specification_key TEXT NOT NULL,
    specification_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_product_specification_product_id ON product_specification(product_id);
CREATE INDEX idx_product_specification_is_active ON product_specification(is_active);
CREATE INDEX idx_product_specification_is_deleted ON product_specification(is_deleted);

-- ============================================================================
-- BLOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL, -- HTML content from rich text editor
    img_original_name TEXT,
    base_url TEXT,
    img_name TEXT,
    img_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_blog_is_active ON blog(is_active);
CREATE INDEX idx_blog_is_deleted ON blog(is_deleted);
CREATE INDEX idx_blog_created_by ON blog(created_by);
CREATE INDEX idx_blog_updated_by ON blog(updated_by);
CREATE INDEX idx_blog_created_at ON blog(created_at DESC);

-- ============================================================================
-- BLOG TAG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_tag (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id UUID NOT NULL REFERENCES blog(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_blog_tag_blog_id ON blog_tag(blog_id);
CREATE INDEX idx_blog_tag_is_active ON blog_tag(is_active);
CREATE INDEX idx_blog_tag_is_deleted ON blog_tag(is_deleted);

-- ============================================================================
-- ENQUIRY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS enquiry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES category(id) ON DELETE SET NULL,
    product_id UUID REFERENCES product(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_enquiry_category_id ON enquiry(category_id);
CREATE INDEX idx_enquiry_product_id ON enquiry(product_id);
CREATE INDEX idx_enquiry_email ON enquiry(email);
CREATE INDEX idx_enquiry_is_active ON enquiry(is_active);
CREATE INDEX idx_enquiry_is_deleted ON enquiry(is_deleted);
CREATE INDEX idx_enquiry_created_at ON enquiry(created_at DESC);

-- ============================================================================
-- CONTACT US TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_us (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_contact_us_email ON contact_us(email);
CREATE INDEX idx_contact_us_is_active ON contact_us(is_active);
CREATE INDEX idx_contact_us_is_deleted ON contact_us(is_deleted);
CREATE INDEX idx_contact_us_created_at ON contact_us(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON category
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON product
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_image_updated_at BEFORE UPDATE ON product_image
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_key_feature_updated_at BEFORE UPDATE ON product_key_feature
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_specification_updated_at BEFORE UPDATE ON product_specification
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON blog
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_tag_updated_at BEFORE UPDATE ON blog_tag
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiry_updated_at BEFORE UPDATE ON enquiry
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_us_updated_at BEFORE UPDATE ON contact_us
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL ADMIN USER (Optional - for first setup)
-- ============================================================================
-- Password: admin123 (bcrypt hash)
-- You should change this after first login
-- ============================================================================

-- INSERT INTO admin_users (full_name, email, password, role) VALUES
-- ('Super Admin', 'admin@amcsystems.ae', '$2b$10$YourBcryptHashHere', 'super_admin');


-- ============================================================================
-- PHASE 0: ADD SLUG COLUMNS TO TABLES
-- ============================================================================
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: ADD SLUG COLUMN TO CATEGORY TABLE
-- ============================================================================

-- Add slug column (allow NULL temporarily for existing records)
ALTER TABLE category 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index for faster slug queries
CREATE INDEX IF NOT EXISTS idx_category_slug ON category(slug);

-- ============================================================================
-- STEP 2: GENERATE SLUGS FOR EXISTING CATEGORIES
-- ============================================================================

-- Function to generate slug from text
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
DECLARE
    slug_output TEXT;
BEGIN
    -- Convert to lowercase, replace spaces with hyphens, remove special chars
    slug_output := LOWER(TRIM(text_input));
    slug_output := REGEXP_REPLACE(slug_output, '[^a-z0-9\s-]', '', 'g');
    slug_output := REGEXP_REPLACE(slug_output, '\s+', '-', 'g');
    slug_output := REGEXP_REPLACE(slug_output, '-+', '-', 'g');
    slug_output := TRIM(BOTH '-' FROM slug_output);
    
    RETURN slug_output;
END;
$$ LANGUAGE plpgsql;

-- Generate slugs for existing categories
UPDATE category 
SET slug = generate_slug(name)
WHERE slug IS NULL OR slug = '';

-- Handle duplicate slugs by appending numbers
DO $$
DECLARE
    rec RECORD;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    FOR rec IN 
        SELECT id, slug 
        FROM category 
        WHERE slug IN (
            SELECT slug 
            FROM category 
            GROUP BY slug 
            HAVING COUNT(*) > 1
        )
        ORDER BY created_at
    LOOP
        counter := 2;
        new_slug := rec.slug || '-' || counter;
        
        WHILE EXISTS (SELECT 1 FROM category WHERE slug = new_slug) LOOP
            counter := counter + 1;
            new_slug := rec.slug || '-' || counter;
        END LOOP;
        
        UPDATE category SET slug = new_slug WHERE id = rec.id;
    END LOOP;
END $$;

-- Now make slug NOT NULL and UNIQUE
ALTER TABLE category 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE category 
ADD CONSTRAINT category_slug_unique UNIQUE (slug);

-- ============================================================================
-- STEP 3: ADD SLUG COLUMN TO PRODUCT TABLE
-- ============================================================================

-- Add slug column
ALTER TABLE product 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index
CREATE INDEX IF NOT EXISTS idx_product_slug ON product(slug);

-- Generate slugs for existing products
UPDATE product 
SET slug = generate_slug(name)
WHERE slug IS NULL OR slug = '';

-- Handle duplicate slugs
DO $$
DECLARE
    rec RECORD;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    FOR rec IN 
        SELECT id, slug 
        FROM product 
        WHERE slug IN (
            SELECT slug 
            FROM product 
            GROUP BY slug 
            HAVING COUNT(*) > 1
        )
        ORDER BY created_at
    LOOP
        counter := 2;
        new_slug := rec.slug || '-' || counter;
        
        WHILE EXISTS (SELECT 1 FROM product WHERE slug = new_slug) LOOP
            counter := counter + 1;
            new_slug := rec.slug || '-' || counter;
        END LOOP;
        
        UPDATE product SET slug = new_slug WHERE id = rec.id;
    END LOOP;
END $$;

-- Make slug NOT NULL and UNIQUE
ALTER TABLE product 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE product 
ADD CONSTRAINT product_slug_unique UNIQUE (slug);

-- ============================================================================
-- STEP 4: ADD SLUG COLUMN TO BLOG TABLE
-- ============================================================================

-- Add slug column
ALTER TABLE blog 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);

-- Generate slugs for existing blogs
UPDATE blog 
SET slug = generate_slug(title)
WHERE slug IS NULL OR slug = '';

-- Handle duplicate slugs
DO $$
DECLARE
    rec RECORD;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    FOR rec IN 
        SELECT id, slug 
        FROM blog 
        WHERE slug IN (
            SELECT slug 
            FROM blog 
            GROUP BY slug 
            HAVING COUNT(*) > 1
        )
        ORDER BY created_at
    LOOP
        counter := 2;
        new_slug := rec.slug || '-' || counter;
        
        WHILE EXISTS (SELECT 1 FROM blog WHERE slug = new_slug) LOOP
            counter := counter + 1;
            new_slug := rec.slug || '-' || counter;
        END LOOP;
        
        UPDATE blog SET slug = new_slug WHERE id = rec.id;
    END LOOP;
END $$;

-- Make slug NOT NULL and UNIQUE
ALTER TABLE blog 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE blog 
ADD CONSTRAINT blog_slug_unique UNIQUE (slug);

-- ============================================================================
-- STEP 5: CREATE TRIGGER FOR AUTO SLUG GENERATION ON INSERT
-- ============================================================================

-- Function to auto-generate slug before insert
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Generate base slug from name/title
    IF TG_TABLE_NAME = 'blog' THEN
        base_slug := generate_slug(NEW.title);
    ELSE
        base_slug := generate_slug(NEW.name);
    END IF;
    
    new_slug := base_slug;
    
    -- Check for duplicates and append number if needed
    WHILE EXISTS (
        SELECT 1 FROM category WHERE slug = new_slug AND TG_TABLE_NAME = 'category'
        UNION ALL
        SELECT 1 FROM product WHERE slug = new_slug AND TG_TABLE_NAME = 'product'
        UNION ALL
        SELECT 1 FROM blog WHERE slug = new_slug AND TG_TABLE_NAME = 'blog'
    ) LOOP
        counter := counter + 1;
        new_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := new_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to category table
CREATE TRIGGER category_auto_slug
BEFORE INSERT ON category
FOR EACH ROW
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION auto_generate_slug();

-- Apply trigger to product table
CREATE TRIGGER product_auto_slug
BEFORE INSERT ON product
FOR EACH ROW
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION auto_generate_slug();

-- Apply trigger to blog table
CREATE TRIGGER blog_auto_slug
BEFORE INSERT ON blog
FOR EACH ROW
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION auto_generate_slug();

-- ============================================================================
-- VERIFICATION QUERIES (Optional - Run to check results)
-- ============================================================================

-- Check category slugs
-- SELECT id, name, slug FROM category ORDER BY created_at;

-- Check product slugs
-- SELECT id, name, slug FROM product ORDER BY created_at;

-- Check blog slugs
-- SELECT id, title, slug FROM blog ORDER BY created_at;

-- Check for duplicate slugs (should return 0 rows)
-- SELECT slug, COUNT(*) FROM category GROUP BY slug HAVING COUNT(*) > 1;
-- SELECT slug, COUNT(*) FROM product GROUP BY slug HAVING COUNT(*) > 1;
-- SELECT slug, COUNT(*) FROM blog GROUP BY slug HAVING COUNT(*) > 1;

-- ============================================================================
-- MIGRATION COMPLETE! ✅
-- ============================================================================
-- What was done:
-- 1. Added 'slug' column to category, product, and blog tables
-- 2. Created indexes for faster slug queries
-- 3. Generated slugs for all existing records
-- 4. Handled duplicate slugs by appending numbers
-- 5. Added UNIQUE constraint to prevent duplicate slugs
-- 6. Created triggers to auto-generate slugs on new inserts
-- ============================================================================
