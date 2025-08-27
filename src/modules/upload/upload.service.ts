// upload.service.ts
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  constructor(@Inject('R2_CLIENT') private readonly s3Client: S3Client) {}
  /**
   * Process uploaded file and return the public URL
   * @param file - The uploaded file from multer-s3
   * @returns string - The public URL of the uploaded file
   */
  processUploadedFile(file: Express.MulterS3.File): string {
    const publicEndpoint = process.env.CLOUDFLARE_PUBLIC_IMG_ENDPOINT;

    if (!publicEndpoint) {
      throw new Error(
        'CLOUDFLARE_PUBLIC_IMG_ENDPOINT environment variable is not set',
      );
    }

    return publicEndpoint + file.key;
  }

  /**
   * Get file information
   * @param file - The uploaded file from multer-s3
   * @returns object - File information
   */
  getFileInfo(file: Express.MulterS3.File) {
    return {
      originalName: file.originalname,
      fileName: file.key,
      size: file.size,
      mimeType: file.mimetype,
      url: this.processUploadedFile(file),
      bucket: file.bucket,
      location: file.location,
    };
  }

  /**
   * Validate file type
   * @param file - The uploaded file from multer-s3
   * @param allowedTypes - Array of allowed mime types
   * @returns boolean - Whether the file type is allowed
   */
  validateFileType(
    file: Express.MulterS3.File,
    allowedTypes: string[],
  ): boolean {
    return allowedTypes.includes(file.mimetype);
  }

  /**
   * Validate file size
   * @param file - The uploaded file from multer-s3
   * @param maxSize - Maximum file size in bytes
   * @returns boolean - Whether the file size is valid
   */
  validateFileSize(file: Express.MulterS3.File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  async mergeAndUploadImages(
    imagePaths: string[],
    filename = 'merged.png',
    folder = 'images',
  ): Promise<string> {
    const size = 500;
    const gridSize = size * 2;

    // Download and resize images, skip if cannot download/read
    const compositeImages: { input: Buffer; top: number; left: number }[] = [];
    for (let index = 0; index < imagePaths.length; index++) {
      const imagePath = imagePaths[index];
      const top = index < 2 ? 0 : size;
      const left = index % 2 === 0 ? 0 : size;

      try {
        const imageBuffer = imagePath.startsWith('http')
          ? await this.downloadImageBuffer(imagePath)
          : await fs.readFile(imagePath);

        const resizedBuffer = await sharp(imageBuffer)
          .resize(size, size)
          .toBuffer();

        compositeImages.push({
          input: resizedBuffer,
          top,
          left,
        });
      } catch (error) {
        // Skip image if cannot download/read
        continue;
      }
    }

    if (compositeImages.length === 0) {
      throw new Error('Không có ảnh nào hợp lệ để ghép');
    }

    const finalImageBuffer = await sharp({
      create: {
        width: gridSize,
        height: gridSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite(compositeImages)
      .png()
      .toBuffer();

    return this.uploadBufferImage(finalImageBuffer, filename, folder);
  }

  /**
   * Download image from URL and return buffer
   * @param imageUrl - URL of the image to download
   * @returns Promise<Buffer> - Image buffer
   */
  private async downloadImageBuffer(imageUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error(
        `Failed to download image from ${imageUrl}: ${error.message}`,
      );
    }
  }

  /**
   * Upload image buffer to S3 and return public URL
   * @param buffer - Image buffer to upload
   * @param filename - Name of the file
   * @param folder - Folder to upload to
   * @returns Promise<string> - Public URL of uploaded image
   */
  async uploadBufferImage(
    buffer: Buffer,
    filename: string,
    folder: string,
  ): Promise<string> {
    const key = `${folder}/${Date.now()}-${filename}`;
    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'hodos';
    const publicEndpoint = process.env.CLOUDFLARE_PUBLIC_IMG_ENDPOINT;

    if (!publicEndpoint) {
      throw new Error(
        'CLOUDFLARE_PUBLIC_IMG_ENDPOINT environment variable is not set',
      );
    }

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: 'image/png',
        ACL: 'public-read',
      });

      await this.s3Client.send(command);
      return publicEndpoint + key;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload image file to S3 and return public URL
   * @param file - Express.Multer.File from local upload
   * @returns Promise<string | null> - Public URL of uploaded image or null if failed
   */
  async uploadImage(
    file: Express.Multer.File,
    folder = 'images',
  ): Promise<string | null> {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'hodos';
    const publicEndpoint = process.env.CLOUDFLARE_PUBLIC_IMG_ENDPOINT;

    if (!publicEndpoint) {
      throw new Error(
        'CLOUDFLARE_PUBLIC_IMG_ENDPOINT environment variable is not set',
      );
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const key = `${folder}/${uniqueFilename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        Metadata: {
          originalName: file.originalname,
          uploadDate: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);
      return publicEndpoint + key;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}
