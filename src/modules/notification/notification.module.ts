import { Module } from '@nestjs/common';
import {
  NotificationRepository,
  ScheduledNotificationRepository,
  UserDeviceRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { EmailModule } from '../email/email.module';
import { FirebaseService } from './firebase.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      ScheduledNotificationRepository,
      UserDeviceRepository,
    ]),
    EmailModule,
  ],
  providers: [NotificationService, FirebaseService],
  controllers: [NotificationController],
  exports: [NotificationService, FirebaseService],
})
export class NotificationModule {}
