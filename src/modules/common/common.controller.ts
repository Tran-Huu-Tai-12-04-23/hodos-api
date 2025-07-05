import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../notification/notification.service';
import { CommonService } from './common.service';

@ApiTags('Common API')
@Controller('common')
export class CommonController {
  constructor(
    private readonly service: CommonService,
    private readonly notificationService: NotificationService,
  ) {}

  @ApiOperation({
    summary: 'Dashboard data',
  })
  @ApiResponse({ status: 201 })
  @Get('dashboard')
  async dashBoardData() {
    return await this.service.dashBoardData();
  }

  @ApiOperation({
    summary: 'upload img to get url',
  })
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const downloadURL = await this.service.uploadImage(file);
    return { url: downloadURL };
  }

  @ApiOperation({})
  @Post('runTest')
  @UseInterceptors()
  async runTest() {
    await this.notificationService.runScheduledNotification();
    return {};
  }
}
