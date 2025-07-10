// upload.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { MergeImagesDto } from './merge-images.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      message: 'Upload thành công!',
      data: this.uploadService.getFileInfo(file),
    };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate image file types
    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!this.uploadService.validateFileType(file, allowedImageTypes)) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (!this.uploadService.validateFileSize(file, maxSize)) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    return {
      message: 'Image uploaded successfully!',
      data: this.uploadService.getFileInfo(file),
    };
  }

  @Post('merge-images')
  async mergeImages(@Body() mergeImagesDto: MergeImagesDto) {
    const { imagePaths, filename, folder } = mergeImagesDto;

    if (!imagePaths || !Array.isArray(imagePaths)) {
      throw new BadRequestException('imagePaths must be an array');
    }

    if (imagePaths.length !== 4) {
      throw new BadRequestException('Exactly 4 image paths are required');
    }

    try {
      const mergedImageUrl = await this.uploadService.mergeAndUploadImages(
        imagePaths,
        filename,
        folder,
      );

      return {
        message: 'Images merged successfully!',
        data: {
          mergedImageUrl,
          originalImages: imagePaths,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('local')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadLocalFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const imageUrl = await this.uploadService.uploadImage(file);

      return {
        message: 'File uploaded successfully!',
        data: {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          url: imageUrl,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
