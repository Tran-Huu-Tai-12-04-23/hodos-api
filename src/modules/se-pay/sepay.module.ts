import { Module } from '@nestjs/common';

import {
  PricingPlanRepository,
  ReceivingBankRepository,
} from 'src/repositories/master-data.repository';
import {
  TransactionRepository,
  UserSubscriptionRepository,
} from 'src/repositories/transactions.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { TransactionModule } from '../transactions/transaction.module';
import { SepayController } from './sepay.controller';
import { SepayService } from './sepay.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TransactionRepository,
      PricingPlanRepository,
      UserSubscriptionRepository,
      ReceivingBankRepository,
    ]),
    TransactionModule,
    NotificationModule,
  ],
  providers: [SepayService],
  controllers: [SepayController],
  exports: [SepayService],
})
export class SepayModule {}
