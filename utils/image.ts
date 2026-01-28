/**
 * Image URL Helper
 * Constructs proper image URLs for Next.js Image component
 * Supports both Cloudinary URLs and local file paths
 */

/**
 * Get image URL for category
 * Merges baseUrl and imgName to create full URL
 */
export function getCategoryImageUrl(baseUrl: string | null, imgName: string | null): string | null {
  if (!baseUrl || !imgName) {
    return null;
  }

  // If imgName already contains full URL (backward compatibility), return as is
  if (imgName.startsWith('http://') || imgName.startsWith('https://')) {
    return imgName;
  }

  // If baseUrl is Cloudinary URL, merge them
  if (baseUrl.includes('cloudinary.com') || baseUrl.includes('res.cloudinary.com')) {
    // baseUrl already ends with /, so just append imgName
    return `${baseUrl}${imgName}`;
  }

  // Local file path (for backward compatibility)
  if (imgName.startsWith('/')) {
    return imgName;
  }

  // Construct local path: base_url/uploads/categories/filename
  return `${baseUrl}/uploads/categories/${imgName}`;
}

/**
 * Get image URL for product
 * Merges baseUrl and imgName to create full URL
 */
export function getProductImageUrl(baseUrl: string | null, imgName: string | null): string | null {
  if (!baseUrl || !imgName) {
    return null;
  }

  // If imgName already contains full URL (backward compatibility), return as is
  if (imgName.startsWith('http://') || imgName.startsWith('https://')) {
    return imgName;
  }

  // If baseUrl is Cloudinary URL, merge them
  if (baseUrl.includes('cloudinary.com') || baseUrl.includes('res.cloudinary.com')) {
    // baseUrl already ends with /, so just append imgName
    return `${baseUrl}${imgName}`;
  }

  // Local file path (for backward compatibility)
  if (imgName.startsWith('/')) {
    return imgName;
  }

  return `${baseUrl}/uploads/products/${imgName}`;
}

/**
 * Get image URL for blog
 * Merges baseUrl and imgName to create full URL
 */
export function getBlogImageUrl(baseUrl: string | null, imgName: string | null): string | null {
  if (!baseUrl || !imgName) {
    return null;
  }

  // If imgName already contains full URL (backward compatibility), return as is
  if (imgName.startsWith('http://') || imgName.startsWith('https://')) {
    return imgName;
  }

  // If baseUrl is Cloudinary URL, merge them
  if (baseUrl.includes('cloudinary.com') || baseUrl.includes('res.cloudinary.com')) {
    // baseUrl already ends with /, so just append imgName
    return `${baseUrl}${imgName}`;
  }

  // Local file path (for backward compatibility)
  if (imgName.startsWith('/')) {
    return imgName;
  }

  return `${baseUrl}/uploads/blogs/${imgName}`;
}

