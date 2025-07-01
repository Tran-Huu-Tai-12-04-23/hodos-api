import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationEntity } from 'src/entities';
import { NotificationRepository } from 'src/repositories';
import { v4 as uuidv4 } from 'uuid';
import { CreateNotificationDto } from './dto';

@Injectable()
export class NotificationService {
  constructor(
    public readonly configService: ConfigService,
    private readonly repo: NotificationRepository,
  ) {}

  /** create notification */
  async createNotification(
    data: CreateNotificationDto,
    userId: string,
    repo: any = this.repo,
  ) {
    const notification = new NotificationEntity();
    notification.id = uuidv4();
    notification.userId = userId;
    notification.title = data.title;
    notification.message = data.message;
    notification.isRead = data.isRead || false;
    notification.type = data.type;
    notification.metadata = data.metaData || {};
    notification.createdBy = 'SYSTEM';
    notification.createdAt = new Date();
    if (data.scheduledNotificationId) {
      notification.scheduledNotificationId = data.scheduledNotificationId;
    }
    await repo.insert(notification);
  }
}
