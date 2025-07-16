import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

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
  @Post('dashboard')
  async dashBoardData(@Body() data: { userId?: string }) {
    return await this.service.dashBoardData(data?.userId);
  }

  @ApiOperation({})
  @Post('runTest')
  @UseInterceptors()
  async runTest() {
    await this.notificationService.runScheduledNotification();
    return {};
  }
}
