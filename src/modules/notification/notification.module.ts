import { Module } from '@nestjs/common';
import {
  NotificationRepository,
  ScheduledNotificationRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { EmailModule } from '../email/email.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      ScheduledNotificationRepository,
    ]),
    EmailModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
