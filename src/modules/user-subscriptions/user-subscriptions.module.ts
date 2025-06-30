import { Module } from '@nestjs/common';
import {
  TransactionRepository,
  UserSubscriptionRepository,
} from 'src/repositories';
import {
  PricingPlanRepository,
  ReceivingBankRepository,
} from 'src/repositories/master-data.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { SepayModule } from '../se-pay/sepay.module';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { UserSubscriptionsService } from './user-subscriptions.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserSubscriptionRepository,
      PricingPlanRepository,
      ReceivingBankRepository,
      TransactionRepository,
    ]),
    SepayModule,
  ],
  providers: [UserSubscriptionsService],
  controllers: [UserSubscriptionsController],
  exports: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}
