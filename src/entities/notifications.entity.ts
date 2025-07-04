import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
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

export const NotificationTypeData = {
  [NotificationType.INFO]: {
    color: '#2196F3',
    name: 'Information',
    description: 'General information notifications.',
  },
  [NotificationType.REMINDER]: {
    color: '#FF9800',
    name: 'Reminder',
    description: 'Reminders for upcoming events or actions.',
  },
  [NotificationType.ALERT]: {
    color: '#F44336',
    name: 'Alert',
    description: 'Important alerts that require immediate attention.',
  },
  [NotificationType.RECOMMENDATION]: {
    color: '#4CAF50',
    name: 'Recommendation',
    description: 'Recommendations based on user preferences or behavior.',
  },
  [NotificationType.TRIP_UPDATE]: {
    color: '#9C27B0',
    name: 'Trip Update',
    description: 'Updates related to trips or travel plans.',
  },
  [NotificationType.NEW_CONTENT]: {
    color: '#3F51B5',
    name: 'New Content',
    description: 'Notifications about new content available in the app.',
  },
};

export const NotificationChannelData = {
  [NotificationChannel.IN_APP]: {
    color: '#4CAF50',
    name: 'In-App Notification',
    description: 'Notifications that appear within the application.',
  },
  [NotificationChannel.EMAIL]: {
    color: '#2196F3',
    name: 'Email Notification',
    description: 'Notifications sent via email.',
  },
  [NotificationChannel.PUSH]: {
    color: '#FF9800',
    name: 'Push Notification',
    description: 'Notifications sent to mobile devices.',
  },
};

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
  @Column({ type: 'uuid', nullable: true })
  scheduledNotificationId: string;

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
