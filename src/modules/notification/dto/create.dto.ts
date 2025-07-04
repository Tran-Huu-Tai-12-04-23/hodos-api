import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { IsArray, IsEnum } from 'class-validator';
import {
  NotificationChannel,
  NotificationType,
  ScheduledNotificationStatus,
} from 'src/entities';

export class CreateScheduledNotificationDto {
  @ApiProperty({
    description: 'Title of the notification',
    example: 'Upcoming Trip Reminder',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Main message/content of the notification',
    example: 'Your trip "Mountain Hike" starts in 3 days!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Type of the notification',
    enum: NotificationType,
    example: NotificationType.REMINDER,
  })
  @IsEnum(NotificationType)
  notificationType: NotificationType;

  @ApiProperty({
    description: 'Channel(s) to send the notification through',
    enum: NotificationChannel,
    isArray: true,
    example: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
  })
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @ApiProperty({
    description: 'Timestamp when the notification is scheduled to be sent',
    example: '2025-07-05T10:00:00Z',
  })
  @IsDateString()
  scheduledTime: Date;

  @ApiPropertyOptional({
    description: 'Optional data to be used when generating the notification',
    example: { tripName: 'Mountain Hike', daysLeft: 3 },
  })
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @ApiProperty({
    description: 'Target user IDs for the notification',
    isArray: true,
  })
  @IsArray()
  targetUserIds: string[];

  @ApiProperty({
    description: 'Is all users to be notified?',
    type: 'boolean',
  })
  @IsBoolean()
  isAllUser: boolean;
}
export class UpdateScheduleNotificationDto extends CreateScheduledNotificationDto {
  @ApiProperty({
    description: 'ID of the scheduled notification',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    description: 'Status of the scheduled notification',
    enum: ScheduledNotificationStatus,
    example: ScheduledNotificationStatus.PENDING,
  })
  @IsOptional()
  status?: ScheduledNotificationStatus;
}

export class CreateNotificationDto {
  @ApiProperty({})
  @IsOptional()
  metaData: any;

  @ApiProperty({
    description: 'ID of the user this notification is for',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID of the scheduled notification if applicable',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsOptional()
  scheduledNotificationId: string | null;

  @ApiProperty({
    description: 'Title of the notification',
    example: 'New Trip Invitation',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Main message/content of the notification',
    example: 'John Doe has invited you to their trip "Summer Adventure".',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'Indicates if the notification has been read by the user',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean = false;

  @ApiPropertyOptional({
    description: 'Timestamp when the notification was read',
    example: '2025-06-30T15:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  readAt?: Date;

  @ApiProperty({
    description: 'Type of the notification',
  })
  type: any;

  @ApiPropertyOptional({
    description: 'Timestamp when the notification was sent',
    example: '2025-06-30T15:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  sentAt?: Date;

  @ApiPropertyOptional({
    description:
      'Optional link to navigate to when the notification is clicked',
    example: '/trips/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  linkTo?: string;

  @ApiPropertyOptional({
    description: 'Optional metadata for the notification',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
