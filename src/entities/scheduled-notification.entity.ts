import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { NotificationChannel, NotificationType } from './notifications.entity';
import { UserEntity } from './user.entity'; // Assuming you have a UserEntity

export enum ScheduledNotificationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('scheduled_notifications')
@Index(['scheduledTime', 'status'])
export class ScheduledNotificationEntity extends BaseEntityCustom {
  @ApiProperty({
    description:
      'ID of the user this scheduled notification is for (optional, can be for a group or topic)',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  // Fields for notification content if not linking to a pre-defined template
  @ApiProperty({
    description: 'Title of the notification',
    example: 'Upcoming Trip Reminder',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiProperty({
    description: 'Main message/content of the notification',
    example: 'Your trip "Mountain Hike" starts in 3 days!',
  })
  @Column({ type: 'text', nullable: false })
  message: string;

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
  notificationType: NotificationType;

  @ApiProperty({
    description: 'Channel(s) to send the notification through',
    enum: NotificationChannel,
    isArray: true,
    enumName: 'notification_channel',
  })
  @Column({
    type: 'enum',
    enum: NotificationChannel,
    array: true,
    nullable: false,
    enumName: 'notification_channel',
  })
  channels: NotificationChannel[];

  @ApiProperty({
    description: 'Timestamp when the notification is scheduled to be sent',
    example: '2024-06-08T10:00:00Z',
  })
  @Column({ type: 'timestamp with time zone', nullable: false })
  scheduledTime: Date;

  @ApiProperty({
    description: 'Status of the scheduled notification',
    enum: ScheduledNotificationStatus,
    example: ScheduledNotificationStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: ScheduledNotificationStatus,
    default: ScheduledNotificationStatus.PENDING,
  })
  status: ScheduledNotificationStatus;

  @ApiProperty({
    description:
      'Optional data to be used when generating the notification (e.g., template variables)',
    type: 'object',
    additionalProperties: true,
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @ApiProperty({
    description:
      'Timestamp when the notification was actually processed/sent (if applicable)',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  processedAt?: Date;

  @ApiProperty({
    description: 'Error message if sending failed',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @ApiProperty({
    description: 'Number of retry attempts made',
    example: 0,
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  retryAttempts: number;

  @ApiProperty({
    description:
      'History of changes or actions taken on this scheduled notification',
    type: 'object',
    additionalProperties: true,
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  history?: Record<string, any>;

  @ApiProperty({
    description: 'Target user ID for the notification',
    isArray: true,
  })
  @Column({
    type: 'uuid',
    array: true,
    nullable: true,
  })
  targetUserIds: string[];

  @ApiProperty({
    description: 'Channel(s) to send the notification through',
    enum: NotificationChannel,
    isArray: true,
    enumName: 'notification_channel',
  })
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isAllUser: boolean;
}
