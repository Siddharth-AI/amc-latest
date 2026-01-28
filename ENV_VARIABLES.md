# Environment Variables

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Database (Supabase)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### JWT Authentication
```env
# JWT Secrets
JWT_SECRET=your_jwt_secret_key_min_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_min_32_characters
```

### Cloudinary (Image Storage)
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Site Configuration
```env
# Site URL (for local development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# For production, set to your domain:
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Rate Limiting (Optional - Upstash Redis)
```env
# Upstash Redis for Rate Limiting
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

## Getting Credentials

### Supabase
1. Go to https://supabase.com
2. Create a project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### JWT Secrets
Generate secure random strings (minimum 32 characters):
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use online generators:
- https://randomkeygen.com/
- https://www.lastpass.com/features/password-generator

**Important**: Use different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`

### Cloudinary
1. Go to https://cloudinary.com/users/register/free
2. Sign up for free account
3. Go to Dashboard
4. Copy:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET` (click "Reveal")

### Upstash Redis (Optional)
1. Go to https://upstash.com
2. Create a Redis database
3. Copy:
   - REST URL → `UPSTASH_REDIS_REST_URL`
   - REST Token → `UPSTASH_REDIS_REST_TOKEN`

## Vercel Deployment

When deploying to Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add all the variables above
4. Set them for:
   - **Production**: Production environment
   - **Preview**: Preview deployments
   - **Development**: Local development (optional)

## Security Notes

1. **Never commit `.env.local`** to Git (already in `.gitignore`)
2. **Use different secrets** for development and production
3. **Rotate secrets** if they're ever exposed
4. **JWT secrets** should be long and random (32+ characters)
5. **Service role key** should never be exposed to client-side code

## Example `.env.local`

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars_long

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Upstash (Optional)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxxACQgYjY5YzE...
```

