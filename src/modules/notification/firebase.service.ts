import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as admin from 'firebase-admin';
import * as fs from 'fs/promises';
import * as sharp from 'sharp';
@Injectable()
export class FirebaseService implements OnModuleInit {
  private bucket: any;
  private readonly logger = new Logger(FirebaseService.name);

  async onModuleInit() {
    await this.initializeFirebase();
    this.bucket = admin.storage().bucket();
  }

  private initializeFirebase() {
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!projectId) {
      this.logger.warn(
        'FIREBASE_PROJECT_ID not found in environment variables',
      );
      return;
    }

    // Check if we have service account credentials in environment variables
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (privateKey && clientEmail) {
      // Use service account credentials from environment variables
      const serviceAccount = {
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId,
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET || 'hodos-f29d9.appspot.com',
      });
      this.logger.log('Firebase initialized with service account credentials');
    } else {
      // Try to use application default credentials (for production/GCP)
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId,
        });
        this.logger.log(
          'Firebase initialized with application default credentials',
        );
      } catch (error) {
        this.logger.warn(
          'Could not initialize Firebase with default credentials. Firebase logging will be disabled.',
        );
        this.logger.warn(
          'To enable Firebase logging, please configure FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL environment variables',
        );
        // Don't throw error, just disable Firebase functionality
      }
    }
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

  async sendFCMNotification(token: string, title: string, body: string) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        token,
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  async sendFCMNotifications(tokens: string[], title: string, body: string) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
      };

      const multicastMessage = {
        ...message,
        tokens,
      };

      const response = await admin
        .messaging()
        .sendEachForMulticast(multicastMessage);
      console.log('Successfully sent multicast message:', response);
      return response;
    } catch (error) {
      console.error('Error sending multicast message:', error);
      throw error;
    }
  }
}
