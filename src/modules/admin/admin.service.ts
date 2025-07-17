import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserEntity } from 'src/entities';
import {
  CreateScheduledNotificationDto,
  UpdateScheduleNotificationDto,
} from '../notification/dto';
import { NotificationService } from './../notification/notification.service';

@Injectable()
export class AdminService {
  constructor(private readonly notificationService: NotificationService) {}

  //#region notification
  sendNotificationSchedule(id: string) {
    return this.notificationService.sendNotificationSchedule(id);
  }
  scheduleNotificationPagination(data: PaginationDto<any>) {
    return this.notificationService.scheduleNotificationPagination(data);
  }
  createScheduleNotification(
    user: UserEntity,
    body: CreateScheduledNotificationDto,
  ) {
    return this.notificationService.createScheduleNotification(user, body);
  }
  async updateScheduleNotification(
    user: UserEntity,
    body: UpdateScheduleNotificationDto,
  ) {
    return await this.notificationService.updateScheduleNotification(
      user,
      body,
    );
  }

  async deleteScheduleNotification(id: string) {
    return await this.notificationService.deleteScheduleNotification(id);
  }

  getScheduleNotificationById(id: string) {
    return this.notificationService.getScheduleNotificationById(id);
  }

  adminNotificationPagination(data: PaginationDto<any>) {
    return this.notificationService.adminNotificationPagination(data);
  }

  getNotificationById(id: string) {
    return this.notificationService.getNotificationById(id);
  }
  //#endregion
}
