import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { PaginationDto } from 'src/dto/pagination.dto';
import {
  NotificationChannel,
  NotificationEntity,
  NotificationTypeData,
  ScheduledNotificationEntity,
  ScheduledNotificationStatus,
  UserEntity,
} from 'src/entities';
import {
  NotificationRepository,
  ScheduledNotificationRepository,
} from 'src/repositories';
import { In, Raw } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './../email/email.service';
import {
  CreateNotificationDto,
  CreateScheduledNotificationDto,
  UpdateScheduleNotificationDto,
} from './dto';

@Injectable()
export class NotificationService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: NotificationRepository,
    private readonly scheduleNotificationRepo: ScheduledNotificationRepository,
    private readonly emailService: EmailService,
  ) {}

  //#region  channel schedule notification
  /** run might hour  */
  async runScheduledNotification() {
    return this.repo.manager.transaction(async (trans) => {
      const scheduleRepo = trans.getRepository(ScheduledNotificationEntity);
      const notificationRepo = trans.getRepository(NotificationEntity);
      const userRepo = trans.getRepository(UserEntity);
      const now = new Date();

      // Use UTC for time zone correctness since scheduledTime is 'timestamp with time zone'
      const startHour = moment
        .utc(now)
        .set({
          minute: now.getUTCMinutes(),
          second: 0,
          millisecond: 0,
        })
        .toDate();
      const endHour = moment
        .utc(now)
        .set({
          minute: now.getUTCMinutes(),
          second: 59,
          millisecond: 999,
        })
        .toDate();

      const schedules = await scheduleRepo.find({
        where: {
          status: ScheduledNotificationStatus.PENDING,
          scheduledTime: Raw(
            (alias) => `${alias} BETWEEN :startHour AND :endHour`,
            { startHour, endHour },
          ),
        },
      });

      for (const schedule of schedules) {
        await scheduleRepo.update(schedule.id, {
          status: ScheduledNotificationStatus.SENT,
          updatedAt: new Date(),
          history: {
            ...schedule.history,
            [new Date().toISOString()]: {
              status: ScheduledNotificationStatus.SENT,
              message: 'Scheduled notification is being sent',
            },
          },
        });
        const whereUser: any = {};
        if (!schedule.isAllUser) {
          whereUser.id = In(schedule.targetUserIds);
        }
        const users = await userRepo.find({
          where: whereUser,
          select: ['id', 'email'],
        });

        for (const user of users) {
          const notification = new NotificationEntity();
          notification.id = uuidv4();
          notification.userId = user.id;
          notification.title = schedule.title;
          notification.message = schedule.message;
          notification.type = schedule.notificationType;
          notification.metadata = schedule.payload || {};
          notification.isRead = false;
          notification.createdBy = 'SYSTEM';
          notification.createdAt = new Date();
          if (
            schedule.channels?.includes(NotificationChannel.EMAIL) &&
            user.email
          ) {
            this.emailService.sendEmailNotification(user, notification);
          }
          if (schedule.channels?.includes(NotificationChannel.PUSH)) {
            console.log(`Sending push notification to user ${user.id}`);
          }
          await notificationRepo.insert(notification);
        }
      }

      return {
        message: 'Scheduled notifications processed successfully',
        count: schedules.length,
        schedules,
      };
    });
  }
  async scheduleNotificationPagination(body: PaginationDto<any>) {
    const { skip, take, where } = body;
    const query = this.scheduleNotificationRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user')
      .orderBy('schedule.createdAt', 'DESC')
      .skip(skip)
      .take(take);
    if (where?.status) {
      query.andWhere('schedule.status = :status', { status: where.status });
    }
    if (where?.isAllUser !== undefined) {
      query.andWhere('schedule.isAllUser = :isAllUser', {
        isAllUser: where.isAllUser,
      });
    }
    if (where?.scheduledTime?.gte) {
      query.andWhere('schedule.scheduledTime >= :gte', {
        gte: where.scheduledTime.gte,
      });
    }
    if (where?.scheduledTime?.lte) {
      query.andWhere('schedule.scheduledTime <= :lte', {
        lte: where.scheduledTime.lte,
      });
    }
    const res: any = await query.getManyAndCount();

    for (const item of res[0]) {
      const type =
        NotificationTypeData[
          item.notificationType as keyof typeof NotificationTypeData
        ];
      if (type) {
        item.typeData = type;
      }
    }
    return {
      data: res[0],
      total: res[1],
      skip,
      take,
    };
  }
  async createScheduleNotification(
    user: UserEntity,
    body: CreateScheduledNotificationDto,
  ) {
    const schedule = new ScheduledNotificationEntity();
    schedule.id = uuidv4();
    schedule.userId = user.id;
    schedule.targetUserIds = body.targetUserIds || [];
    schedule.title = body.title;
    schedule.message = body.message;
    schedule.notificationType = body.notificationType;
    schedule.channels = body.channels;
    schedule.scheduledTime = body.scheduledTime;
    schedule.payload = body.payload || {};
    schedule.isAllUser = body.isAllUser || false;
    schedule.createdBy = user.id;
    schedule.createdAt = new Date();
    schedule.history = {
      [new Date().toISOString()]: {
        status: ScheduledNotificationStatus.PENDING,
        message: 'Scheduled notification created',
      },
    };
    await this.scheduleNotificationRepo.insert(schedule);
    return {
      message: 'Scheduled notification created successfully',
      data: schedule,
    };
  }
  async updateScheduleNotification(
    user: UserEntity,
    body: UpdateScheduleNotificationDto,
  ) {
    const schedule = await this.scheduleNotificationRepo.findOne({
      where: { id: body.id },
    });
    if (!schedule) {
      throw new Error('Scheduled notification not found');
    }
    schedule.title = body.title || schedule.title;
    schedule.message = body.message || schedule.message;
    schedule.notificationType =
      body.notificationType || schedule.notificationType;
    schedule.channels = body.channels || schedule.channels;
    schedule.scheduledTime = body.scheduledTime || schedule.scheduledTime;
    schedule.payload = body.payload || schedule.payload;
    schedule.isAllUser = body.isAllUser ?? schedule.isAllUser;
    schedule.status = body.status || schedule.status;
    schedule.history = {
      ...schedule.history,
      [new Date().toISOString()]: {
        status: body.status || schedule.status,
        message: body.message || 'Scheduled notification updated',
        updateBy: user.id,
      },
    };
    schedule.updatedBy = user.id;
    schedule.updatedAt = new Date();
    if (body.targetUserIds && body.targetUserIds.length > 0) {
      schedule.targetUserIds = body.targetUserIds;
    }

    await this.scheduleNotificationRepo.save(schedule);
    return {
      message: 'Scheduled notification updated successfully',
      data: schedule,
    };
  }

  async deleteScheduleNotification(id: string) {
    const schedule = await this.scheduleNotificationRepo.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new Error('Scheduled notification not found');
    }
    if (schedule.status == ScheduledNotificationStatus.SENT) {
      throw new Error('Cannot delete a sent scheduled notification');
    }
    await this.scheduleNotificationRepo.delete(id);
    return {
      message: 'Scheduled notification deleted successfully',
      data: schedule,
    };
  }
  async getScheduleNotificationById(id: string) {
    const schedule: any = await this.scheduleNotificationRepo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!schedule) {
      throw new Error('Scheduled notification not found');
    }
    const type =
      NotificationTypeData[
        schedule.notificationType as keyof typeof NotificationTypeData
      ];
    if (type) {
      schedule.typeData = type;
    }
    return schedule;
  }
  //#endregion
  //#endregion notification
  async getNotificationById(id: string) {
    const notification: any = await this.repo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    const type =
      NotificationTypeData[
        notification.type as keyof typeof NotificationTypeData
      ];
    if (type) {
      notification.typeData = type;
    }
    return notification;
  }
  /** get notification by user  */
  async notificationPagination(userId: string, body: PaginationDto<any>) {
    const { skip, take, where } = body;
    const query = this.repo
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(take);
    if (where?.isRead) {
      query.andWhere('notification.isRead = :isRead', { isRead: where.isRead });
    }
    const res: any = await query.getManyAndCount();

    const userIds = res[0].map((item: any) => item.userId);
    const dictUserById = userIds.reduce((acc: any, item: any) => {
      acc[item.userId] = item.user;
      return acc;
    }, {});
    const unreadCount = await this.repo.count({
      where: {
        userId,
        isRead: false,
      },
    });

    for (const item of res[0]) {
      const type =
        NotificationTypeData[item.type as keyof typeof NotificationTypeData];
      if (type) {
        item.typeData = type;
      }
      item.user = dictUserById[item.userId] || null;
      item.username = item.user ? item.user.username : null;
      item.avatar = item.user ? item.user.avatar : null;
    }
    return {
      data: res[0],
      total: res[1],
      unreadCount,
      skip,
      take,
    };
  }
  /** create notification */
  async createNotification(
    data: CreateNotificationDto,
    userId: string,
    repo: any = this.repo,
    createdBy: string = 'SYSTEM',
  ) {
    const notification = new NotificationEntity();
    notification.id = uuidv4();
    notification.userId = userId;
    notification.title = data.title;
    notification.message = data.message;
    notification.isRead = data.isRead || false;
    notification.type = data.type;
    notification.metadata = data.metaData || {};
    notification.createdBy = createdBy;
    notification.createdAt = new Date();
    if (data.scheduledNotificationId) {
      notification.scheduledNotificationId = data.scheduledNotificationId;
    }
    await repo.insert(notification);
    await this.pushNotification();
  }

  async pushNotification() {}
  //#endregion

  //#endregion admin notification pagination
  async adminNotificationPagination(body: PaginationDto<any>) {
    const { skip, take, where } = body;
    const query = this.repo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    if (where?.isRead !== undefined) {
      query.andWhere('notification.isRead = :isRead', { isRead: where.isRead });
    }
    if (where?.type) {
      query.andWhere('notification.type = :type', { type: where.type });
    }
    if (where?.userId) {
      query.andWhere('notification.userId = :userId', { userId: where.userId });
    }
    if (where?.sentAt?.gte) {
      query.andWhere('notification.createdAt >= :gte', {
        gte: where.sentAt.gte,
      });
    }
    if (where?.sentAt?.lte) {
      query.andWhere('notification.createdAt <= :lte', {
        lte: where.sentAt.lte,
      });
    }
    if (where?.title?.contains) {
      query.andWhere('notification.title ILIKE :title', {
        title: `%${where.title.contains}%`,
      });
    }
    if (where?.message?.contains) {
      query.andWhere('notification.message ILIKE :message', {
        message: `%${where.message.contains}%`,
      });
    }

    const res: any = await query.getManyAndCount();

    for (const item of res[0]) {
      const type =
        NotificationTypeData[item.type as keyof typeof NotificationTypeData];
      if (type) {
        item.typeData = type;
      }
    }
    const unreadCount = await this.repo.count({
      where: {
        isRead: false,
      },
    });
    return {
      data: res[0],
      total: res[1],
      skip,
      take,
      unreadCount,
    };
  }
}
