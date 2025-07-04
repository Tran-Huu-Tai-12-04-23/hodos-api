import { Module } from '@nestjs/common';
import { BlogModule } from '../blog/blog.module';
import { LocationModule } from '../location/location.module';
import { LogModule } from '../log/log.module';
import { MasterDataModule } from '../master-data/master-data.module';
import { NotificationModule } from '../notification/notification.module';
import { PlanTripModule } from '../plan/plan-trip.module';
import { PostModule } from '../post/post.module';
import { TransactionModule } from '../transactions/transaction.module';
import { UserModule } from '../user/user.module';
import { AdminLogController } from './admin-log.controller ';
import { AdminNotificationController } from './admin-notification.controller';
import { AdminUserController } from './admin-user.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    BlogModule,
    LocationModule,
    TransactionModule,
    PostModule,
    PlanTripModule,
    MasterDataModule,
    LogModule,
  ],
  providers: [AdminService],
  controllers: [
    AdminNotificationController,
    AdminUserController,
    AdminLogController,
  ],
  exports: [AdminService],
})
export class AdminModule {}
