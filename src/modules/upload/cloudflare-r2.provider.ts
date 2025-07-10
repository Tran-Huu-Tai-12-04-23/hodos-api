// cloudflare-r2.provider.ts
import { S3Client } from '@aws-sdk/client-s3';

export const R2Provider = {
  provide: 'R2_CLIENT',
  useFactory: () => {
    return new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
      },
    });
  },
};
