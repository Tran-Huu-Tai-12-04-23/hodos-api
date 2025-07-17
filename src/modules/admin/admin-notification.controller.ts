import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CreateScheduledNotificationDto } from '../notification/dto';
import { UpdateScheduleNotificationDto } from './../notification/dto/create.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Admin Notification Controller')
@Controller('admin/notification')
export class AdminNotificationController {
  constructor(private readonly service: AdminService) {}

  //#region notification
  @Post('schedule/pagination')
  async scheduleNotificationPagination(@Body() body: PaginationDto<any>) {
    return this.service.scheduleNotificationPagination(body);
  }

  @Post('schedule')
  async createScheduleNotification(
    @Body() body: CreateScheduledNotificationDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.service.createScheduleNotification(user, body);
  }
  @Patch('schedule')
  async updateScheduleNotification(
    @Body() body: UpdateScheduleNotificationDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.service.updateScheduleNotification(user, body);
  }

  @Delete('schedule/:id')
  async deleteScheduleNotification(@Param('id') id: string) {
    return this.service.deleteScheduleNotification(id);
  }

  @Get('schedule/:id')
  async getScheduleNotificationById(@Param('id') id: string) {
    return this.service.getScheduleNotificationById(id);
  }

  @Post('pagination')
  async adminNotificationPagination(@Body() data: PaginationDto<any>) {
    return this.service.adminNotificationPagination(data);
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.service.getNotificationById(id);
  }

  @Patch('schedule/send/:id')
  async sendScheduleNotification(@Param('id') id: string) {
    return this.service.sendNotificationSchedule(id);
  }
  //#endregion
}
