// upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from './file-upload.provider';
import { R2Module } from './r2.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    R2Module,
    MulterModule.registerAsync({
      inject: ['R2_CLIENT'],
      useFactory: multerOptionsFactory,
      imports: [R2Module],
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
