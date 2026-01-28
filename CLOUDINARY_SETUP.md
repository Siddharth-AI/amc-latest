# Cloudinary Integration Setup

## Overview
This project uses Cloudinary for image uploads and management. Cloudinary provides automatic image optimization, CDN delivery, and on-the-fly transformations.

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Cloudinary Credentials

1. **Sign up for Cloudinary**
   - Go to https://cloudinary.com/users/register/free
   - Create a free account (25GB storage, 25GB bandwidth/month)

2. **Get Your Credentials**
   - After signing up, go to your Dashboard
   - You'll see:
     - **Cloud Name**: Your unique cloud name
     - **API Key**: Your API key
     - **API Secret**: Your API secret (click "Reveal" to see it)

3. **Add to Environment Variables**
   - Copy the values to your `.env.local` file
   - For Vercel deployment, add them in Vercel Dashboard → Settings → Environment Variables

## File Structure in Cloudinary

Images are organized in folders:
- `categories/` - Category images
- `products/` - Product images
- `blogs/` - Blog post images

## How It Works

### Upload Flow
1. File is uploaded via API route
2. `saveFile()` function converts File to Buffer
3. Buffer is uploaded to Cloudinary using `uploadToCloudinary()`
4. Cloudinary returns secure URL
5. URL is stored in database

### Image URLs
- Full Cloudinary URL is stored in `img_name` field
- Format: `https://res.cloudinary.com/[cloud-name]/image/upload/v[version]/[folder]/[filename].jpg`

### Delete Flow
1. When updating/deleting, old image public_id is extracted from URL
2. Image is deleted from Cloudinary using `deleteFromCloudinary()`
3. Database record is updated/deleted

## Benefits

1. **Automatic Optimization**
   - Images are automatically optimized
   - WebP/AVIF format support
   - Automatic compression

2. **CDN Delivery**
   - Images served from global CDN
   - Fast loading times worldwide

3. **On-the-Fly Transformations**
   - Resize, crop, quality adjustments
   - No need to store multiple sizes

4. **Vercel Compatibility**
   - Works perfectly with Vercel's serverless functions
   - No ephemeral filesystem issues

## Next.js Image Component

Cloudinary URLs are automatically allowed in `next.config.mjs`:
```javascript
{
  protocol: 'https',
  hostname: 'res.cloudinary.com',
  pathname: '/**',
}
```

## Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: Unlimited
- **Perfect for**: Small to medium projects

## Migration from Local Storage

If you have existing images in local storage:
1. Upload them to Cloudinary manually or via script
2. Update database records with Cloudinary URLs
3. Remove old local files

## Troubleshooting

### Upload Fails
- Check environment variables are set correctly
- Verify Cloudinary credentials in dashboard
- Check file size (max 10MB on free tier)

### Images Not Displaying
- Verify `next.config.mjs` has Cloudinary hostname
- Check image URL format in database
- Ensure Cloudinary account is active

### Delete Fails
- Old images might already be deleted
- Check public_id extraction logic
- Verify API secret is correct

