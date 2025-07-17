import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { UserSubscriptionsModule } from '../user-subscriptions/user-subscriptions.module';
import { ScaleController } from './scale.controller';
import { ScaleService } from './scale.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    NotificationModule,
    UserSubscriptionsModule,
  ],
  controllers: [ScaleController],
  providers: [ScaleService],
  exports: [ScaleService],
})
export class ScaleModule {}
