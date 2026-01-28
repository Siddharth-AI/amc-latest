/**
 * Cloudinary Configuration
 * Cloudinary client setup for image uploads
 */

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export { cloudinary };

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string,
  publicId?: string
): Promise<{
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}> {
  // Convert File to Buffer if needed
  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        resource_type: 'auto',
        overwrite: false,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            format: result.format || '',
            width: result.width || 0,
            height: result.height || 0,
            bytes: result.bytes || 0,
          });
        } else {
          reject(new Error('Cloudinary upload failed: No result'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
}

/**
 * Get Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  }
): string {
  if (transformations) {
    return cloudinary.url(publicId, {
      width: transformations.width,
      height: transformations.height,
      crop: transformations.crop || 'fill',
      quality: transformations.quality || 'auto',
      format: transformations.format || 'auto',
      secure: true,
    });
  }
  return cloudinary.url(publicId, { secure: true });
}

/**
 * Extract public_id from Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
 * Returns: folder/image
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) {
      return null;
    }

    // Extract path after /upload/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
      return null;
    }

    // Get everything after /upload/
    const pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);

    // Remove version prefix (v1234567890/)
    const versionRegex = /^v\d+\//;
    const pathWithoutVersion = pathAfterUpload.replace(versionRegex, '');

    // Remove file extension
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');

    return publicId;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
}

