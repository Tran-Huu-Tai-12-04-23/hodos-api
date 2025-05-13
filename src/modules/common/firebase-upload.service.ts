import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as admin from 'firebase-admin';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class FirebaseUploadService implements OnModuleInit {
  private bucket: any;

  async onModuleInit() {
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(
        __dirname,
        '../../assets/firebase/ac-s.json',
      );

      const serviceAccountJson = JSON.parse(
        await fs.readFile(serviceAccountPath, 'utf-8'),
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET || 'hodos-f29d9.appspot.com',
      });
    }

    this.bucket = admin.storage().bucket();
  }

  async downloadImageBuffer(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  }

  async uploadBufferImage(
    buffer: Buffer,
    filename: string,
    folder = 'images',
  ): Promise<string> {
    const filePath = `${folder}/${Date.now()}-${filename}`;
    const file = this.bucket.file(filePath);

    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
      },
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    });

    return url;
  }

  async mergeAndUploadImages(
    imagePaths: string[],
    filename = 'merged.png',
    folder = 'images',
  ): Promise<string> {
    if (imagePaths.length !== 4) {
      throw new Error('Phải có đúng 4 ảnh để ghép');
    }

    const size = 500;
    const gridSize = size * 2;

    const compositeImages = await Promise.all(
      imagePaths.map(async (imagePath, index) => {
        const top = index < 2 ? 0 : size;
        const left = index % 2 === 0 ? 0 : size;

        const imageBuffer = imagePath.startsWith('http')
          ? await this.downloadImageBuffer(imagePath)
          : await fs.readFile(imagePath);

        const resizedBuffer = await sharp(imageBuffer)
          .resize(size, size)
          .toBuffer();

        return {
          input: resizedBuffer,
          top,
          left,
        };
      }),
    );

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
}
