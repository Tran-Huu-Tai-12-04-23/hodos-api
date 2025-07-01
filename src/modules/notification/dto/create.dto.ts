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
