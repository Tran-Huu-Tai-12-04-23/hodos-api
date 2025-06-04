import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { ScheduledNotificationEntity } from './scheduled-notification.entity';
import { UserEntity } from './user.entity'; // Assuming you have a UserEntity

export enum NotificationType {
  INFO = 'info',
  REMINDER = 'reminder',
  ALERT = 'alert',
  RECOMMENDATION = 'recommendation',
  TRIP_UPDATE = 'trip_update',
  NEW_CONTENT = 'new_content',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push', // Mobile push notification
}

@Entity('notifications')
export class NotificationEntity extends BaseEntityCustom {
  @ApiProperty({
    description: 'ID of the user this notification is for',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' }) // Assuming UserEntity has a 'notifications' one-to-many relation
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({
    description: 'ID of the user this notification is for',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @Column({ type: 'uuid' })
  scheduledNotificationId: string;

  @ManyToOne(
    () => ScheduledNotificationEntity,
    (scheduleNotification) => scheduleNotification.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'scheduledNotificationId' })
  scheduleNotification: ScheduledNotificationEntity;

  @ApiProperty({
    description: 'Title of the notification',
    example: 'New Trip Invitation',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiProperty({
    description: 'Main message/content of the notification',
    example: 'John Doe has invited you to their trip "Summer Adventure".',
  })
  @Column({ type: 'text', nullable: false })
  message: string;

  @ApiProperty({
    description: 'Indicates if the notification has been read by the user',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ApiProperty({
    description: 'Timestamp when the notification was read',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  readAt?: Date;

  @ApiProperty({
    description: 'Type of the notification',
    enum: NotificationType,
    enumName: 'notification_type',
  })
  @Column({
    type: 'enum',
    enum: NotificationType,
    nullable: false,
    enumName: 'notification_type',
  })
  type: NotificationType;

  @ApiProperty({
    description:
      'Timestamp when the notification was actually sent or generated',
    example: '2024-06-05T10:00:00Z',
  })
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sentAt: Date;

  @ApiProperty({
    description:
      'Optional link to navigate to when the notification is clicked',
    example: '/trips/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    required: false,
  })
  @Column({ type: 'varchar', length: 512, nullable: true })
  linkTo?: string;

  @ApiProperty({
    description:
      'Optional metadata for the notification (e.g., related entity ID)',
    type: 'object',
    additionalProperties: true,
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;
}
