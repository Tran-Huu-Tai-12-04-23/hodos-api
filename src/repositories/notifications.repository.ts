import { NotificationEntity, ScheduledNotificationEntity } from 'src/entities';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(ScheduledNotificationEntity)
export class ScheduledNotificationRepository extends Repository<ScheduledNotificationEntity> {}

@CustomRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}
