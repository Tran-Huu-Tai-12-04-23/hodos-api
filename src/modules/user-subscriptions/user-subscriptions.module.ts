import { Module } from '@nestjs/common';
import {
  PricingPlanRepository,
  UserSubscriptionRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { UserSubscriptionsService } from './user-subscriptions.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserSubscriptionRepository,
      PricingPlanRepository,
    ]),
  ],
  providers: [UserSubscriptionsService],
  controllers: [UserSubscriptionsController],
  exports: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}
