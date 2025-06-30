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
  ],
  providers: [SepayService],
  controllers: [SepayController],
  exports: [SepayService],
})
export class SepayModule {}
