/**
 * File Upload Utility
 * Handles file uploads using Cloudinary
 */

import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';
import { randomBytes } from 'crypto';

export interface UploadResult {
  originalName: string;
  fileName: string;
  fileType: string;
  baseUrl: string;
  publicUrl: string;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
}

/**
 * Generate unique filename for Cloudinary
 */
function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop() || '';
  const timestamp = Date.now();
  const random = randomBytes(8).toString('hex');
  return `${timestamp}-${random}`;
}

/**
 * Split Cloudinary URL into base URL and image path
 * Example: https://res.cloudinary.com/dl8pdgd0r/image/upload/v1768223159/categories/file.png
 * Returns: {
 *   baseUrl: https://res.cloudinary.com/dl8pdgd0r/image/upload/v1768223159/
 *   imagePath: categories/file.png
 * }
 */
function splitCloudinaryUrl(fullUrl: string): { baseUrl: string; imagePath: string } {
  try {
    const url = new URL(fullUrl);
    
    // Find the version part (v1234567890)
    const pathParts = url.pathname.split('/');
    const versionIndex = pathParts.findIndex(part => part.startsWith('v') && /^v\d+$/.test(part));
    
    if (versionIndex === -1) {
      // No version found, use entire pathname
      return {
        baseUrl: `${url.protocol}//${url.hostname}${url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1)}`,
        imagePath: pathParts.slice(-1)[0],
      };
    }
    
    // Base URL: protocol + hostname + path up to and including version
    const basePath = pathParts.slice(0, versionIndex + 1).join('/');
    const baseUrl = `${url.protocol}//${url.hostname}${basePath}/`;
    
    // Image path: everything after version
    const imagePath = pathParts.slice(versionIndex + 1).join('/');
    
    return { baseUrl, imagePath };
  } catch (error) {
    // Fallback: return as is
    return {
      baseUrl: fullUrl.substring(0, fullUrl.lastIndexOf('/') + 1),
      imagePath: fullUrl.split('/').pop() || '',
    };
  }
}

/**
 * Save uploaded file to Cloudinary
 */
export async function saveFile(
  file: File,
  subfolder?: string
): Promise<UploadResult> {
  const originalName = file.name;
  const fileName = generateFileName(originalName);
  const fileType = file.type;
  
  // Determine folder based on subfolder
  const folder = subfolder || 'uploads';
  
  // Upload to Cloudinary
  const result = await uploadToCloudinary(file, folder, fileName);

  // Split Cloudinary URL into base URL and image path
  const { baseUrl, imagePath } = splitCloudinaryUrl(result.secure_url);

  return {
    originalName,
    fileName: imagePath, // Store only the path part (e.g., categories/file.png)
    fileType,
    baseUrl, // Store base URL (e.g., https://res.cloudinary.com/dl8pdgd0r/image/upload/v1768223159/)
    publicUrl: result.secure_url, // Full URL for backward compatibility
    cloudinaryPublicId: result.public_id,
    cloudinaryUrl: result.secure_url, // Full URL for backward compatibility
  };
}

/**
 * Save multiple files to Cloudinary
 */
export async function saveFiles(
  files: File[],
  subfolder?: string
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => saveFile(file, subfolder)));
}

/**
 * Delete file from Cloudinary
 * Accepts either public_id or full Cloudinary URL
 */
export async function deleteFile(publicIdOrUrl: string): Promise<void> {
  // If it's a URL, extract public_id
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('cloudinary.com')) {
    const extracted = extractPublicIdFromUrl(publicIdOrUrl);
    if (!extracted) {
      throw new Error('Invalid Cloudinary URL');
    }
    publicId = extracted;
  }
  
  await deleteFromCloudinary(publicId);
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * Get allowed image types
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * Max file size: 5MB
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
