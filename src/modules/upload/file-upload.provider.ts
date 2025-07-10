// file-upload.provider.ts
import { S3Client } from '@aws-sdk/client-s3';
import { MulterModuleOptions } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';

export const multerOptionsFactory = (s3: S3Client): MulterModuleOptions => ({
  storage: multerS3({
    s3,
    bucket: process.env.CLOUDFLARE_BUCKET_NAME || 'hodos',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (
      req: any,
      file: { originalname: any },
      cb: (arg0: null, arg1: string) => void,
    ) {
      const originalName = file.originalname.replace(/\s+/g, '');
      const filename = `${Date.now()}-${originalName}`;
      cb(null, filename);
    },
  }),
});
